
<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    include_once '../config/db.php';
    include_once '../classes/vendas.php';    

    require_once '../libs/dompdf/autoload.inc.php';    
    use Dompdf\Dompdf;

    require '../libs/PHPMailer/src/Exception.php';
    require '../libs/PHPMailer/src/PHPMailer.php';
    require '../libs/PHPMailer/src/SMTP.php';

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    $resultado = new stdClass();
    
    $database = new Database();
    $db = $database->getConnection();
    
    $classe = new Vendas($db);
    
    $classe->condicao = " WHERE v.data = '".date('Y-m-d')."'";

    if(!isset($_GET['email'])){
        $resultado->retorno = "ERRO";
        $resultado->msg = "Informe um e-mail";
        echo json_encode($resultado);
        return;
    }

    $emailPara = $_GET['email'];
    $seuEmail = ""; //colocar o host
    $suaSenha = ""; // colocar a senha
    $porta = ""; //colocar a porta
    $host = ""; //colocar host

    $res = $classe->buscaVendas();

    if($res->retorno != "OK"){
        $resultado->retorno = "ERRO";
        $resultado->msg = $res->msg;
        echo json_encode($resultado);
    }
    else{
        try{
            $html = "
            <h2 style='width:100%; text-align:center;'> Relatório de Vendas {date('d/m/Y')}</h2>
            <table style='width:100%'>
            <tr style='background-color:grey'>
                <th style='width:10%'>Id Venda</th>
                <th style='width:20%'>Vendedor</th>
                <th style='width:20%'>Comissão</th>
                <th style='width:20%'>Valor</th>
                <th style='width:20%'>Data</th>
            </tr>";

            $totalVenda = 0;
            while ($dados = $res->sth->fetch(PDO::FETCH_OBJ)){
                $totalVenda += $dados->valor;

                $dados->comissao = round($dados->valor * ($dados->comissao_vendedor/ 100), 2);
                $dados->comissao = 'R$ '.number_format($dados->comissao, 2, ',', '.');
                $dados->data = date('d/m/Y', strtotime($dados->data));
                $dados->valor = 'R$ '.number_format($dados->valor, 2, ',', '.');

                $html .= "
                <tr>
                    <th style='width:10%'>{$dados->id}</th>
                    <th style='width:20%'>{$dados->nome}</th>
                    <th style='width:20%'>{$dados->comissao}</th>
                    <th style='width:20%'>{$dados->valor}</th>
                    <th style='width:20%'>{$dados->data}</th>
                </tr>
                ";
            }

            $totalVenda = 'R$ '.number_format($totalVenda, 2, ',', '.');
            $html .= "
                <tr style='background-color:#D3D3D3'>
                    <th style='width:10%'></th>
                    <th style='width:20%'></th>
                    <th style='width:20%'>Total Vendas</th>
                    <th style='width:20%'>{$totalVenda}</th>
                    <th style='width:20%'></th>
                </tr>
            </table>
            ";

            $dompdf = new Dompdf();

            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $file = $dompdf->output();

            if(!is_dir("../arquivos"))
                mkdir("../arquivos", 0777);

            file_put_contents('../arquivos/relatorio.pdf', $file);

            $mail = new PHPMailer();
            $mail->IsSMTP();
            $mail->CharSet = 'UTF-8';
            $mail->Host = $host;
            $mail->SMTPDebug = 0;
            $mail->SMTPAuth = true;
            $mail->Port = $porta;
            $mail->Username = $seuEmail;
            $mail->Password = $suaSenha;
            $mail->SetFrom($seuEmail, "");
            $mail->Subject = "Relatório";
            $mail->Body = "Relatório de ".date('d/m/Y');
            $mail->AddAddress($emailPara);

            $mail->AddAttachment('../arquivos/relatorio.pdf', 'relatorio.pdf');

            if (!$mail->Send()) {
                $resultado->retorno = "ERRO";
                $resultado->msg = $mail;
                echo json_encode($resultado);
                return;
            }
        }
        catch(Exception $e){
            $resultado->retorno = "ERRO";
            $resultado->msg = $e->getMessage();
            echo json_encode($resultado);
        }

        $resultado->retorno = "OK";
        echo json_encode($resultado);
    }
?>