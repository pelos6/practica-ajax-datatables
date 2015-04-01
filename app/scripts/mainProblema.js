console.log('\'Allo \'Allo!');
'use strict';
// meto estos metodos de additional.methods para no tener que cargar el archivo completo
jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");
// Las validaciones del formulario crearDoctor
$('#crearDoctor').validate({
    rules: {
        nombreCrear: {
            required: true,
            minlength: 2,
            maxlength: 100,
            lettersonly: true
        },
        numeroColegiadoCrear: {
            required: true,
            digits: true, // solo numeros pero no cifras (-12) no es válido
            minlength: 4,
            maxlength: 7
        },
        'seleccionaClinicasCrear[]': {
            required: true,
            minlength: 1
        }
    },
    // unos cuantos mensajes personalizados
    messages: {
        numeroColegiadoCrear: {
            required: "Para crear un doctor es necesario un numero de colegiado",
            digits: "El numero de colegiado solo puede tener numeros",
            minlength: "El número de colegiado debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
            maxlength: "El número de colegiado debe tener como mucho {0} digitos"
        },
        nombreCrear: {
            required: "Para crear un doctor es necesario un nombre de doctor",
            minlength: "El nombre del doctor debe tener al menos {0} caracteres", // {0} es el valor del primer parametro
            maxlength: "El nombre del doctor no puede tener mas de {0} caracteres",
            lettersonly: "El nombre del doctor solo puede contener letras"
        },
        'seleccionaClinicasCrear[]': {
            required: "Cada doctor tiene que tener alguna clínica asignada",
            minlength: "El nuevo doctor debe tener al menos {0} clinica asignada",
        }
    },
    submitHandler: function(form) {
        console.log("en el boton  submitHandler botonConfirmarCrearDoctor");
        //  mievento.preventDefault();
        var idDoctor = $("#idDoctorEditar").val();
        var clinicas = $("#seleccionaClinicasCrear").val();
        var nombre = $("#nombreCrear").val();
        var numeroColegiado = $("#numeroColegiadoCrear").val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_doctor.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'crearDoctor', // la acción que ejecuto el php es un parámetro más
                clinicas: clinicas,
                nombre: nombre,
                numeroColegiado: numeroColegiado
            },
            error: function(xhr, status, error) {
                //el error se muestra con growl
                $.growl.error({
                    message: "Error al crear un doctor!" + error
                });
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                var $mitabla = $("#miTabla").dataTable({
                    bRetrieve: true
                });
                //actualizamos datatables:
                $mitabla.fnDraw();
                $.growl({
                    title: "Exito!",
                    // colocando el mensaje centrado arriba ... manias ...
                    location: "tc",
                    size: "large",
                    style: "warning",
                    message: "El doctor ha sido creado con exito"
                });
                $('#modal-crear').modal('hide');
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax

            }
        });
    }
});


/********/

