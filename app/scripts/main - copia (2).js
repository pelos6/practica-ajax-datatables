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
        }, /*{
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
        } , {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<button id=' + data + ' class="btn btn-warning borrarbtn " >Borrar</button>';
            }
        }]
    });

 // --------CREAR DOCTOR ------
      // lo que pasa al usar el botón nueva clinica 
      $("#boton-crear-doctor").click(function(e) {
        console.log ('en el boton-crear-doctor');

      });
       // --------EDITAR DOCTOR ------
      // lo que pasa al usar el botón editar doctor 
        $('#tabla').on('click', '.editarbtn', function() {
          var nRow = $(this).parents('tr')[0];
          var aData = miTabla.row(nRow).data();
          $('#idDoctorEditar').val(aData.idDoctor);
          $('#nombreEditar').val(aData.nombreDoctor);
          $('#numeroColegiadoEditar').val(aData.numeroColegiado);
          $('#clinicasEditar').val(aData.nombreClinica);
          // pero no funciona con el campo select !!!!
          $('#selecClinicas').val(aData.nombreClinica);
        console.log ('en el boton-editar-doctor '+ aData.idDoctor + ' ' + aData.nombre);

      });
      // lo que pasa al usar el boton editar del formulario editar
      $("#botonConfirmarEditarDoctor").click(function(mievento) {
          //alert("en editar");
          console.log ("en el boton botonConfirmarEditarDoctor");
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
                  $.growl.error({ message: "Error al editar una clinica!" + error });
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
                  $.growl({ title: "Exito!",location: "tc", size:"large",style:"warning", message: "La clinica ha sido tratada con exito" });
              },
              complete: {
                  //si queremos hacer algo al terminar la petición ajax

              }
          });
          // ocultamos un formulario y mostramos el otro
          $("#formularioEditar").fadeOut(100);
          $("#tabla").fadeIn(100);
      });

    /*$( "a" ).click(function( e ){
        e.preventDefault();
    });*/
    /**/
    // sacado de http://jqueryui.com/dialog/#modal-form
    var dialogCrear, dialogBorrar, form,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        name = $("#name"),
        email = $("#email"),
        password = $("#password"),
        allFields = $([]).add(name).add(email).add(password),
        tips = $(".validateTips");
    dialogCrear = $("#dialog-form-crear").dialog({
        autoOpen: false,
        height: 400,
        width: 450,
        modal: true,
        buttons: {
            "Crear un doctor": crearDoctor,
            Cancelar: function() {
                dialogCrear.dialog("close");
            }
        },
        close: function() {
            //  form[ 0 ].reset();
            allFields.removeClass("ui-state-error");
        }
    });
    dialogBorrar = $("#dialog-form-borrar").dialog({
        autoOpen: false,
        height: 400,
        width: 450,
        modal: true,
        buttons: {
            "Borrar un doctor": borrarDoctor,
            Cancelar: function() {
                dialogBorrar.dialog("close");
            }
        },
        close: function() {
            //  form[ 0 ].reset();
            allFields.removeClass("ui-state-error");
        }
    });
    $("#crear-doctor").button().on("click", function() {
        console.log('en el click del boton crear-doctor');
        dialogCrear.dialog("open");
    });

    $('#tabla').on('click', '.borrarbtn', function() {
        console.log('en el ON click del boton borrar-doctor');
        /*   var id = $(this).attr('id');
           console.log('en la función borrarDoctor para la id ' + id);*/
        dialogBorrar.dialog("open");
    });

    /*   $(".borrarbtn").button().on("click", function() {
           console.log('en el click del boton borrar-doctor');
           dialogBorrar.dialog("open");
       });*/

    function borrarDoctor() {
        console.log('en la funcion borrarDoctor');
        var id = $(this).attr('id');
        console.log('en la función borrarDoctor para la id ' + id);
        var valid = true;
        if (valid) {
            console.log('es valido');
            var idClinica = $("#idClinica").val();
            var nombreDoctor = $("#nombreDoctor").val();
            var numeroColegiado = $("#numeroColegiado").val();
            console.log('los valores ' + idClinica + ' ' + nombreDoctor + ' ' + numeroColegiado);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: "php/mto_doctor.php",
                async: false,
                //estos son los datos que queremos actualizar o pasar al servidor, en json:
                data: {
                    accion: 'crearDoctor',
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
            dialogBorrar.dialog("close");
        }
        return valid;
    }

    function crearDoctor() {
        var valid = true;
        if (valid) {
            console.log('es valido');
            var idClinica = $("#idClinica").val();
            var nombreDoctor = $("#nombreDoctor").val();
            var numeroColegiado = $("#numeroColegiado").val();
            console.log('los valores ' + idClinica + ' ' + nombreDoctor + ' ' + numeroColegiado);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: "php/mto_doctor.php",
                async: false,
                //estos son los datos que queremos actualizar o pasar al servidor, en json:
                data: {
                    accion: 'crearDoctor',
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
            dialogCrear.dialog("close");
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
