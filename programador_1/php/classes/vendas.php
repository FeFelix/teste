<?php

    class vendas{
        private $conn;

        public $id;
        public $id_vendedor;
        public $valor;
        public $data;
        public $cancelada;
        public $condicao;

        public function __construct($db){
            $this->conn = $db;
        }

        public function buscavendas(){
            $resultado = new stdClass();

            $sql = "SELECT v.*, vd.nome, vd.email, vd.comissao AS comissao_vendedor FROM vendas v 
            LEFT OUTER JOIN vendedores vd ON vd.id = v.id_vendedor
            {$this->condicao} ORDER BY data";
            $sth = $this->conn->prepare($sql);

            try {
                $sth->execute();
                $resultado->sth = $sth;
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";            
            return $resultado;
        }

        public function incluirvendas(){
            $resultado = new stdClass();

            $sql = "INSERT INTO vendas(id_vendedor, valor, data) 
            VALUES(:vendedor, :valor, CURDATE())";
        
            $sth = $this->conn->prepare($sql);
        
            $this->nome = htmlspecialchars(strip_tags($this->vendedor));
            $this->email = htmlspecialchars(strip_tags($this->valor));
        
            try{
                $sth->bindParam(":vendedor", $this->vendedor);
                $sth->bindParam(":valor", $this->valor);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";   
         
            return $resultado;
        }    

        public function cancelarVendas(){
            $resultado = new stdClass();

            $sql = "UPDATE vendas SET cancelada = :cancelada WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            $this->id = htmlspecialchars(strip_tags($this->id));
        
            try{
                $sth->bindParam(":id", $this->id);
                $sth->bindParam(":cancelada", $this->cancelada);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getMessage();
                return $resultado;
            }
            if($sth->rowCount() > 0)
            {
                $resultado->retorno = "OK";   
            }
            else{
                $resultado->retorno = "ERRO";   
                $resultado->msg = "Não foi possível cancelar a venda";
            }
         
            return $resultado;
        }
    }
?>