$(document).ready(function() {
    // cargando la tabla con dataTable
    var miTabla = $('#miTabla').dataTable({
        'processing': true,
        'serverSide': true,
        /* "bProcessing": true,
         "bServerSide": true,*/
        'ajax': '../app/php/cargar_doctores_clinicas.php',
        //'ajax': 'php/mto_doctor.php',
        //"sServerMethod": "POST",
        // intento de pasar parámetros a la select de cargar tablas y poner todo el php en un solo fichero .
        /*"fnServerParams": function(aoData) {
            aoData.push({
                "name": "accion",
                "value": 'cargarTabla'
            });
        },*/
        //"sAjaxSource": "php/mto_doctor.php",
        // "sAjaxSource": "php/cargar_doctores_clinicas.php",
        // le pasamos parametros al php
        /*"fnServerParams": function(aoData) {
    aoData.push({
        "name": "accion",
        "value": "cargarTabla"
    });
},
*/
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
                return '<a href="#modal-editar" class="btn btn-primary editarbtn" data-toggle="modal" >Editar</a>';
            }
        }, {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a href="#modal-borrar" class="btn btn-warning borrarbtn" data-toggle="modal" >Borrar</a>';
                // return '<button id=' + data + ' class="btn btn-warning borrarbtn " >Borrar</button>';
            }
        }]
    });

    // --------CREAR DOCTOR ------
    // Lo que pasa al usar el botón crear doctor.
    // Este botón esta desde el principio de la carga de la página.
    $("#boton-crear-doctor").click(function(e) {
        console.log('en el boton-crear-doctor');
        // valores a vacio para evitar recarga con valores anteriores
        $('#nombreCrear').val('');
        $('#numeroColegiadoCrear').val('');
        // cargamos las clinicas por ajax (como todo en este ejercicio ;) usando el metodo post al llamarlo con un objeto ...
        $('#seleccionaClinicasCrear').load("php/mto_doctor.php", ({
            accion: 'cargarClinicas' // la acción que ejecuta el php
        }));

    });

    // --------CREAR DOCTOR - GUARDAR  ------
    // lo que pasa al usar el boton Guardar del formulario crear
    $("#botonGuardarCrearDoctor").click(function(mievento) {
        /** ya esta controlado en el validate **/
        // la validación del formulario para crear doctor
        console.log('en el botonGuardarCrearDoctor');
        // mievento.preventDefault();
        /***/

    });
    // --------EDITAR DOCTOR ------
    // lo que pasa al usar el botón editar para cada doctor 
    // como los botones se crean con datatables no estan al inicio. 
    // por eso se referencian a traves de #tabla y con on
    $('#tabla').on('click', '.editarbtn', function() {
         doctor = $(this).attr('idDoctor');
        console.log("en borrar doctor "+ doctor);
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctorEditar').val(aData.idDoctor);
        $('#nombreEditar').val(aData.nombreDoctor);
        $('#numeroColegiadoEditar').val(aData.numeroColegiado);
        $('#clinicasEditar').val(aData.nombreClinica);
        // pero no funciona con el campo select !!!!
        $('#selecClinicas').val(aData.nombreClinica);
        console.log('en el boton-editar-doctor ' + aData.idDoctor + ' ' + aData.nombre);

    });
    // --------EDITAR DOCTOR - GUARDAR  ------
    // lo que pasa al usar el boton Guardar del formulario editar
    $("#botonGuardarEditarDoctor").click(function(mievento) {
        console.log("en el boton botonConfirmarEditarDoctor");
        //  mievento.preventDefault();

        var idDoctor = $("#idDoctorEditar").val();
        var idClinica = $("#idClinicaEditar").val();
        var nombre = $("#nombreEditar").val();
        var numeroColegiado = $("#numeroColegiadoEditar").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_doctor.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                accion: 'editarDoctor',
                idDoctor: idDoctor,
                idClinica: idClinica,
                nombre: nombre,
                numeroColegiado: numeroColegiado
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                $.growl.error({
                    message: "Error al editar un doctor!" + error
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
                $.growl({
                    title: "Exito!",
                    // colocando el mensaje top centre ...
                    location: "tc",
                    size: "large",
                    style: "warning",
                    message: "El doctor ha sido tratado con exito"
                });
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax
            }
        });
    });
$('#tabla tbody').on( 'click', 'tr', function () {
    console.log( miTabla.row( this ).data() );
} );
    // --------BORRAR DOCTOR ------
    // lo que pasa al usar el botón borrar para cada doctor 
    $('#tabla').on('click', '.borrarbtn', function() {
        doctor = $(this).attr('idDoctor');
        console.log("en borrar doctor "+ doctor);
        var nRow = $(this).parents('tr')[0];
         console.log("en borrar doctor " + nRow);
        var aData = miTabla.row(nRow).data();
        $('#idDoctorBorrar').val(aData.idDoctor);
        $('#nombreBorrar').val(aData.nombreDoctor);
        console.log('en el boton-borrar-doctor ' + aData.idDoctor + ' ' + aData.nombreDoctor);

    });
    // --------BORRAR DOCTOR - BORRAR  ------
    // lo que pasa al usar el boton Borrar del formulario borrar
    $("#botonBorrarBorrarDoctor").click(function(mievento) {
        console.log("en el boton botonBorrarBorrarDoctor");

        var idDoctor = $("#idDoctorBorrar").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_doctor.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'borrarDoctor',
                idDoctor: idDoctor
            },
            error: function(xhr, status, error) {
                // mostraríamos alguna ventana de alerta con el error
                // por ejemplo la base de datos caida
                $.growl.error({
                    // colocando el mensaje top centre ...
                    location: "tc",
                    message: "Error al borrar un doctor!" + error
                });
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:
                console.log(data[0].estado + ' ' + data[0].mensaje);
                if (data[0].estado == 0) {
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    $mitabla.fnDraw();
                    $.growl({
                        title: "Exito!",
                        // colocando el mensaje top centre ...
                        location: "tc",
                        size: "large",
                        style: "warning",
                        message: "El doctor ha sido borrado con exito"
                    });
                } else {
                    $.growl.error({
                        // colocando el mensaje top centre ...
                        location: "tc",
                        message: "Error al borrar un doctor!" + data[0].mensaje
                    });
                }
            },
            complete: function(data) {
                //si queremos hacer algo al terminar la petición ajax
            }
        });

    });

});


/*// Botones con personalidad
$("button.boton").mousedown(function() {
    $(this).animate({
        'top': '5px',
        'boxShadowY': '0'
    }, 100);
}).mouseup(function() {
    $(this).animate({
        'top': '0',
        'boxShadowY': '5px'
    }, 100);
});*/
// firma circular
var circ = document.getElementById('circular');
var textarr = circ.textContent.split('');
circ.textContent = '';
for (var i = 0; i < textarr.length; i++) {
    circ.innerHTML += '<span style="-webkit-transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);">' + textarr[i] + '</span>';
}
