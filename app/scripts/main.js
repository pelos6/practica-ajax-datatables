//console.log('\'Allo \'Allo!');
'use strict';
$(document).ready(function() {
    // saco este metodo de additional.methods para no tener que cargar el archivo completo
    // lo modifico para que admita espacios en blanco, acentos y la ñ
    jQuery.validator.addMethod("validaNombre", function(value, element) {
        return this.optional(element) || /^[a-z ñáéíóú]+$/i.test(value);
    }, "Letters only please");
    // Las validaciones del formulario crearDoctor
    var validatorCrear = $('#crearDoctor').validate({
        rules: {
            nombreCrear: {
                required: true,
                minlength: 2,
                maxlength: 100,
                validaNombre: true
            },
            numeroColegiadoCrear: {
                //required: true, // no es obligatorio
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
                //required: "Para crear un doctor es necesario un numero de colegiado",
                digits: "El numero de colegiado solo puede tener numeros",
                minlength: "El número de colegiado debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "El número de colegiado debe tener como mucho {0} digitos"
            },
            nombreCrear: {
                required: "Para crear un doctor es necesario un nombre de doctor",
                minlength: "El nombre del doctor debe tener al menos {0} caracteres", // {0} es el valor del primer parametro
                maxlength: "El nombre del doctor no puede tener mas de {0} caracteres",
                validaNombre: "El nombre del doctor solo puede contener letras"
            },
            'seleccionaClinicasCrear[]': {
                required: "Cada doctor tiene que tener alguna clínica asignada",
                minlength: "El nuevo doctor debe tener al menos {0} clinica asignada",
            }
        },
        submitHandler: function(form) {
            //console.log("en el boton  submitHandler botonConfirmarCrearDoctor");
            // no es necesario el idDoctor pues lo genera el programa con un secuencial
            // var idDoctor = $("#idDoctorEditar").val();
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

    // Las validaciones del formulario editarDoctor
    // atención que van con name y no con id
    var validatorEditar = $('#editarDoctor').validate({
        rules: {
            nombreEditar: {
                required: true,
                minlength: 2,
                validaNombre: true, // modificado para que admita ñ, acentos, espacios ...
                maxlength: 100
            },
            numeroColegiadoEditar: {
                //  required: true,
                digits: true, // solo numeros pero no cifras (-12) no es válido
                minlength: 4,
                maxlength: 7
            },
            'seleccionaClinicasEditar[]': {
                required: true,
                minlength: 1
            }
        },
        // unos cuantos mensajes personalizados
        messages: {
            numeroColegiadoEditar: {
                //  required: "Para modificar un doctor es necesario un numero de colegiado",
                digits: "El numero de colegiado solo puede tener numeros",
                minlength: "El número de colegiado debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "El número de colegiado debe tener como mucho {0} digitos"
            },
            nombreEditar: {
                required: "Para editar un doctor es necesario un nombre de doctor",
                minlength: "El nombre del doctor debe tener al menos {0} caracteres", // {0} es el valor del primer parametro
                maxlength: "El nombre del doctor no puede tener mas de {0} caracteres",
                validaNombre: "El nombre del doctor solo puede contener letras"
            },
            'seleccionaClinicasEditar[]': {
                required: "Cada doctor editado tiene que tener alguna clínica asignada",
                minlength: "El doctor editado debe tener al menos {0} clinica asignada",
            }
        },
        submitHandler: function(form) {
            //console.log("en el boton  submitHandler botonConfirmarEditarDoctor");
            var idDoctor = $("#idDoctorEditar").val();
            var clinicas = $("#seleccionaClinicasEditar").val();
            var nombre = $("#nombreEditar").val();
            var numeroColegiado = $("#numeroColegiadoEditar").val();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                // un unico php para todas las acciones
                url: "php/mto_doctor.php",
                async: false,
                //estos son los datos que queremos usar, en json:
                data: {
                    accion: 'editarDoctor', // la acción que ejecuto el php es un parámetro más
                    idDoctor: idDoctor,
                    clinicas: clinicas,
                    nombre: nombre,
                    numeroColegiado: numeroColegiado
                },
                error: function(xhr, status, error) {
                    //el error se muestra con growl
                    $.growl.error({
                        message: "Error al editar un doctor!" + error
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
                        message: "El doctor ha sido editado con exito"
                    });
                    $('#modal-editar').modal('hide');
                },
                complete: {
                    //si queremos hacer algo al terminar la petición ajax

                }
            });
        }
    });

    /* Limpiamos los formularios de crear y editar */
    $('#modal-crear').on('hidden.bs.modal', function() {
        validatorCrear.resetForm();
    })
    $('#modal-editar').on('hidden.bs.modal', function() {
            validatorEditar.resetForm();
        })
        /* mas limpio con el código anterior ...
        $("#botonCancelarEditarDoctor").click(function() {
            validatorEditar.resetForm();
        });
        $("#botonCancelarCrearDoctor").click(function() {
            validatorCrear.resetForm();
        });
        $(".close").click(function() {
            validatorEditar.resetForm();
            validatorCrear.resetForm();
        });
        */

    // cargando la tabla con dataTable
    var miTabla = $('#miTabla').DataTable({
        //TableTools la extensión de dataTables para sacar información en diferentes formatos incluido PDF ...
        // http://www.datatables.net/release-datatables/extensions/TableTools
        /*
        colocando los botones
        T tableTools
        l length mostrar 10 registros
        pero no consigo mover los botones de imprimir, pdf ....???
        */
        // "sDom": '<"top"i>rt<"bottom"flp><"clear">',
        // "sDom": 'Tlfrtip',
        //"sDom": 'T<"clear">OSlfrtip',
        dom: 'T<"clear">lfrtip',
        // "sDom": 'T<"H"lfr>t<"F"ip>',
        //"sDom": '<"H"lTfr>t<"F"ip>',
        //  "sDom": 'T<"clear">Clfrtip',
        "oTableTools": {
            // para poder seleccionar mas de  una fila
            "sRowSelect": "multi",
            /* util si quieres indicar que quieres en el pdf. Es necesario otra libreria
            cdn.datatables.net/plug-ins/e9421181788/filtering/row-based/TableTools.ShowSelectedOnly.js
            "oLanguage": {
                "oFilterSelectedOptions": {
                    AllText: "Todas las filas",
                    SelectedText: "Las filas seleccionadas"
                }
            },*/
            // la ruta de archivo flash que se usa para esta extension. Incluye exportación en PDF 
            "sSwfPath": "../bower_components/datatables-tabletools/swf/copy_csv_xls_pdf.swf",
           // "sSwfPath": "../swf/copy_csv_xls_pdf.swf"
            // personalizando los botones
            "aButtons": [{
                    // que boton tratamos
                    "sExtends": "xls",
                    // que columnas se usaran para exportar datos o hacer el pdf
                    "mColumns": [0, 1, 2],
                    // texto del botón
                    "sButtonText": "Excel",
                    // si se usan solo las filas seleccionadas
                    "bSelectedOnly": true,
                    // si incluye la cabecera
                    "bHeader": true,
                    // si incluye el pie
                    "bFooter": false,
                    // tooltip
                    "sToolTip": "Exportar doctores en CSV para excel",
                    // nombre del fichero a generar
                    "sFileName": "Doctores - *.csv",
                }, {
                    "sExtends": "pdf",
                    "mColumns": [0, 1, 2],
                    "sButtonText": "PDF",
                    "bSelectedOnly": true,
                    "bHeader": true,
                    "bFooter": false,
                    "sToolTip": "Exportar doctores en PDF",
                    // nombre del archivo pdf a generar
                    "sTitle": "doctoresSeleccionadosEnPDF",
                    // texto en el pdf
                    "sPdfMessage": "Los doctores seleccionados.",
                    // orientación del pdf
                    "sPdfOrientation": "landscape",
                }, {
                    "sExtends": "print",
                    "sButtonText": "Imprimir",
                    "sToolTip": "Captura de pantalla",
                    "sMessage": "Generado usando JQuery dataTables tableTools",
                    // el mensaje que sale inicialmente al lanza la impresión
                    "sInfo": "Vista previa de los impresión, presione la tecla ImprPant para imprimir. Presione Escape para salir de la vista previa"
                }
                /* mas botones posibles ... pero no figuran en la practica.
                                , {
                                    "sExtends": "csv",
                                    "sButtonText": "Copiar en CSV"
                                }, {
                                    "sExtends": "copy",
                                    "sButtonText": "Copiar",
                                }*/

            ]

        },
        'processing': true,
        'serverSide': true,
        // guarda el estado, lo que se ha buscado, como se ordena ...en localStorage
        'stateSave': true,
        'ajax': {
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_doctor.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'cargarTabla'
            }
        },
        // mensajes en castellano
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
            'data': 'nombreDoctor',
            // el nombre como un enlace a editar doctor (aunque eso ya esta implementado, mejor sería que fuera un enlace a consultar doctor 
            // con más información que la que se muestra en el grid lo que se podría usar para grabar un contador de consultas de doctor y
            // y mostrar los doctores ordenados de forma que los más consultados salgan antes. )
            'render': function(data) {
                return '<a href="#modal-editar" data-toggle="modal" data-backdrop="static"  class="editarbtn">' + data + '</a>';
            }
        }, {
            'data': 'numeroColegiado'
        }, {
            'data': 'nombreClinica'
        }, {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a href="#modal-editar" class="btn btn-primary editarbtn" data-toggle="modal"  data-backdrop="static" >Editar</a>';
            }
        }, {
            'data': 'idDoctor',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a href="#modal-borrar" class="btn btn-warning borrarbtn" data-toggle="modal"  data-backdrop="static" >Borrar</a>';
                // return '<button id=' + data + ' class="btn btn-warning borrarbtn " >Borrar</button>';
            }
        }],
        // las colunmas de los botones no se pueden usar para busqueda ni ordenación.
        "columnDefs": [{
            "targets": [3],
            "searchable": false,
            "orderable": false
        }, {
            "targets": [4],
            "searchable": false,
            "orderable": false
        }]
    });

    // --------CREAR DOCTOR ------
    // Lo que pasa al usar el botón crear doctor.
    // Este botón esta desde el principio de la carga de la página.
    $("#boton-crear-doctor").click(function(e) {
       //console.log('en el boton-crear-doctor');
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
    });
    // --------EDITAR DOCTOR ------
    // lo que pasa al usar el botón editar para cada doctor 
    // como los botones se crean con datatables no estan al inicio. 
    // por eso se referencian a traves de #tabla y con on
    $('#tabla').on('click', '.editarbtn', function() {
        //console.log("en editar doctor " + doctor);
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctorEditar').val(aData.idDoctor);
        $('#nombreEditar').val(aData.nombreDoctor);
        $('#numeroColegiadoEditar').val(aData.numeroColegiado);
        // cargamos las clinicas por ajax (como todo en este ejercicio ;) usando el metodo post al llamarlo con un objeto ...
        $('#seleccionaClinicasEditar').load("php/mto_doctor.php", ({
            idDoctor: aData.idDoctor,
            accion: 'cargarClinicasDoctor' // la acción que ejecuta el php
        }));
        // cargo un array con las clinicas del doctor a editar de la fila
        var clinicas = (aData.nombreClinica).split(',');
        //console.log(clinicas);
        // pongo los valores de las clinicas cargadas a no seleccionadas aunque ya estan así !!!!
        $("#modal-editar").find("option").each(function() {
            $(this).prop('selected', false);
        });
        // vuelvo a recorrer las opciones de la select
        $('#modal-editar').find('option').each(function() {
            var actual = $(this);
            // recorro las clinicas del doctor
            clinicas.forEach(function(element) {
                // si coincide la de la select con la del doctor
                if (actual.text() == element) {
                    // la pongo como selecionada
                    actual.prop('selected', true);
                }
            });
        });
        //console.log('en el boton-editar-doctor ' + aData.idDoctor + ' ' + aData.nombreDoctor);

    });
    // --------EDITAR DOCTOR - GUARDAR  ------
    // lo que pasa al usar el boton Guardar del formulario editar
    $("#botonGuardarEditarDoctor").click(function(mievento) {
        console.log("en el boton botonConfirmarEditarDoctor");
    });
    // --------BORRAR DOCTOR ------
    // lo que pasa al usar el botón borrar para cada doctor 
    $('#tabla').on('click', '.borrarbtn', function() {
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idDoctorBorrar').val(aData.idDoctor);
        $('#nombreBorrar').val(aData.nombreDoctor);
        $('#modal-borrar p').html("¿Seguro que quiere borrar el doctor " + aData.nombreDoctor + "?");
        //console.log('en el boton-borrar-doctor ' + aData.idDoctor + ' ' + aData.nombreDoctor);

    });
    // --------BORRAR DOCTOR - BORRAR  ------
    // lo que pasa al usar el boton Borrar del formulario borrar
    $("#botonBorrarBorrarDoctor").click(function(mievento) {
        //console.log("en el boton botonBorrarBorrarDoctor");
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
                //console.log(data[0].estado + ' ' + data[0].mensaje);
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

// firma circular
var circ = document.getElementById('circular');
var textarr = circ.textContent.split('');
circ.textContent = '';
for (var i = 0; i < textarr.length; i++) {
    circ.innerHTML += '<span style="-webkit-transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);">' + textarr[i] + '</span>';
}
