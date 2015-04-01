console.log('\'Allo \'Allo!');
'use strict';
$(document).ready(function() {
    // cargando la tabla con dataTable
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
            },
            /*{
                        'data': 'idDoctor',*/
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            /* 'render': function(data) {
                return '<a class="btn btn-primary editarbtn" href=http://localhost/php/editar.php?id_doctor=' + data + '>Editar</a>';
            }
        }*/
            {
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
            }
        ]
    });

    // --------CREAR DOCTOR ------
    // lo que pasa al usar el botón nuevo doctor 
    $("#boton-crear-doctor").click(function(e) {
        console.log('en el boton-crear-doctor');

    });
    // --------EDITAR DOCTOR ------
    // lo que pasa al usar el botón editar para cada doctor 
    // como los botones se crean con datatables no estan al inicio. 
    // por eso se referencian a traves de #tabla y con on
    $('#tabla').on('click', '.editarbtn', function() {
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
            url: "php/mto_doctor.php",
            //url: "php/modificar_clinica.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                accion:'editarDoctor',
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
                    message: "El doctor ha sido tratada con exito"
                });
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax

            }
        });
      /*  // ocultamos un formulario y mostramos el otro
        $("#formularioEditar").fadeOut(100);
        $("#tabla").fadeIn(100);*/
    });
/*********/
 // --------BORRAR DOCTOR ------
    // lo que pasa al usar el botón borrar para cada doctor 
    $('#tabla').on('click', '.borrarbtn', function() {
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctorEditar').val(aData.idDoctor);
        $('#nombreEditar').val(aData.nombreDoctor);
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
            url: "php/mto_doctor.php",
            //url: "php/modificar_clinica.php",
            async: false,
            //estos son los datos que queremos actualizar, en json:
            data: {
                accion:'borrarDoctor',
                idDoctor: idDoctor
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                $.growl.error({
                    message: "Error al borrar un doctor!" + error
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
                    message: "El doctor ha sido borrado con exito"
                });
            },
            complete: {
                //si queremos hacer algo al terminar la petición ajax

            }
        });
        // ocultamos un formulario y mostramos el otro
       /* $("#formularioEditar").fadeOut(100);
        $("#tabla").fadeIn(100);*/
    });

/*********/
    /*$( "a" ).click(function( e ){
        e.preventDefault();
    });*/
    /**/
  
});

/* En http://www.datatables.net/reference/option/ hemos encontrado la ayuda necesaria
para utilizar el API de datatables para el render de los botones */
/* Para renderizar los botones según bootstrap, la url es esta: 
http://getbootstrap.com/css/#buttons
*/
