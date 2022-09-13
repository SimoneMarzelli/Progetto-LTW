<!DOCTYPE html>
<html lang="it">
<head>
    <!--pagina per la creazione e modifica delle pagine sugli oggetti-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Armi</title>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css"/>
    <link rel="stylesheet" href="/style.css"/> 
    <script>
        $(function(){
            $("#bar").load("/bar/bar.html")
        })
    </script>
    <script src="edit.js"></script>
</head>
<body class="bg-black" style="width: 100%;">
    <div id="bar" style="width: 100%;"></div>
    <form id="datiform" method="post" enctype="multipart/form-data">
    <div class="d-table mt-5" style="padding: 5%;text-align: left;">
        <div class="d-inline-block">
            <label>Tipo</label>
            <br>
            <select id="tipo" name="tipo" style="align-self: left;" required>
                <option value="arma">Arma</option>
                <option value="consumabile">Consumabile</option>
            </select>
            <br>
            <br>
            <div>
                <label>Nome</label>
                <div>
                    <input type="text" id="nome" name="nome" maxlength="50" required>
                    <select id="selectedname" name="selectedname" style="display: none;" disabled required>
                        <optgroup label="Armi" id="group1" style="font-size: 15px">
                        
                        <?php
                            //poichè possono essere create nuove pagine, le liste degli oggetti vengono generate con del codice php e inserite in una select,
                            //divisi in 2 optgroup
                            $conn = new mysqli("127.0.0.1", "root", "dimenticata", "progettoltw", 3306);
                            if ($conn->connect_error) {
                                die("Connection failed: " . $conn->connect_error);
                            }
                            $result = $conn->query("select nome from armi");
                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()){
                                    $nome = $row["nome"];
                                    echo '<option value="' . $nome . '">' . $nome . '</option>';
                                    }
                                }
                            echo '<optgroup label="Consumabili" id="group2"  style="font-size: 15px" disabled>';
                            $result = $conn->query("select nome from consumabili");
                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()){
                                    $nome = $row["nome"];
                                    echo '<option value="' . $nome . '">' . $nome . '</option>';
                                    }
                                }
                        ?>
                    </select>
                </div>        
                    <div>
                        <label>Nuovo</label>
                        <input type="radio" id="nuovo" name="scelta" value="nuovo" checked>
                        <label>Modifica</label>
                        <input type="radio" id="modifica" name="scelta" value="modifica">
                    </div>
                </div>
            <br>
            <div>
                <label>Descrizione</label>
                <br>
                <textarea id="descrizione" name="descrizione" maxlength="250" cols="50" rows="4" required></textarea>
            </div>
            <br>
            <div>
                <label>Info</label>
                <br>
                <textarea id="info" name="info" maxlength="250" cols="50" rows="4" required></textarea>
            </div>
            <br>
        </div>

        <!--questa parte viene mostrata solo se "tipo" è impostato su "arma"-->
        <div class="d-inline-block" style="vertical-align: top;" id="entryarma">
            <label>Tipo Danno</label>
            <br>
            <select id="tipodanno" name="tipodanno" required>
                <option value="Contundente">Contundente</option>
                <option value="Taglio">Taglio</option>
                <option value="Magico">Magico</option>
            </select>
            <br>
            <br>
            <div>
                <label>Categoria</label>
                <br>
                <select id="categoria" name="categoria" required>
                    <option value="Arma Colossale">Arma Colossale</option>
                    <option value="Coltello">Coltello</option>
                    <option value="Spada Corta">Spada Corta</option>
                    <option value="Arco">Arco</option>
                    <option value="Sigillo">Sigillo</option>
                    <option value="Incantesimo">Incantesimo</option>
                    <option value="Ascia">Ascia</option>
                    <option value="Frecce">Frecce</option>
                    <option value="Alabarda">Alabarda</option>
                </select>
            </div>
            <br>
            <div>
                <label>Requisiti</label>
                <br>
                <input type="text" id="requisiti" name="requisiti" maxlength="250" required>
            </div>
            <br>
            <div>
                <label>Abilità</label>
                <br>
                <input type="text" id="abilita" name="abilita" maxlength="250" required>
            </div>
            <br>
            <div>
                <label>Scaling</label>
                <br>
                <input type="text" id="scaling" name="scaling" maxlength="30" required>
            </div>
            <br>
            <div>
                <label>Peso</label>
                <br>
                <input type="number" name="peso" id="peso" value="1" min="1" max="50">
            </div>
            <br>
            <div>
                <label>Costo</label>
                <br>
                <input type="number" name="costo" id="costo" value="1" min="1" max="30">
            </div>
            <br>
        </div>
        <div>
            <input type="file" id="immagine" name="immagine" accept="image/png, image/jpeg, image/jpg" required >         
        </div>
        <br>
        <input type="submit" value="Invia">
    </div>
</form>
<div class="popup" id="messaggio">
        <div class="popupcontent" id="contenuto">
        </div>
    </div>
</body>
</html>
