<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    
    include_once '../config/db.php';
    include_once '../classes/vendas.php';

    $resultado = new stdClass();

    $database = new Database();
    $db = $database->getConnection();

    $classe = new Vendas($db);

    $condicao = "";

    if(isset($_GET['vendedor'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "v.id_vendedor = ". htmlspecialchars(strip_tags($_GET['vendedor']));
    }

    if(isset($_GET['valor'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "v.valor = ". htmlspecialchars(strip_tags($_GET['valor']));
    }

    if(isset($_GET['situacao'])){
        if($_GET['situacao'] != ''){
            $condicao .= $condicao == "" ? " WHERE " : " AND ";
            $condicao .= "v.cancelada = ". htmlspecialchars(strip_tags($_GET['situacao']));
        }
    }
    
    if(isset($_GET['datainicio']) && isset($_GET['datafim'])){
        $condicao .= $condicao == "" ? " WHERE " : " AND ";
        $condicao .= "v.data BETWEEN CAST('". htmlspecialchars(strip_tags($_GET['datainicio'])) . "' AS DATE ) AND CAST('". htmlspecialchars(strip_tags($_GET['datafim'])) ."' AS DATE)";
    }

    $classe->condicao = $condicao;

    $res = $classe->buscaVendas();

    if($res->retorno != "OK"){
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg;
        echo json_encode($resultado);
    }
    else{
        $resultado->retorno = "OK";
        $resultado->dados = array();
        while ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
            if($dados->cancelada == 1)
                $dados->_rowVariant = "warning";

            $dados->comissao = round($dados->valor * ($dados->comissao_vendedor/ 100), 2);
            $resultado->dados[] = $dados;
        }

        echo json_encode($resultado);
    }
?>