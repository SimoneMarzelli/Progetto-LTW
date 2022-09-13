const express = require("express");
const cors = require("cors")
const bodyParser = require('body-parser');
const mysql = require('mysql')
const cheerio = require("cheerio")
const cookieParser = require('cookie-parser');
const multer = require("multer")
const fs = require("fs")
var exec = require("child_process").exec;
const path = require('path');


//elenco degli oggetti di una determinata categoria, righe 43-54
//creazione della pagina richiesta, righe 68-112
//gestione richiesta informazioni da pagina di modifica, 115-141
//aggiunta/modifica di una pagina, righe 144-203
//aggiunta/rimozione di un'"arma" dalla lista di un utente, righe 206-227
//eliminazione account, righe 230-239
//login e registrazione, righe 242-277

const credentials = {
	host: "localhost",
	user: 'root', 
  	password: 'dimenticata',
  	database: 'progettoltw',
  	port: 3306
	};

const client = mysql.createConnection(credentials);

const app = express();

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(__dirname));


app.get('/',(req, res) => {
  	res.redirect("/home.html");
  	});

//gli script php vengono eseguiti (con eventuali argomenti) e il risultato viene inviato al client
app.get('/armi', function(req, res){
	exec("php search.php armi", function (error, stdout, stderr) { //viene passato l'argomento "armi" allo script per visualizzare gli oggetti di tipo "arma"
		res.send(stdout);
		});
	});

app.get('/consumabili', function(req, res){
	exec("php search.php consumabili", function (error, stdout, stderr) {  //passando "consumabili" invece visualizzerà gli oggetti di tipo "consumabile"
		res.send(stdout);
		});
	});

app.get('/edit', function(req, res){
	exec("php ./edit/edit.php ".replace("/", path.sep), function (error, stdout, stderr) {
		res.send(stdout);
		});
	});

app.get("/profile", function(req, res){
	exec("php ./profile/profile.php ".replace("/", path.sep) + req.cookies.user, function (error, stdout, stderr) {
		res.send(stdout);
		});
})

//creazione di una pagina richiesta inserendo i dati presi da database in una delle 2 pagine template
app.get("/q", function(req, res){
	nome = req.query.nome
	tipo = req.query.tipo

	//scelta pagina template, cartella dove reperire le immagini e query in base al tipo 
	template_path = `/template/${tipo}_template.html`
	img_path = `/Immagini/${tipo}/` 
	statement = `select * from ${tipo} where nome = ?`

	client.query(statement, [nome], (err, results, field) =>{
		if(err || results.length == 0)
			return res.redirect("/notfound.html")
		

		user = req.cookies.user ? req.cookies.user : "" //controlla se la richiesta è stata fatta da un utente che ha fatto l'accesso al sito
		client.query("select armitrovate from users where username = ?", [user], (err, armitrovate) =>{ //ricavo la lista delle armi trovate dall'utente
			if(err){
				console.log(err);
				return res.end()
			}
			
			results = results[0]
			checked = armitrovate.length > 0 ? armitrovate[0].armitrovate.split("&").includes(results.nome) : false //se l'arma è stata trovata dall'utente, 
																													//la checkbox sarà già marcata
			
			template = fs.readFileSync( __dirname + template_path.replace("/", path.sep), "utf-8") //viene caricata la pagina template
			var pagina = cheerio.load(template)

			//la pagina template viene riempita con i dati prese dal database con la prima query
			pagina("#nome").text(results.nome)
			pagina("#descrizione").append(results.descrizione)
			pagina("#info").append(results.info)
			pagina("#immagine").attr("src", (img_path + results.immagine).replace("/", path.sep))
			pagina("#scaling").text(results.scaling)
			pagina("#requisiti").text(results.requisiti)
			pagina("#categoria").text(results.categoria)
			pagina("#tipodanno").text(results.tipodanno)
			pagina("#abilita").text(results.abilita)
			pagina("#costo").text("" + results.costo)
			pagina("#peso").text("" + results.peso)
			pagina("#armatrovatacheck").prop("checked", checked)

			res.send(pagina.html()).end() //la pagina completa viene inviata e la connessione chiusa
	})
})
})

//gestione richiesta dati dalla pagina di modifica
app.get("/getdata", (req, res) => {
	nome = req.query.nome
	tipo = req.query.tipo == "arma" ? "armi" : "consumabili"
	statement = `select * from ${tipo} where nome = ?`

	client.query(statement, [nome], (err, results, fields) =>{ //si prendono le informazioni relative all'oggetto
		if(err || results.length == 0){
			console.log(err);
			return res.send({errore: true})
		}
		results = results[0]

		//le informazioni vengono poi inviate attraverso un file JSON
		data = {descrizione: results.descrizione,
				info: results.info,
				scaling: results.scaling,
				requisiti: results.requisiti,
				categoria: results.categoria,
				tipodanno: results.tipodanno,
				abilita: results.abilita,
				costo: parseInt(results.costo),
				peso: parseInt(results.peso),
				tipo: tipo
			}
		return res.send(data).end()
	})
})

