$(function(){
    $("#bar").load("/bar/bar.html")

    //avendo fatto l'accesso si ha la possibilià di aggiungere delle "armi" alla lista di "armi" trovate
    if(document.cookie != ""){
        $("#checkboxdiv").show()
        $("#armatrovatacheck").on("click", function(ev){aggiungiAListaTrovate(ev)})
    }
})

//viene mostrato un popup quando viene clickata la checkbox
function armaChecked(msg){
    $("#popupcontent").text(msg)
    $("#popup").show()
    setTimeout(()=>{$("#popup").hide()}, 1000)
}

//viene mandata al server la richiesta di aggiungere/rimuovere l'arma dalla lista dell'utente
function aggiungiAListaTrovate(ev){
    arma = $("#nome").text()
    azione = $("#armatrovatacheck").prop("checked")

    dati = {arma: arma, azione: azione}

    $.ajax({
        url: "/aggiungi",
        type: "post",
        data: JSON.stringify(dati),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(data, status){
            if(data.successo)
                armaChecked(azione ? "Aggiunta alla lista!" : "Rimossa dalla lista!")
            else{
                armaChecked("Errore, riprova!!")
                $("#armatrovatacheck").prop("checked", (i, val) => {return !val})
            }
        }
    })
}