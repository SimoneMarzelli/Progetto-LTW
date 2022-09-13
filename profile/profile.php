<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css"/>
    <link rel="stylesheet" href="/style.css"/>
    <script src="profile.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Elden Ring Wiki</title>
    <script>
        $(function(){
            $("#bar").load("/bar/bar.html")
        })
    </script>
</head>
<body class="bg-black text-center">

    <div id="bar"></div>
    
    <picture>
        <img src="../Immagini/loghi/EldRin.png" style="width: 30%; margin-top: 2%;">
    </picture>
    <div class="mt-5">
        <p style="color: rgb(197, 158, 92); font-family: papyrus; font-size: 300%;">Progressi</p>
        <p>Tieni traccia dei tuoi progressi! <br>
            Qui troverai le armi già prese e quelle ancora da trovare.
        </p>
        <div class="card1" style="padding: 1%; border: 2px dotted rgb(197, 158, 92);">
            <h3 style="margin-top: 2%;">Armi trovate</h3>
                <hr style="margin-top: 5%;">
                <ul style="list-style-type: none; font-size: medium;">
                    <?php
                        //viene costruita una lista delle "armi" trovate dall'utente con un link verso la loro pagina
                        $conn = new mysqli("127.0.0.1", "root", "dimenticata", "progettoltw", 3306);
                        if ($conn->connect_error) {
                            die("Connection failed: " . $conn->connect_error);
                        }
                        $user = $argv[1];
                        $result = $conn->query("select armitrovate from users where username = '" . $user . "'");
                        
                        if ($result->num_rows > 0) {
                            $row = $result->fetch_assoc();
                            $armi = explode("&", $row["armitrovate"]);
                            foreach($armi as $arma)
                                if($arma != "")
                                    echo '<li><a style="color: white; text-decoration: none" href="/q?tipo=armi&nome='. $arma . '">' . $arma . '</a></li>';
                            }
                    

                        echo   '</ul>
                        </div>
                        <div class="card2" style="padding: 1%; border: 2px dotted rgb(197, 158, 92);">
                        <h3 style="margin-top: 2%;">Armi da trovare</h3>
                        <hr style="margin-top: 5%;">
                        <ul style="list-style-type: none; font-size: medium;">';

                        //viene confrontata la lista di tutte le "armi" nel database con la lista delle "armi" trovate dall'utente, 
                        //per creare una lista delle armi non trovate, anche qui con i propri link
                        $result = $conn->query("select nome from armi");

                            if ($result->num_rows > 0) {
                                while($row = $result->fetch_assoc()){
                                    if(!in_array($row["nome"], $armi))
                                        echo '<li><a style="color: white; text-decoration: none" href="/q?tipo=armi&nome='. $row["nome"] . '">' . $row["nome"] . '</a></li>';
                                }
                                }
                            ?>
            </ul>
            </div>
    </div>
</body>
</html>