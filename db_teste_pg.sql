-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 22-Nov-2020 às 21:43
-- Versão do servidor: 8.0.21
-- versão do PHP: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_teste_pg`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas`
--

DROP TABLE IF EXISTS `vendas`;
CREATE TABLE IF NOT EXISTS `vendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_vendedor` int NOT NULL,
  `valor` double NOT NULL,
  `data` date NOT NULL,
  `cancelada` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `vendas_ibfk_1` (`id_vendedor`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `vendas`
--

INSERT INTO `vendas` (`id`, `id_vendedor`, `valor`, `data`, `cancelada`) VALUES
(1, 19, 20.8, '2020-11-22', 0),
(2, 19, 25, '2020-11-22', 1),
(3, 20, 30, '2020-11-21', 0),
(4, 19, 15, '2020-11-21', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendedores`
--

DROP TABLE IF EXISTS `vendedores`;
CREATE TABLE IF NOT EXISTS `vendedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(40) NOT NULL,
  `comissao` double NOT NULL DEFAULT '8.5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `vendedores`
--

INSERT INTO `vendedores` (`id`, `nome`, `email`, `comissao`) VALUES
(19, 'joao', 'joao@gmail.com', 8.5),
(20, 'maria', 'maria@hotmail.com', 8.5);

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `vendas`
--
ALTER TABLE `vendas`
  ADD CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_vendedor`) REFERENCES `vendedores` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