//creazione/modifica dei dati
app.post("/senddata", (req, res) =>{
	tipo = req.query.tipo
	if(tipo == "arma")
		cartella = "./Immagini/armi"
	else
		cartella = "./Immagini/consumabili"

	//viene scelta la directory in cui salvare l'immagine inviata
	let storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, cartella.replace("/", path.sep))
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname)
		}
	})
	
	const upload = multer({ storage }).single('img');
	upload(req, res, (err) =>{
		arr = JSON.parse(req.body.arr)

		//la query da eseguire cambia in base al tipo dell'oggetto e all'azione da eseguire (aggiunta o modifica)
		if(arr.tipo == "arma"){
			if(arr.modifica === true){
				statement = "update armi set descrizione = ?, info = ?, scaling = ?, requisiti = ?, categoria = ?, tipodanno = ?, abilita = ?, costo = ?, immagine = ?, peso = ? where nome = ?"	
				values = [arr.descrizione, arr.info, arr.scaling, arr.requisiti, arr.categoria, arr.tipodanno, arr.abilita, parseInt(arr.costo), arr.immagine, parseInt(arr.peso), arr.nome]
			}
			else{
				statement = "insert into armi values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
				values = [arr.nome, arr.descrizione, arr.info, arr.scaling, arr.requisiti, arr.categoria, arr.tipodanno, arr.abilita, parseInt(arr.costo), arr.immagine, parseInt(arr.peso)]
				}
			}
		else{
			if(arr.modifica == true){
				statement = "update consumabili set descrizione = ?, info = ?, immagine = ? where nome = ?"
				values = [arr.descrizione, arr.info, arr.immagine, arr.nome]
			}
			else{
				statement = "insert into consumabili values(?, ?, ?, ?)"
				values = [arr.nome, arr.descrizione, arr.info, arr.immagine]
			}
			}

			//i dati vengono inseriti nel database
			client.query(statement, values, (err, results, field) =>{
				if(err){
					if(err.code == "ER_DUP_ENTRY")
						res.send({dup: true})
					else{
						console.log(err.code); res.send({warn: true})
					}
				}
				else{
					res.send({yatta: true})
				}
				res.end()
			})
	})

});

//aggiunta/rimozione arma alla lista delle armi trovate dall'utente
app.post("/aggiungi", (req, res) =>{
	arma = req.body.arma
	user = req.cookies.user
	aggiungi = req.body.azione

	client.query("select armitrovate from users where username = ?", [user], (err, results) =>{ //si prende la lista delle armi trovate dall'utente, poi modificarla
		trovate = results[0].armitrovate.split("&")
		if(aggiungi)
			trovate.push(arma)
		else
			trovate.pop(trovate.indexOf(arma))
		trovate = trovate.join("&")

		client.query("update users set armitrovate = ? where username = ?", [trovate, user], (err) =>{ //la lista viene aggiornata
			if(err){
				console.log(err);
				return res.send({errore: true}).end()
			}
			return res.send({successo: true}).end()
		})
	})
})

//eliminazione account
app.post("/delacc", function(req, res){
	user = req.body.user
	client.query("delete from users where username = ?", [user], (err) => {
		if(err){
			console.log(err);
			return res.send({error: true}).end()
		}
	return res.send({success: true}).end()
	})
})

//login
app.post("/login", (req, res) => {
  	let username = req.body.username
  	let password = req.body.pw
  	const prepStmnt = "select * from users where username = ? and password = ?"

	client.query(prepStmnt, [username, password], (err, results, fields) => {
		console.log(err);
		if(results.length > 0){
			res.send({redirect: '/'})
			}
		else{
			res.send({showWarning: true})
		}
		res.end()
			});
		});

//registrazione
app.post("/register", (req, res) => {
	let username = req.body.username
	let password = req.body.pw
	const prepStmnt = "select * from users where username = ?"
	const prepStmnt2 = "insert into users(username, password, armitrovate) values(?, ?, '')"

	client.query(prepStmnt, [username], (err, results, fields) => {
		if(results.length > 0){
			res.send({showWarning: true})
			}
		else{
			client.query(prepStmnt2, [username, password]);
			res.send({redirect: '/'})
		}
		res.end()
			});
		});

//se viene fatta una richiesta impossibile da gestire altrimenti, viene inviata una pagina di errore
app.get('*', (req, res) =>{
	res.status(404).redirect("/notfound.html")
});

app.listen(3000, () => {
  	console.log("Started on PORT 3000");
	});