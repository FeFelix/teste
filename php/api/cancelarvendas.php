<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: PUT");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/db.php';
    include_once '../classes/vendas.php';
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new Vendas($db);
    
    $data = json_decode(file_get_contents("php://input"));

    if(!isset($data->id)){
        $resultado->retorno = "ERRO";
        $resultado->msg = "Estrutura inválida";
        echo json_encode($resultado);
    }
    else{
        $classe->id = $data->id;
        $classe->cancelada = 1;
        
        $res = $classe->cancelarVendas();

        if($res->retorno != "OK"){
            $resultado->retorno = "ERRO";
            $resultado->msg = $res->msg;
            echo json_encode($resultado);
        }
        else{
            $resultado->retorno = "OK";
            echo json_encode($resultado);
        }
    }
?>