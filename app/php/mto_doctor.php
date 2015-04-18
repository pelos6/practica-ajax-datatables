<?php

/* Database connection information */
include("mysql.php");

/*
 * Local functions
 */

function fatal_error($sErrorMessage = '')
{
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

/*
 * MySQL conexión. Común a todas las acciones.
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');
//error_log (" DEBUG: la acción ".$_REQUEST['accion']);
error_log(" DEBUG: la acción " . $_POST['accion']);

/*
 * Recuperamos los datos de la pantalla y los filtramos.
 */
// filtra la entrada permitiendo ñ y acentos ...
$accion = filter_input(INPUT_POST, "accion", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);

switch ($accion) {
    case 'cargarTabla':
         /* Easy set variables
         */
        // DB table to use
        $table = 'vdoctoresclinicas';     
        // Table's primary key
        $primaryKey = 'id_doctor';       
        // Array of database columns which should be read and sent back to DataTables.
        // The `db` parameter represents the column name in the database, while the `dt`
        // parameter represents the DataTables column identifier. In this case simple
        // indexes
        $columns = array(
            array(
                'db' => 'id_doctor',
                'dt' => 'idDoctor'
            ),
            array(
                'db' => 'nombre_doctor',
                'dt' => 'nombreDoctor'
            ),
            array(
                'db' => 'numcolegiado',
                'dt' => 'numeroColegiado'
            ),
            array(
                'db' => 'nombre_clinica',
                'dt' => 'nombreClinica'
            )
        );        
        // SQL server connection information
        $sql_details = array(
            'user' => $gaSql['user'],
            'pass' => $gaSql['password'],
            'db' => $gaSql['db'] ,
            'host' => $gaSql['server']
        );
        require('ssp.class.php');
        
        echo json_encode(
         // SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
            SSP::simple($_POST, $sql_details, $table, $primaryKey, $columns));
        
       /* $mensaje = "Carga correcta de la tabla";
        $estado  = 0;*/
        
        break;
    // Creando el Doctor y las clinicas asociadas
    case 'crearDoctor':
        $nombre          = filter_input(INPUT_POST, "nombre", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $numeroColegiado = filter_input(INPUT_POST, "numeroColegiado", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $clinicas        = $_POST['clinicas'];
        // en la select meto el auto incremental para idDoctor
        $query = "INSERT INTO doctores (id_doctor, nombre, numcolegiado) ";
        $query = $query . "select max(id_doctor) + 1 , upper('" . $nombre . "'),'" . $numeroColegiado . "' from doctores ";
        error_log("DEBUG: la query primera " . $query);
        
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            $mensaje = "Creación correcta";
            $estado  = 0;
        }
        /*Es necesario meter también la o las clinicas (al menos una, por restricción)*/
        foreach ($clinicas as $key => $value) {
            $query = "INSERT INTO clinica_doctor ( id_doctor , numdoctor ,id_clinica ) ";
            $query = $query . "select max(id_doctor)  , '" . $numeroColegiado . "', '" . $value . "' from doctores ";
            error_log("DEBUG: la query de la clinica " . $query);
            $query_res = mysql_query($query);
            if (!$query_res) {
                $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
                $estado  = mysql_errno();
            } else {
                $estado  = 0;
                $mensaje = 'Clinica-Doctor insertada correctamente';
            }
        };       
        break;
    case 'editarDoctor':
        $nombre          = filter_input(INPUT_POST, "nombre", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $numeroColegiado = filter_input(INPUT_POST, "numeroColegiado", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $clinicas        = $_POST['clinicas'];
        $idDoctor = filter_input(INPUT_POST, "idDoctor", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        /* Consulta UPDATE */
        $query = "UPDATE doctores SET nombre = upper('" . $nombre . "'), numcolegiado = '" . $numeroColegiado . "'  WHERE id_doctor = '" . $idDoctor . "' ";
        error_log("DEBUG: la query de update " . $query);
        
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            $mensaje = "Actualización correcta";
            $estado  = 0;
        }

        /* Primero borramos las clinicas que tenia el doctor ....
        Consulta DELETE primero de las clinicas del doctor*/
        $query = "DELETE FROM clinica_doctor WHERE id_doctor = '" . $idDoctor . "' ";
        error_log("DEBUG: la query de delete pre insert en clinicas  " . $query);
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta 1 de borrado de clinicas de doctor antes del insert: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta 1 borrado de clinicas de doctor antes del insert" . $mensaje);
            $estado = mysql_errno();
        } else {
            /* ... ahora insertamos las clinicar que vienen nuevas ... mas simple que mirar que clinica esta o deja de estar  ;)*/
            /*Es necesario meter también la o las clinicas (al menos una por restricción)*/
            foreach ($clinicas as $key => $value) {
                $query = "INSERT INTO clinica_doctor ( id_doctor , numdoctor ,id_clinica ) ";
                $query = $query . " values ('" . $idDoctor . "' , '" . $numeroColegiado . "' , '" . $value . "' )";
                error_log("DEBUG: la query de la clinica insertada editar " . $query);
                $query_res = mysql_query($query);
                if (!$query_res) {
                    $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
                    $estado  = mysql_errno();
                } else {
                    $estado  = 0;
                    $mensaje = 'Clinica-Doctor insertada correctamente';
                }
            }
        }
        break;
    case 'borrarDoctor':
        $idDoctor = filter_input(INPUT_POST, "idDoctor", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        /* Consulta DELETE primero de las clinicas del doctor, prefiero ocuparme de la integridad referencial yo mismo.*/
        $query = "DELETE FROM clinica_doctor WHERE id_doctor = '" . $idDoctor . "' ";
        error_log("DEBUG: la query de delete 1 " . $query);
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta 1 de borrado de clinicas de doctor : ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta 1 " . $mensaje);
            $estado = mysql_errno();
        } else { 
            /* Consulta DELETE del doctor una vez borrado las clinicas*/
            $query = "DELETE FROM doctores WHERE id_doctor = '" . $idDoctor . "' ";
            error_log("DEBUG: la query de delete 2 " . $query);
            
            /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
            $query_res = mysql_query($query);
            
            // Comprobar el resultado
            if (!$query_res) {
                $mensaje = 'Error en la consulta 2 de borrado de doctor : ' . mysql_error() . "\n";
                error_log("El ERROR de la consulta 2 " . $mensaje);
                $estado = mysql_errno();
            } else {
                $mensaje = "Borrado correcto del doctor";
                $estado  = 0;
            }
        }
        break;
    case 'cargarClinicas':
        /* Consulta SELECT para cargar las clinicas a seleccionar*/
        $query = "SELECT id_clinica, nombre FROM clinicas";
        error_log("DEBUG: la query de la carga de las clinicas " . $query);
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta : ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            while ($fila = mysql_fetch_assoc($query_res)) {
                echo '<option id="' . $fila['id_clinica'] . '" value="' . $fila['id_clinica'] . '" >' . $fila['nombre'] . '</option>';
            }
            $mensaje = "Carga correcta de las clinicas a seleccionar";
            $estado  = 0;
        }
        break;
    case 'cargarClinicasDoctor':
        $idDoctor = filter_input(INPUT_POST, "idDoctor", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        /* Consulta SELECT para cargar las clinicas a seleccionar*/
        $query = "SELECT id_clinica, nombre FROM clinicas";
        error_log("DEBUG: la query de la carga de las clinicas para cada doctor " . $query);
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta : ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            while ($fila = mysql_fetch_assoc($query_res)) {
                /* la query para ver si el doctor tiene esa clinica */
                $query = "SELECT count(*) FROM clinica_doctor cd where cd.id_doctor = '" . $idDoctor . "'  and cd.id_clinica = '" . $fila['id_clinica'] . "' ";
                //error_log("DEBUG: la query de la  de comprobación  clinicas " . $query);
                $query_res1 = mysql_query($query);
                //error_log ("DEBUG: ".mysql_result($query_res1,0));
                if (mysql_result($query_res1,0) == 0 ){
                    echo '<option id="' . $fila['id_clinica'] . '" value="' . $fila['id_clinica'] . '" >' . $fila['nombre'] . '</option>';
                } else {
                    echo '<option id="' . $fila['id_clinica'] . '" value="' . $fila['id_clinica'] . ' "  selected >' . $fila['nombre'] . '</option>';
                }
            }
            $mensaje = "Carga correcta de las clinicas a seleccionar";
            $estado  = 0;
        }
        break;
}
/* la accion cargar tabla tiene ya su respuesta */
if ($accion != 'cargarTabla') {
    $resultado   = array();
    $resultado[] = array(
        'mensaje' => $mensaje,
        'estado' => $estado
    );
    echo json_encode($resultado);
}
?>
