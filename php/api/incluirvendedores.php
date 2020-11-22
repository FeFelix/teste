<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/db.php';
    include_once '../classes/vendedores.php';
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new Vendedores($db);
    
    $data = json_decode(file_get_contents("php://input"));

    if(!isset($data->nome) || !isset($data->email)){
        $resultado->retorno = "ERRO";
        $resultado->msg = "Estrutura inválida";
        echo json_encode($resultado);
    }
    else{
        $classe->nome = $data->nome;
        $classe->email = $data->email;
        
        $res = $classe->incluirVendedores();

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