<?php
    class Vendedores{
        private $conn;

        public $id;
        public $nome;
        public $email;

        public function __construct($db){
            $this->conn = $db;
        }

        public function buscaVendedores(){
            $resultado = new stdClass();

            $sql = "SELECT * FROM vendedores ORDER BY nome";
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

        public function incluirVendedores(){
            $resultado = new stdClass();

            $sql = "INSERT INTO vendedores SET nome = :nome, email = :email";
        
            $sth = $this->conn->prepare($sql);
        
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->email = htmlspecialchars(strip_tags($this->email));
        
            try{
                $sth->bindParam(":nome", $this->nome);
                $sth->bindParam(":email", $this->email);
                $sth->execute();
            }
            catch(PDOException $e){
                $resultado->retorno = "ERRO";
                $resultado->msg = $e->getCode() == 23000 ? "E-mail já cadastrado" : $e->getMessage();
                return $resultado;
            }

            $resultado->retorno = "OK";   
         
            return $resultado;
        }    

        public function alterarVendedores(){
            $resultado = new stdClass();

            $sql = "UPDATE vendedores SET nome = :nome, email = :email WHERE id = :id";
        
            $sth = $this->conn->prepare($sql);
        
            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->id = htmlspecialchars(strip_tags($this->id));
        
            try{
                $sth->bindParam(":nome", $this->nome);
                $sth->bindParam(":email", $this->email);
                $sth->bindParam(":id", $this->id);
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
                $resultado->msg = "Não foi possível alterar o vendedor";
            }
         
            return $resultado;
        }

        function deletarVendedores(){
            $resultado = new stdClass();

            $sql = "DELETE FROM vendedores WHERE id = :id";
            $sth = $this->conn->prepare($sql);
        
            $this->id = htmlspecialchars(strip_tags($this->id));    
            try {
                $sth->bindParam(":id", $this->id);    
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
                $resultado->msg = "Vendedor não encontrado";
            }
         
            return $resultado;
        }

    }
?>