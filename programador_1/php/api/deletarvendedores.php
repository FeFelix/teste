<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/db.php';
    include_once '../classes/vendedores.php';
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new Vendedores($db);
    
    $classe->id = isset($_GET['id']) ? $_GET['id'] : die();
    
    $res = $classe->deletarVendedores();

    if($res->retorno != "OK"){
        http_response_code(200);
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg.'  --  '.$classe->id;
        echo json_encode($resultado);
    }
    else{
        $resultado->retorno = "OK";
        echo json_encode($resultado);
    }
?>