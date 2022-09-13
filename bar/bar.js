$(function(){

    //apertura e chiusura menu laterale visibile solo da mobile
    $("#apriMenuLaterale").on("click", () => {
        document.getElementById("menuLaterale").style.width = "270px"
        })

    $("#chiudiMenuLaterale").on("click", () => {
        document.getElementById("menuLaterale").style.width = "0px"
        })
    
    profile = '<a href="/profile">Visualizza progresso</a>'
    modifica = '<a href="/edit">Modifica pagine</a>'
    login = '<a href="/login/login.html">Accedi</a>'
    register = '<a href="/register/register.html">Registrati</a>'

    //se l'utente ha eseguito il login avrà accesso alle funzioni di logout e visualizzazione dei propri progressi
    if(document.cookie){
        user = document.cookie.split("user=")[1]
        $("#menuLaterale").append(profile, '<a href="javascript:void(0)" id="logoutLaterale">Logout</a><a href="javascript:void(0)" id="eliminaaccountLaterale">Elimina account</a>')
        $("#divdestro").append(`<a href="javascript:void(0)" id="apriMenuProfilo">${user}</a>`)

        //se l'utente è un "admin" (ovviamente si può scegliere una qualsiasi altra policy) potrà anche modificare e aggiungere pagine al database
        if(user == "admin"){
            $("#menuLaterale, #menuProfilo").append(modifica)
        }
    }

    //se invece l'utente non ha fatto l'accesso al sito, mostra solo le funzioni di login e registrazione
    else{
        $("#menuLaterale, #divdestro").append(login)
        $("#menuLaterale, #divdestro").append(register)
    }
    
    //apertura e chiusura menu laterale visibile da desktop
    $("#apriMenuProfilo").on("click hover mouseover", () => {
        document.getElementById("menuProfilo").style.width = "250px"
        })

    $("#chiudiMenuProfilo").on("click", () => {
        document.getElementById("menuProfilo").style.width = "0px"
        })

    $("#menuProfilo").on("mouseleave", () => {
        document.getElementById("menuProfilo").style.width = "0px"
        })

    //assegnazione event handler
    $("#annulla").on("click", function(){$("#popup").hide()})
    $("#conferma").on("click", function() {delacc()})

    $("#eliminaaccount, #eliminaaccountLaterale").on("click", function(){$("#popup").show()})
    $("#logout, #logoutLaterale").on("click", function() {logout()})

})

//mostra popup con un testo custom
function showPopup(msg){
    $("#popupcontent").text(msg)
    $("#popup").show()
    setTimeout(function(){window.location = "/"}, 1500);
}

//eliminazione cookies impostando una data passata come scadenza
function deleteCookies(){
    let cookie = document.cookie.split(";")[0]
    document.cookie = cookie + ";expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;"
}

function logout(){
    deleteCookies()
    window.localStorage.clear()
    showPopup("Logout effettuato!")
}

//funzione per eliminazione account
function delacc(){
    const re = /user=(\w+)/
    user = document.cookie.match(re)[1] //estrazione nome utente da cookie
    deleteCookies()

    $("#annulla").prop("disabled", true)

    arr = {user: user}
    $.ajax({
        url: '/delacc',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(data, status){
            if(data.success){
                showPopup("Account eliminato!")
            }
        }
    });
}