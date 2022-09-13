$(function(){
    $("#nome").on("change input paste", function(){
        $(this).val((i, val) => {return val.replace(/[&0-9]/, "")}) //non vengono accettati nomi contenenti numeri o il carattere "&", che vengono cancellati
    })

    $("#tipo").on("change", () => {disable()})
    $("#nuovo").on("change", () => {clearFields()})
    $("#modifica").on("change", () => {toggle()})
    $("#nuovo").on("change", () => {toggle()})

    //si aggiunge la classe "classeInput" (contenuta nel file style.css) a tutti gli input del form
    $("input, textarea, select").each(function(){
        $(this).addClass("classeInput")
    })

    //scegliendo un oggetto già presente nel database i campi vengono riempiti con le sue informazioni prese dal database
    //così da velocizzare la modifica
    $("#selectedname").on("change", () => {
        if(!$("#modifica").prop("checked"))
            return
        $.ajax({
            url: `/getdata?tipo=${$("#tipo :selected").val()}&nome=${$("#selectedname :selected").val()}`,
            type: 'GET',
            processData: false,
            contentType: false,
            dataType: "json",
            async: false,
            success: function(results, status){
                if(results.errore) return alert("Errore")
                else{
                    $("#descrizione").val(results.descrizione)
                    $("#info").val(results.info)
                    
                    if(results.tipo == "armi"){
                        $("#scaling").val(results.scaling)
                        $("#requisiti").val(results.requisiti)
                        $("#categoria").val(results.categoria)
                        $("#tipodanno").val(results.tipodanno)
                        $("#abilita").val(results.abilita)
                        $("#costo").val(results.costo)
                        $("#peso").val(results.peso)
                    }
                }
            }
            });
    })

    //i dati del form vengono inviati al server
    $("#datiform").submit(function(e){
        e.preventDefault()
        const data = new FormData()
        img = $("#immagine")[0].files[0]
        modifica = $("#modifica").prop("checked")
        nome = modifica ? $("#selectedname :selected").val() : $("#nome").val()
        arr = {tipo: $("#tipo :selected").val(), 
                nome: nome.trim(),
                descrizione: $("#descrizione").val(),
                info: $("#info").val(),
                tipodanno: $("#tipodanno :selected").val(),
                requisiti: $("#requisiti").val(),
                abilita: $("#abilita").val(),
                peso: $("#peso").val(), 
                costo: $("#costo").val(),
                categoria: $("#categoria :selected").val(),
                scaling: $("#scaling").val(),
                immagine: img.name,
                modifica: modifica}

        data.append("arr", JSON.stringify(arr))
        data.append("img", img)
        $.ajax({
            url: '/senddata?tipo=' + $("#tipo :selected").val(),
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            async: false,
            success: function(data, status){
                if(data.dup) return alert("Nome già preso, scegli 'modifica'")
                else if(data.warn) return mostraMessaggio("Errore, riprova")
                else{
                    mostraMessaggio("Successo!")
                    setTimeout(() => {window.location.reload()}, 1500)
                }
            }
            });
    })

    //nel caso qualcuno dei campi non sia valido viene mostrato un popup
    $("form#datiform :input").each(function(){
        $(this).on("invalid", function(){
            mostraMessaggio("Compila tutti i campi correttamente")
        })
    })
})

//cliccando il pulsante radio "nuovo" per creare un nuovo oggetto vengono resettati i campi textarea e text
function clearFields(){
    $("textarea, input[type=text]").each(function(){
        $(this).val("")
    })
}

//scegliendo "nuovo" o "modifica" viene fatto un toggle della visibilità
function toggle(){
    $("#selectedname").toggle().trigger("change").prop("disabled", (i, dis) => {return !dis})
    $("#nome").toggle().prop("disabled", (i, dis) => {return !dis})
}

//ci sono 2 categorie di oggetti, "armi" e "consumabili" che richiedono campi differenti, 
//questa funzione disabilita i campi non necessari
function disable(){
    if($('#tipo option').filter(':selected').val() == "arma"){
        $("#entryarma :input").prop("disabled", false)
        $('optgroup[label="Armi"] option:first-child').prop("selected", true).trigger("change") //se si è scelto un oggetto di una categoria ma poi essa viene cambiata, 
                                                                                                //viene selezionato il primo oggetto della nuova categoria
    }
    else{
        $("#entryarma :input").prop("disabled", true)
        $('optgroup[label="Consumabili"] option:first-child').prop("selected", true).trigger("change")
    }
    $("#selectedname optgroup#group1").prop("disabled", (i, dis) => {return !dis})
    $("#selectedname optgroup#group2").prop("disabled", (i, dis) => {return !dis})
    };

function mostraMessaggio(msg){
    console.log(msg);
    $("#contenuto").text(msg)
    $("#messaggio").show()
    setTimeout(function(){$("#messaggio").hide()}, 1500)
}