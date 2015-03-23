console.log('\'Allo \'Allo!');
'use strict';
$(document).ready(function() {
    var miTabla = $('#miTabla').DataTable({
        'processing': true,
        'serverSide': true,
        //'ajax': '../app/php/cargar_vclinicas_mejor.php',
        'ajax': '../app/php/cargar_doctores_clinicas.php',
        'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior'
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
        },
        'columns': [{
            'data': 'nombreDoctor'
        }, {
            'data': 'numeroColegiado'
        }, {
            'data': 'nombreClinica'
        }, {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a class="btn btn-primary editarbtn" href=http://localhost/php/editar.php?id_doctor=' + data + '>Editar</a>';
            }
        }, {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a class="btn btn-warning borrarbtn" href=http://localhost/php/borrar.php?id_doctor=' + data + '>Borrar</a>';
            }
        }]
    });

    /*Creamos la función que muestre el formulario cuando hagamos click*/
    /*ojo, es necesario hacerlo con el método ON. Tanto por rendimiento como porque puede haber elementos (botones) que todavía no existan en el document.ready*/
    // --------EDITAR ------
    // lo que pasa al usar el botón editar en cada fila de la tabla 
    $('#miTabla').on('click', '.editarbtn', function(e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formularioEditar').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idClinicaEditar').val(aData.idClinica);
        $('#nombreEditar').val(aData.nombre);
        $('#numClinicaEditar').val(aData.numClinica);
        $('#razonSocialEditar').val(aData.razonSocial);
        $('#cifEditar').val(aData.cif);
        $('#localidadEditar').val(aData.localidad);
        $('#provinciaEditar').val(aData.provincia);
        $('#direccionEditar').val(aData.direccion);
        $('#cpEditar').val(aData.cp);
        $('#idTarifaEditar').val(aData.idTarifa);
    });

    // lo que pasa al usar el boton editar del formulario editar
    $("#editar").click(function(mievento) {
        //alert("en editar");
        mievento.preventDefault();

        var id_clinica = $("#idClinicaEditar").val();
        var nombre = $("#nombreEditar").val();
        var localidad = $("#localidadEditar").val();
        var provincia = $("#provinciaEditar").val();
        var direccion = $("#direccionEditar").val();
        var cif = $("#cifEditar").val();
        var cp = $("#cpEditar").val();
        var id_tarifa = $("#idTarifaEditar").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "php/modificar_clinica.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                id_clinica: id_clinica,
                nombre: nombre,
                localidad: localidad,
                provincia: provincia,
                direccion: direccion,
                cp: cp,
                id_tarifa: id_tarifa,
                cif: cif
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                $.growl.error({
                    message: "Error al editar una clinica!" + error
                });
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:

                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
                // colocando el mensaje top centre ...
                $.growl({
                    title: "Exito!",
                    location: "tc",
                    size: "large",
                    style: "warning",
                    message: "La clinica ha sido tratada con exito"
                });
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax

            }
        });
        // ocultamos un formulario y mostramos el otro
        $("#formularioEditar").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    // lo que pasa al usar el boton volver del formulario editar
    $("#volverEditar").click(function(mievento) {
        //alert("en volverEditar");
        mievento.preventDefault();
        // ocultamos un formulario y mostramos el otro
        $("#formularioEditar").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    // --------BORRAR ------
    // lo que pasa al usar el botón borrar en cada fila de la tabla 
    $('#miTabla').on('click', '.borrarbtn', function(e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formularioBorrar').fadeIn(100);

        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idClinicaBorrar').val(aData.idClinica);
        $('#nombreBorrar').val(aData.nombre);
        $('#numClinicaBorrar').val(aData.numClinica);
        $('#razonSocialBorrar').val(aData.razonSocial);
        $('#cifBorrar').val(aData.cif);
        $('#localidadBorrar').val(aData.localidad);
        $('#provinciaBorrar').val(aData.provincia);
        $('#direccionBorrar').val(aData.direccion);
        $('#cpBorrar').val(aData.cp);
        $('#idTarifaBorrar').val(aData.idTarifa);
    });
    // lo que pasa al usar el boton volver del formulario borrar
    $("#volverBorrar").click(function(mievento) {
        // alert("en volverBorrar");
        mievento.preventDefault();
        // ocultamos un formulario y mostramos el otro
        $("#formularioBorrar").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    // lo que pasa al usar el boton borrar del formulario borrar
    $("#borrar").click(function(mievento) {
        //alert("en borrar");
        mievento.preventDefault();
        var id_clinica = $('#idClinicaBorrar').val();
        var nombre = $("#nombreBorrar").val();
        var localidad = $("#localidadBorrar").val();
        var provincia = $("#provinciaBorrar").val();
        var direccion = $("#direccionBorrar").val();
        var cif = $("#cifBorrar").val();
        var cp = $("#cpBorrar").val();
        var id_tarifa = $("#idTarifaBorrar").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "php/borrar_clinica.php",
            async: false,
            //estos son los datos que queremos borrar, en json:
            data: {
                id_clinica: id_clinica,
                nombre: nombre,
                localidad: localidad,
                provincia: provincia,
                direccion: direccion,
                cp: cp,
                id_tarifa: id_tarifa,
                cif: cif
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:

                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax
            }
        });
        // ocultamos un formulario y mostramos el otro
        $("#formularioBorrar").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    // --------CREAR CLINICA ------
    // lo que pasa al usar el botón nueva clinica 
    $("#nuevaClinica").click(function(e) {
        e.preventDefault();
        $('#tabla').fadeOut(100);
        $('#formularioCrear').fadeIn(100);
    });
    // lo que pasa al usar el boton volver del formulario crear
    $("#volverCrear").click(function(mievento) {
        // alert("en volverCrear");
        mievento.preventDefault();
        // ocultamos un formulario y mostramos el otro
        $("#formularioCrear").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    /*                   */
    // lo que pasa al usar el boton crear del formulario crear
    $("#crear").click(function(mievento) {
        alert("en crear");
        mievento.preventDefault();

        var id_clinica = $("#idClinicaCrear").val();
        var nombre = $("#nombreCrear").val();
        var localidad = $("#localidadCrear").val();
        var provincia = $("#provinciaCrear").val();
        var direccion = $("#direccionCrear").val();
        var cif = $("#cifCrear").val();
        var cp = $("#cpCrear").val();
        var id_tarifa = $("#idTarifaCrear").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "php/crear_clinica.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                id_clinica: id_clinica,
                nombre: nombre,
                localidad: localidad,
                provincia: provincia,
                direccion: direccion,
                cp: cp,
                id_tarifa: id_tarifa,
                cif: cif
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                aler(error);
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:

                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax
            }
        });
        // ocultamos un formulario y mostramos el otro
        $("#formularioCrear").fadeOut(100);
        $("#tabla").fadeIn(100);
    });
    // sacado de http://jqueryui.com/dialog/#modal-form
    var dialog, form,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        name = $("#name"),
        email = $("#email"),
        password = $("#password"),
        allFields = $([]).add(name).add(email).add(password),
        tips = $(".validateTips");
        dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
        width: 450,
        modal: true,
        buttons: {
            "Crear un doctor": addUser,
            Cancelar: function() {
                dialog.dialog("close");
            }
        },
        close: function() {
          //  form[ 0 ].reset();
            allFields.removeClass("ui-state-error");
        }
    });
    $("#crear-doctor").button().on("click", function() {
        console.log('en el click del boton crear-doctor');
        dialog.dialog("open");
    });

    function addUser() {
        var valid = true;
      /* validaciones interesantes para luego
       allFields.removeClass("ui-state-error");

        valid = valid && checkLength(name, "username", 3, 16);
        valid = valid && checkLength(email, "email", 6, 80);
        valid = valid && checkLength(password, "password", 5, 16);

        valid = valid && checkRegexp(name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
        valid = valid && checkRegexp(password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");*/

        if (valid) {
            console.log ('es valido');
        var idClinica = $("#idClinica").val();
        var nombreDoctor = $("#nombreDoctor").val();
        var numeroColegiado = $("#numeroColegiado").val();
        console.log ('los valores '+ idClinica + ' '+ nombreDoctor + ' '+ numeroColegiado);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: "php/crear_doctor.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                idClinica: idClinica,
                nombreDoctor: nombreDoctor,
                numeroColegiado: numeroColegiado  
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                console.log('el error ' + error);
                alert(error);
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:
                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                $mitabla.fnDraw();
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax
            }
        });
/*            $("#users tbody").append("<tr>" +
                "<td>" + name.val() + "</td>" +
                "<td>" + email.val() + "</td>" +
                "<td>" + password.val() + "</td>" +
                "</tr>");*/
            dialog.dialog("close");
        }
        return valid;
    }

    /*                 */
});

/* En http://www.datatables.net/reference/option/ hemos encontrado la ayuda necesaria
para utilizar el API de datatables para el render de los botones */
/* Para renderizar los botones según bootstrap, la url es esta: 
http://getbootstrap.com/css/#buttons
*/
