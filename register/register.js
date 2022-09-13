$(function(){

    if(document.cookie != ""){ //se si cerca di accedere alla pagina di registrazione dopo averlo già eseguito, si viene reindirizzati alla homepage
        window.location = "/"
    }
    
    //aggiunta event handler
    $("#password1, #password2, #username").on("input paste change", function(){check()})

    $("#submit").on("click paste", function(){register()})

})

//invio dati al server attraverso una "post" con Ajax
function register(){
    var user = $("#username").val();
    var pass1= $("#password1").val();
    var pass2 = $("#password2").val();

    if(user === "" || pass1 === "" || pass2 === ""){
        alert("Riempi i campi username e password")
        throw("err")
    }
    if(pass1 != pass2){
        alert("Le password devono essere uguali")
        throw("err")
    }
    var arr = { username: user, pw: pass1 };
    exp = ""

    if($("#rmb").prop("checked")){
        exp = "expires=Thu, 18 Dec 9999 12:00:00 UTC"   //se il pulsante "ricordami" viene marcato il cookie di autenticazione non verrà eliminato alla 
                                                         //chiusura del browser
    }

    $.ajax({
        url: '/register',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(data, status){
            if(data.redirect){
                document.cookie = "user=" + user + "; path=/;" + exp
                $("#popup").show()
                setTimeout(function(){window.location = "/"}, 1000);
            }
            if(data.showWarning){
                $("#alreadySignedin").show()
            }
        }
        });
    }

//controlli sulle password
function pwLenCheck(){
    pass = $("#password1").val();
    if(pass.length < 5){
        $("#pwLenWarning").css("visibility", "visible")
        return true
    }
    else{
        $("#pwLenWarning").css("visibility", "hidden")
        return false
    }
}
function pwsCheck(){
    pass1 = $("#password1").val();
    pass2 = $("#password2").val();

    if(pass1 !== pass2){
        $("#pwDifferentWarning").css("visibility", "visible")
        return true
    }
    else{
        $("#pwDifferentWarning").css("visibility", "hidden")
        return false
    }
}

//disabilita pulsante di invio quando i requisiti non sono soddisfatti
function check(){
     return $("#submit").prop("disabled", pwLenCheck() || pwsCheck() || $("#username").val() == "")
}

