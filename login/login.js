$(function(){

    if(document.cookie != ""){  //se si cerca di accedere alla pagina di accesso dopo averlo già eseguito, si viene reindirizzati alla homepage
        window.location = "/"
    }

    //aggiunta event handler
    $("#password, #username").on("input change", function(){check()})
    $("#submit").on("click", function(){login()})
})

//le informazioni per il login vengono inviate al server attarverso una "post" con Ajax
function login(){
    var user
    var pass
    user=$("#username").val();
    pass=$("#password").val();

    if(pass.length < 5){
        alert("Username o password non sufficientemente lunghi")
        return
    }
    
    var arr = { username: user, pw: pass };
    var exp = ""
    if($("#rmb").prop("checked")){
        exp = "expires=Thu, 18 Dec 9999 12:00:00 UTC"  //se il pulsante "ricordami" viene marcato il cookie di autenticazione non verrà eliminato alla 
                                                        //chiusura del browser
    }

    $.ajax({
        url: '/login',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(data, status){
            if(data.redirect){
                document.cookie = "user=" + user + "; path=/;" + exp
                $("#popup").show()
                setTimeout(function(){window.location = "/"}, 1500);
            }
            if(data.showWarning){
                $("#notSignedUp").show()
            }
        }
        });
    }

//controlli sulla password
function pwLenCheck(){
    var pw = $("#password").val()
    if(pw.length < 5){
        $("#pwWarning").css("visibility", "visible")
        return true
    }
    else{
        $("#pwWarning").css("visibility", "hidden")
        return false
    }
}

//il pulsante di invio viene disabilitato nel caso i requisiti non siano soddisfatti
function check(){
    return $("#submit").prop("disabled", pwLenCheck() || $("#username").val() == "")
}