<!DOCTYPE html>
<html lang="it">
<head>
    <!--pagina dove vengono elencati gli oggetti di una determinata categoria-->
    <meta charset="UTF-8">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.css"/>
    <link rel="stylesheet" href="/style.css"/>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
        $(function(){
            $("#bar").load("/bar/bar.html")
        })
    </script>
    <title>Armi</title>
</head>
<body class="bg-black text-center">
    <div id="bar"></div>
    <picture class="logo">
        <img src="../Immagini/loghi/elden-ring-wiki-game1.png" style="width: 30%; margin-top: 2%;">
    </picture>
    <div class="d-table mt-5">
        <?php echo '<h1 class="text-center"><hr size="3px">' . ucfirst($argv[1]) . '<hr size="3px"></h1>'; ?>
        <div class="grid-container1">
            <?php 
                $conn = new mysqli("127.0.0.1", "root", "dimenticata", "progettoltw", 3306);
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }
                $tipo = $argv[1]; //in base all'argomento passato allo script, questa pagina visualizzerà le "armi" o i "consumabili"

                $sql = "SELECT nome, immagine FROM " . $tipo;
                $img_path = "/Immagini/" . $tipo . "/";
                $temp_url = "/q?tipo=" . $tipo . "&nome=";

                $result = $conn->query($sql);
                
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()){
                        $nome = $row["nome"];
                        $img = $img_path . $row["immagine"];
                        $url = $temp_url . $nome;
                        
                        echo sprintf('<article class="listing">
                                    <a class="title" style="color: white" href="%s">%s</a>
                                    <div class="image">
                                    <a href="%s">
                                        <img src="%s">
                                    </a>
                                    </div>
                                </article>', $url, $nome, $url, $img);
                        }
                }
                $conn->close();
            ?>
        </div>
    </div>
</body>
</html>