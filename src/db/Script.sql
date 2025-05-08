-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atende`
--

DROP TABLE IF EXISTS `atende`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atende` (
  `CPF_Cliente` char(11) NOT NULL,
  `CPF_Barbeiro` varchar(11) NOT NULL,
  PRIMARY KEY (`CPF_Cliente`,`CPF_Barbeiro`),
  KEY `CPF_Barbeiro` (`CPF_Barbeiro`),
  CONSTRAINT `atende_ibfk_1` FOREIGN KEY (`CPF_Cliente`) REFERENCES `cliente` (`CPF`),
  CONSTRAINT `atende_ibfk_2` FOREIGN KEY (`CPF_Barbeiro`) REFERENCES `barbeiro` (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `barbeiro`
--

DROP TABLE IF EXISTS `barbeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barbeiro` (
  `CPF` varchar(11) NOT NULL,
  `Nome` text,
  `Email` text,
  `Telefone` varchar(11) DEFAULT NULL,
  `Rua` text,
  `Numero` int DEFAULT NULL,
  `Bairro` text,
  `CEP` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `CPF` char(11) NOT NULL,
  `Nome` text,
  `Email` text,
  `Contato_1` varchar(11) DEFAULT NULL,
  `Contato_2` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compra`
--

DROP TABLE IF EXISTS `compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `CPF_Cliente` char(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `CPF_Cliente` (`CPF_Cliente`),
  CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`CPF_Cliente`) REFERENCES `cliente` (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compra_has_pomadas_de_cabelo`
--

DROP TABLE IF EXISTS `compra_has_pomadas_de_cabelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra_has_pomadas_de_cabelo` (
  `Compra_ID` int NOT NULL,
  `Pomada_ID` int NOT NULL,
  PRIMARY KEY (`Compra_ID`,`Pomada_ID`),
  KEY `Pomada_ID` (`Pomada_ID`),
  CONSTRAINT `compra_has_pomadas_de_cabelo_ibfk_1` FOREIGN KEY (`Compra_ID`) REFERENCES `compra` (`ID`),
  CONSTRAINT `compra_has_pomadas_de_cabelo_ibfk_2` FOREIGN KEY (`Pomada_ID`) REFERENCES `pomadas_de_cabelo` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compra_has_produtos`
--

DROP TABLE IF EXISTS `compra_has_produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra_has_produtos` (
  `Compra_ID` int NOT NULL,
  `Produto_ID` int NOT NULL,
  PRIMARY KEY (`Compra_ID`,`Produto_ID`),
  KEY `Produto_ID` (`Produto_ID`),
  CONSTRAINT `compra_has_produtos_ibfk_1` FOREIGN KEY (`Compra_ID`) REFERENCES `compra` (`ID`),
  CONSTRAINT `compra_has_produtos_ibfk_2` FOREIGN KEY (`Produto_ID`) REFERENCES `produtos` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compra_has_roupas`
--

DROP TABLE IF EXISTS `compra_has_roupas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compra_has_roupas` (
  `Compra_ID` int NOT NULL,
  `Roupa_ID` int NOT NULL,
  PRIMARY KEY (`Compra_ID`,`Roupa_ID`),
  KEY `Roupa_ID` (`Roupa_ID`),
  CONSTRAINT `compra_has_roupas_ibfk_1` FOREIGN KEY (`Compra_ID`) REFERENCES `compra` (`ID`),
  CONSTRAINT `compra_has_roupas_ibfk_2` FOREIGN KEY (`Roupa_ID`) REFERENCES `roupas` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pomadas_de_cabelo`
--

DROP TABLE IF EXISTS `pomadas_de_cabelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pomadas_de_cabelo` (
  `ID` int NOT NULL,
  `Tipo_de_cabelo` text,
  `Tamanho_Gramas` int DEFAULT NULL,
  `Fabricacao` date DEFAULT NULL,
  `Validade` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `ID` int NOT NULL,
  `Nome` text,
  `Preco` decimal(10,2) DEFAULT NULL,
  `Descricao` text,
  `Quantidade` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `realiza`
--

DROP TABLE IF EXISTS `realiza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `realiza` (
  `ID_Servicos` int NOT NULL,
  `CPF_Barbeiro` varchar(11) NOT NULL,
  PRIMARY KEY (`ID_Servicos`,`CPF_Barbeiro`),
  KEY `CPF_Barbeiro` (`CPF_Barbeiro`),
  CONSTRAINT `realiza_ibfk_1` FOREIGN KEY (`ID_Servicos`) REFERENCES `servicos_de_cabelo` (`ID`),
  CONSTRAINT `realiza_ibfk_2` FOREIGN KEY (`CPF_Barbeiro`) REFERENCES `barbeiro` (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roupas`
--

DROP TABLE IF EXISTS `roupas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roupas` (
  `ID` int NOT NULL,
  `Peca` text,
  `Tecido` text,
  `Tamanho` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `servicos_de_cabelo`
--

DROP TABLE IF EXISTS `servicos_de_cabelo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos_de_cabelo` (
  `ID` int NOT NULL,
  `Tipo_de_servicos` text,
  `Preco` decimal(10,2) DEFAULT NULL,
  `Duracao_media` time DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-08 12:43:48
