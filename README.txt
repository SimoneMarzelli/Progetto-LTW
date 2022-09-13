-server.js: server scritto in nodejs che è la base del sito
-home.html: homepage del sito
-notfound.html: pagina a cui si viene reindirizzati nel caso il server non riesca a soddisfare una richiesta
-search.php: pagina che mostra in una griglia tutte le "armi"/"consumabili" contenuti nel database
-style.css: foglio di stile usato dal sito

bar:
  -bar.html: menu del sito
  -bar.js: script js utilizzati

classi:
  -presentazione_classi.html: pagina che presenta in una griglia le altre pagine contenute nella cartella
  -resto: pagine statiche della categoria "classi"

edit:
  -edit.php: pagina che permette la creazione e la modifica di pagine relative agli oggetti
  -edit.js: script js utilizzati

immagini: immagini utilizzate dal sito, divise in sottocategorie

login:
  -login.html: pagina per il login
  -login.js: script js utilizzati

profile:
  -profile.php: pagina per mostrare i progressi fatti dall'utente registrato

register:
  -register.html: pagina per la creazione di un account
  -register.js: script js utilizzati

template: 
  -armi_template/consumabili_template.html: template utilizzati dal server per la creazione delle pagine richieste
  -arma_template.js: script js utilizzati da armi_template