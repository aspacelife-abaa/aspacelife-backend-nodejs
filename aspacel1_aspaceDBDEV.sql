-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 11, 2023 at 06:02 PM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aspacel1_aspaceDBDEV`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_rules`
--

CREATE TABLE `account_rules` (
  `aid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `privileges` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account_rules`
--

INSERT INTO `account_rules` (`aid`, `name`, `privileges`, `created_at`) VALUES
(1, 'regular', 'payout,withdrawal,transfer,funding', '2023-03-10 12:00:18'),
(2, 'merchant', 'payout,withdrawal,transfer,funding', '2023-03-10 12:09:44');

-- --------------------------------------------------------

--
-- Table structure for table `airtime_purchase`
--

CREATE TABLE `airtime_purchase` (
  `aId` int(11) NOT NULL,
  `amount` varchar(11) DEFAULT NULL,
  `recipient` varchar(15) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `memo` text,
  `aDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `network` text,
  `flw_ref` text,
  `tx_ref` text,
  `nameServiceProvider` text,
  `reference` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `airtime_purchase`
--

INSERT INTO `airtime_purchase` (`aId`, `amount`, `recipient`, `PhoneNumber`, `memo`, `aDate`, `network`, `flw_ref`, `tx_ref`, `nameServiceProvider`, `reference`) VALUES
(2, '300', 'undefined', '08034148857', 'Airtime recharge to 08034148857', '2023-03-19 10:19:03', 'undefined', 'undefined', 'undefined', NULL, 'undefined'),
(3, '100', 'undefined', '08034148857', 'Airtime recharge to 08034148857', '2023-03-19 11:27:12', 'undefined', 'undefined', 'undefined', NULL, 'undefined'),
(4, '100', 'undefined', '08034148857', 'Airtime recharge to 08034148857', '2023-03-19 11:29:48', 'undefined', 'undefined', 'undefined', NULL, 'undefined'),
(5, '100', '08161235924', '08034148857', 'Airtime recharge to 08034148857', '2023-03-19 11:43:45', 'MTN', '4c7e2f2f-906f-40eb-a862-fbaeb818a1d2', '4c7e2f2f-906f-40eb-a862-fbaeb818a1d2', NULL, '4c7e2f2f-906f-40eb-a862-fbaeb818a1d2'),
(6, '100', '08161235924', '08034148857', 'Airtime recharge to 08034148857', '2023-03-19 11:51:00', 'MTN', '7a655b83-56e1-423f-b1f3-954ea97686a7', '7a655b83-56e1-423f-b1f3-954ea97686a7', NULL, '7a655b83-56e1-423f-b1f3-954ea97686a7'),
(7, '100', '08161235924', '09115876162', 'Airtime recharge to 09115876162', '2023-03-20 09:02:43', 'MTN NIGERIA', '134b132e-0de0-41c2-bf33-4cbdca9a917f', '134b132e-0de0-41c2-bf33-4cbdca9a917f', NULL, '134b132e-0de0-41c2-bf33-4cbdca9a917f'),
(8, '100', '08102770183', '08034148857', 'Airtime recharge to 08034148857', '2023-03-20 09:45:43', 'MTN', 'eaa6a505-fdc9-4f5f-90df-72e3dcdd5294', 'eaa6a505-fdc9-4f5f-90df-72e3dcdd5294', NULL, 'eaa6a505-fdc9-4f5f-90df-72e3dcdd5294'),
(9, '100', '08068827726', '07053453191', 'Airtime recharge to 07053453191', '2023-03-20 11:25:04', 'MTN NIGERIA', 'e4a3db1b-28c4-4dae-b01f-20fcfae95537', 'e4a3db1b-28c4-4dae-b01f-20fcfae95537', NULL, 'e4a3db1b-28c4-4dae-b01f-20fcfae95537');

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

CREATE TABLE `bank` (
  `id` int(11) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `account_number` varchar(10) DEFAULT NULL,
  `bank_code` varchar(10) DEFAULT NULL,
  `bank_name` text,
  `verificationToken` text,
  `txRef` text NOT NULL,
  `account_name` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`id`, `phone_number`, `account_number`, `bank_code`, `bank_name`, `verificationToken`, `txRef`, `account_name`, `is_active`, `create_at`) VALUES
(10, '08161235924', '0403422358', '058', 'Guaranty Trust Bank', NULL, 'dkdkkd', 'Marshall Ekene', 1, '2023-03-07 17:00:56'),
(13, '08034148857', '2066967408', '033', 'United Bank For Africa', NULL, '49567fc7-2567-4833-aed3-59697e79f96c', NULL, 1, '2023-03-20 08:47:45'),
(14, '09115876162', '2205753961', '033', 'United Bank For Africa', NULL, 'e7b38f11-ce52-44ff-9233-150082fed132', NULL, 1, '2023-03-20 10:20:18'),
(23, '08161235924', '2122114852', '033', 'UBA', NULL, 'eoeeoeooeieeie0e', NULL, 1, '2023-04-03 13:21:57');

-- --------------------------------------------------------

--
-- Table structure for table `BaseAccount`
--

CREATE TABLE `BaseAccount` (
  `bId` int(11) NOT NULL,
  `transactionFrom` text,
  `transactionTo` text,
  `refNo` text,
  `transactionStatus` text,
  `transactionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transactionRef` text,
  `merchantId` text,
  `transactionAmount` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `BaseAccount`
--

INSERT INTO `BaseAccount` (`bId`, `transactionFrom`, `transactionTo`, `refNo`, `transactionStatus`, `transactionDate`, `transactionRef`, `merchantId`, `transactionAmount`) VALUES
(13, '08161235924', '08102770183', '1e2a83', 'pending', '2023-04-11 14:37:47', NULL, NULL, '300'),
(14, '08161235924', '08102770183', 'e47bd5', 'pending', '2023-04-11 14:39:36', NULL, NULL, '150');

-- --------------------------------------------------------

--
-- Table structure for table `data_purchase`
--

CREATE TABLE `data_purchase` (
  `dId` int(11) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `recipient` varchar(15) DEFAULT NULL,
  `DataPlanId` varchar(11) DEFAULT NULL,
  `dStatus` varchar(11) NOT NULL DEFAULT '0',
  `dReferenceNo` text,
  `dDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nameServiceProvider` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `data_purchase`
--

INSERT INTO `data_purchase` (`dId`, `PhoneNumber`, `recipient`, `DataPlanId`, `dStatus`, `dReferenceNo`, `dDate`, `nameServiceProvider`, `amount`) VALUES
(15, '08034148857', '08161235924', '', 'success', 'd1719f6b45fae8136e033c59fa692fcf', '2023-03-19 12:41:22', 'MTN', 140);

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `dep_id` int(11) NOT NULL,
  `account_number` varchar(11) NOT NULL,
  `amount` float NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `deposit_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `documents_upload`
--

CREATE TABLE `documents_upload` (
  `dId` int(11) NOT NULL,
  `url` text,
  `user_phoneNumber` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `document_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `electricity_purchase`
--

CREATE TABLE `electricity_purchase` (
  `eId` int(11) NOT NULL,
  `phone_number` int(15) DEFAULT NULL,
  `amount` varchar(11) DEFAULT NULL,
  `memo` text,
  `meter_number` text,
  `provider` text,
  `reference` text,
  `eDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `merchant_profile`
--

CREATE TABLE `merchant_profile` (
  `mId` int(11) NOT NULL,
  `cac_number` varchar(50) DEFAULT NULL,
  `company_name` text,
  `company_address` text,
  `registration_date` varchar(50) DEFAULT NULL,
  `merchantId` varchar(50) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `mDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `merchant_profile`
--

INSERT INTO `merchant_profile` (`mId`, `cac_number`, `company_name`, `company_address`, `registration_date`, `merchantId`, `PhoneNumber`, `mDate`) VALUES
(7, '3410882', 'WHITE GOLD TABLE WATER', 'WESTERN BYPASS KANO', '2021-07-01', '358903', '09036770533', '2023-03-18 20:21:40'),
(8, '1912303', 'KOBAM ENERGY LIMITED', 'OYETAYO STREET, BOLADE', '30 March 2022', '253649', '08163036664', '2023-03-19 11:47:02'),
(9, '2198330', 'DEEP WATERS SOLICITORS', 'SUITE D5, 3RD FLOOR, KENUJ 02 PLAZA, KAURA DISTRICT,', '12 March 2012', '317322', '08038931801', '2023-03-20 11:39:48'),
(10, '383899', 'Jackal Solutions', '1 jackalsolutions Rd', '1984-01-02', '478525', '08102770183', '2023-04-10 00:03:20'),
(16, '222729', 'Hoop Joup kols', 'Kod djkd kkd dkkd kd', '10/09/1981', '3ae0fb', '08161235924', '2023-04-10 21:56:53');

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` int(11) NOT NULL,
  `txRef` text,
  `txStatus` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `split_payment`
--

CREATE TABLE `split_payment` (
  `sPid` int(11) NOT NULL,
  `spAmount` text,
  `spTitle` text,
  `spNumberOfPaticipants` int(11) DEFAULT NULL,
  `spDistributions` text,
  `spDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `split_payment_paticipants`
--

CREATE TABLE `split_payment_paticipants` (
  `sPpid` int(11) NOT NULL,
  `PhoneNumber` int(11) DEFAULT NULL,
  `PrincipalAmount` int(11) DEFAULT NULL,
  `sPpName` text,
  `sPpMemo` text,
  `sPpDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sPpStatus` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `system_auth`
--

CREATE TABLE `system_auth` (
  `sId` int(11) NOT NULL,
  `sys_token` text,
  `sys_name` text,
  `sys_secret_key` text,
  `sys_public_key` text,
  `sys_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `tid` int(11) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `verificationToken` varchar(11) DEFAULT NULL,
  `t_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`tid`, `PhoneNumber`, `verificationToken`, `t_date`) VALUES
(24, '08034148857', '5771921', '2023-03-27 06:07:07'),
(25, '09115876162', '59798883', '2023-03-30 14:06:10'),
(26, '08102770183', '3023', '2023-04-02 07:05:54'),
(27, '+2348161235924', '2146', '2023-04-02 07:09:35'),
(28, '08062381428', '93403483', '2023-04-03 16:20:25'),
(29, '07065811524', '79621133', '2023-04-03 16:28:16'),
(30, '08161235924', '2925297', '2023-04-09 10:46:12');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `beneficiary_account` varchar(11) DEFAULT NULL,
  `transaction_type` varchar(30) NOT NULL,
  `amount` float NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `memo` text,
  `customer_name` text NOT NULL,
  `beneficiary_bank_name` text NOT NULL,
  `transaction_ref` text,
  `transaction_status` varchar(11) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `beneficiary_account`, `transaction_type`, `amount`, `PhoneNumber`, `memo`, `customer_name`, `beneficiary_bank_name`, `transaction_ref`, `transaction_status`, `transaction_date`) VALUES
(1134, '09115876162', 'funding', 20000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', 'f80cef26-4d12-485c-a245-352d67400071', 'true', '2023-03-19 11:03:05'),
(1135, '08161235924', 'debit', 100, '08034148857', 'Airtime top-up of NGN100 to 08161235924', 'Ani Marshall', 'Airtime Purchase', '0908693f60fc73eed45fa60d1505259c', 'success', '2023-03-19 11:27:12'),
(1136, '08161235924', 'debit', 100, '08034148857', 'Airtime top-up of NGN100 to 08161235924', 'Ani Marshall', 'Airtime Purchase', '77aec89fb3d0bbe1127a472fb9d546e7', 'success', '2023-03-19 11:29:48'),
(1137, '08161235924', 'debit', 100, '08034148857', 'Airtime top-up of NGN100 to 08161235924', 'Ani Marshall', 'Airtime Purchase', 'b8ed97fa7639656f77362beba66760c9', 'success', '2023-03-19 11:43:45'),
(1138, '08161235924', 'debit', 100, '08034148857', 'Airtime top-up of NGN100 to 08161235924', 'Ani Marshall', 'Airtime Purchase', '69bde3a7f2acf8d4acc93947bbe244c7', 'success', '2023-03-19 11:51:00'),
(1139, '08034148857', 'debit', 100, '08034148857', 'Data top-up of NGN100 to 08161235924', 'Ani Marshall', 'AbaaPay Wallet', '108a0cca4e7bddbc438df0ac10f7e805', 'failed', '2023-03-19 12:14:23'),
(1140, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', 'b9c3ab6bdd5f20725b14aa117833b28f', 'failed', '2023-03-19 12:26:36'),
(1141, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '93a7cd347e11b572d58842cc09bed965', 'failed', '2023-03-19 12:33:33'),
(1142, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', 'd1719f6b45fae8136e033c59fa692fcf', 'success', '2023-03-19 12:41:22'),
(1143, '08163036664', 'funding', 100000, '08163036664', 'Wallet funding (self)', 'KOBAM ENERGY LIMITED null', 'Paystack', 'd1dddd66-e72b-4a7f-ab89-d669941e8e9d', 'true', '2023-03-19 16:03:29'),
(1144, '09115876162', 'transfer', 10000, '08163036664', 'wallet-to-wallet transfer to Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', 'd75f6e427e563619cd4c14fbf9c072a7', 'success', '2023-03-19 18:00:37'),
(1145, '09115876162', 'funding', 10000, '09115876162', 'wallet-to-wallet from KOBAM ENERGY LIMITED null', 'KOBAM ENERGY LIMITED null', 'AbaaPay wallet', 'd75f6e427e563619cd4c14fbf9c072a7', 'success', '2023-03-19 18:00:37'),
(1146, '08137281916', 'debit', 140, '08137281916', 'Data top-up of NGN140 to undefined', 'Abraham Israel', 'AbaaPay Wallet', '72f3510a057039cf65973e8d76771881', 'success', '2023-03-19 18:13:28'),
(1147, '08137281916', 'debit', 50, '08137281916', 'Data top-up of NGN50 to undefined', 'Abraham Israel', 'AbaaPay Wallet', '99f2aa797cf8c22613a220d241032239', 'success', '2023-03-19 18:16:45'),
(1149, '45700548063', 'debit', 2000, '08034148857', 'Electricity top-up of NGN2000 to 45700548063', 'Ani Marshall', 'Electricity Purchase', '91528f9545b77b6de5b1298fd0d5cd2b', 'success', '2023-03-19 18:26:31'),
(1150, '08137281916', 'debit', 150, '08137281916', 'Data top-up of NGN150 to undefined', 'Abraham Israel', 'AbaaPay Wallet', 'be5430a1adecb05d388c081b2cbb4299', 'success', '2023-03-19 20:17:01'),
(1151, '08137281916', 'debit', 150, '08137281916', 'Data top-up of NGN150 to undefined', 'Abraham Israel', 'AbaaPay Wallet', '2dc22dc516a384b4b61b59bddedf161c', 'success', '2023-03-19 20:18:57'),
(1152, '08137281916', 'debit', 150, '08137281916', 'Data top-up of NGN150 to undefined', 'Abraham Israel', 'AbaaPay Wallet', '7795c48e2f12207a3acb0b2decac68ba', 'success', '2023-03-19 22:47:27'),
(1153, '08137281916', 'debit', 140, '08137281916', 'Data top-up of NGN140 to undefined', 'Abraham Israel', 'AbaaPay Wallet', '91b52d8f24d523f1473f01973f801690', 'success', '2023-03-20 07:18:38'),
(1154, '08137281916', 'debit', 140, '08137281916', 'Data top-up of NGN140 to undefined', 'Abraham Israel', 'AbaaPay Wallet', 'b7ef0274dcdeddb8f73e3452cbd3e150', 'success', '2023-03-20 07:19:19'),
(1155, '08034148857', 'debit', 240, '08034148857', 'Data top-up of NGN240 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '9749842dd3097eff237c93d9b1eb37d0', 'failed', '2023-03-20 07:21:34'),
(1156, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', 'c8ecc1b6bd76fb393815d3883cdfed82', 'failed', '2023-03-20 07:25:11'),
(1157, '09115876162', 'funding', 50000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '4153d5f8-8f63-4348-bf91-ac730524a9aa', 'true', '2023-03-20 08:20:08'),
(1158, '08034148857', 'funding', 1000, '08034148857', 'Wallet funding (self)', 'Ani Marshall', 'Paystack', 'ff127ffc-2bcd-47ba-bbfb-13d14c8836f3', 'true', '2023-03-20 08:25:44'),
(1159, '09115876162', 'funding', 1000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '3c5a54b8-0da1-4bdd-8c32-ab5e2923b3fe', 'true', '2023-03-20 08:27:06'),
(1160, '08034148857', 'transfer', 1000, '09115876162', 'wallet-to-wallet transfer to djdkd dkkd ', 'djdkd dkkd ', 'AbaaPay wallet', 'eccbc10908ee811f8f7735e8f8e81d3f', 'success', '2023-03-20 08:29:10'),
(1161, '08034148857', 'funding', 1000, '08034148857', 'wallet-to-wallet from Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', 'eccbc10908ee811f8f7735e8f8e81d3f', 'success', '2023-03-20 08:29:10'),
(1162, '08161235924', 'debit', 100, '09115876162', 'Airtime top-up of NGN100 to 08161235924', 'Nasir  Lawal', 'Airtime Purchase', '9dc16ee9d1c3d0a5668e34bc73d51e9c', 'success', '2023-03-20 09:02:43'),
(1163, '09115876162', 'debit', 140, '09115876162', 'Data top-up of NGN140 to undefined', 'Nasir  Lawal', 'AbaaPay Wallet', '669365191165464dada2b3bb226700c5', 'failed', '2023-03-20 09:05:08'),
(1164, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', 'f72dbc31fc49ebbdbf0a80e90e2eb62b', 'failed', '2023-03-20 09:11:05'),
(1165, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', 'b94ca10f448a7d69d6ba44ad6fee8b31', 'failed', '2023-03-20 09:21:12'),
(1166, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '7702180f9d0f5d0612e86b813628c444', 'failed', '2023-03-20 09:22:35'),
(1167, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '074a3356d4073070506a0621b81cab01', 'failed', '2023-03-20 09:24:10'),
(1168, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '45e5b21ecafdd2484d13c5e60c27e40a', 'success', '2023-03-20 09:27:01'),
(1169, '09115876162', 'debit', 140, '09115876162', 'Data top-up of NGN140 to undefined', 'Nasir  Lawal', 'AbaaPay Wallet', '6c9d982bd37f900ce21dcd777dec0d95', 'success', '2023-03-20 09:27:35'),
(1170, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '28821165734a5d7e073181fc8754f2f0', 'success', '2023-03-20 09:44:16'),
(1171, '08102770183', 'debit', 100, '08034148857', 'Airtime top-up of NGN100 to 08102770183', 'Ani Marshall', 'Airtime Purchase', 'b9a1f05d7c68e27f63c812d37a7c2be0', 'success', '2023-03-20 09:45:43'),
(1172, '08034148857', 'debit', 140, '08034148857', 'Data top-up of NGN140 to undefined', 'Ani Marshall', 'AbaaPay Wallet', '49e0ca9769fc5d585fd71d16fe37022e', 'success', '2023-03-20 09:46:22'),
(1173, '09115876162', 'funding', 20000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '34a094fa-3833-46cc-921e-437e69730100', 'true', '2023-03-20 10:08:43'),
(1174, '08034148857', 'transfer', 1000, '09115876162', 'wallet-to-wallet transfer to djdkd dkkd ', 'djdkd dkkd ', 'AbaaPay wallet', '13cd25e07bfca511da1b27213169bccd', 'success', '2023-03-20 10:16:57'),
(1175, '08034148857', 'funding', 1000, '08034148857', 'wallet-to-wallet from Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', '13cd25e07bfca511da1b27213169bccd', 'success', '2023-03-20 10:16:58'),
(1176, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '8381c554d65b2a58033086c1c4d41fc2', 'success', '2023-03-20 10:20:37'),
(1177, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', 'e725c0da2a59cc5f41131b22990148fb', 'success', '2023-03-20 10:22:53'),
(1178, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '507e8305d160db04fb353e954dc24b36', 'pending', '2023-03-20 10:23:57'),
(1179, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', 'b23b86ea2495cc431b035e223e280e68', 'pending', '2023-03-20 10:25:27'),
(1180, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '39efcecbf6d064870b72cd6d79d0dbc5', 'success', '2023-03-20 10:27:43'),
(1181, '07053453191', 'funding', 1000, '07053453191', 'Wallet funding (self)', 'Chinwendu Ndukwe', 'Paystack', '058a870e-c6ac-4ec9-94bf-20509a3b40ef', 'true', '2023-03-20 11:10:10'),
(1182, '07053453191', 'funding', 50, '07053453191', 'Wallet funding (self)', 'Chinwendu Ndukwe', 'Paystack', '3945fb93-813b-42c1-b1e5-c46b769d9a48', 'true', '2023-03-20 11:12:03'),
(1183, '09115876162', 'transfer', 900, '07053453191', 'wallet-to-wallet transfer to Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', '5902bfb45f54e12111736265bdf529d3', 'success', '2023-03-20 11:15:28'),
(1184, '09115876162', 'funding', 900, '09115876162', 'wallet-to-wallet from Chinwendu Ndukwe', 'Chinwendu Ndukwe', 'AbaaPay wallet', '5902bfb45f54e12111736265bdf529d3', 'success', '2023-03-20 11:15:28'),
(1185, '08068827726', 'debit', 100, '07053453191', 'Airtime top-up of NGN100 to 08068827726', 'Chinwendu Ndukwe', 'Airtime Purchase', '9d20e4befff3199a1f226ee3939e7241', 'success', '2023-03-20 11:25:04'),
(1186, '09115876162', 'funding', 10000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '4d061608-777c-4cef-9800-7bca87568f27', 'true', '2023-03-29 20:11:11'),
(1187, '08034148857', 'transfer', 100, '09115876162', 'wallet-to-wallet transfer to djdkd dkkd ', 'djdkd dkkd ', 'AbaaPay wallet', '74850ca1402ebc61175ad88465149f35', 'success', '2023-03-29 20:16:38'),
(1188, '08034148857', 'funding', 100, '08034148857', 'wallet-to-wallet from Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', '74850ca1402ebc61175ad88465149f35', 'success', '2023-03-29 20:16:38'),
(1189, '2205753961', 'withdrawal', 10000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '394cae996e79e21950917ed77e2ebff2', 'success', '2023-03-29 20:17:12'),
(1190, '2205753961', 'withdrawal', 10000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '394658f63d3bafe054bb81cbd39702e3', 'success', '2023-03-29 20:17:57'),
(1191, '08161235924', 'transfer', 300, '08161235924', 'Wallet funding (self)', 'Marshall Ekene', 'USSD', '1994fb221cad97dccdff5fbd4f5b57c0', 'success', '2023-03-30 08:07:22'),
(1192, '08161235924', 'transfer', 400, '08161235924', 'USSD Wallet transfer', 'Marshall Ekene', 'AbaaPay wallet', '2e076316b5f3afb5764c3b77811bee47', 'success', '2023-03-30 08:41:13'),
(1193, '08034148857', 'funding', 400, '08034148857', 'USSD Wallet funding', 'Ani Marshall', 'AbaaPay wallet', '2e076316b5f3afb5764c3b77811bee47', 'success', '2023-03-30 08:41:13'),
(1194, '2205753961', 'withdrawal', 10000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '2e9547eecbfb4ebd9a6ac2d259cf9c76', 'success', '2023-03-30 09:08:02'),
(1195, '0403422358', 'withdrawal', 500, '08034148857', 'Cash withdrawal to bank', 'Ani Marshall', 'Guaranty Trust Bank', '159081cfd5c456a0c0951512970f96ec', 'success', '2023-03-30 09:23:04'),
(1196, '0403422358', 'withdrawal', 500, '08034148857', 'Cash withdrawal to bank', 'Ani Marshall', 'Guaranty Trust Bank', '88c385fc3360b0d996189ab4815c1b4b', 'success', '2023-03-30 09:26:25'),
(1197, '2205753961', 'withdrawal', 10000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '5dac20156680fbc6af5e73374e1789c4', 'success', '2023-03-30 09:30:35'),
(1198, '2205753961', 'withdrawal', 1000, '09115876162', 'Cash withdrawal to bank', 'Nasir  Lawal', 'United Bank For Africa', '18fa029d60e9066aaa6af3371209c6ca', 'success', '2023-03-30 09:32:47'),
(1199, '09115876162', 'funding', 100000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '95894d5e-8161-4f53-9a13-56f044854e09', 'true', '2023-03-30 09:33:09'),
(1200, '08034148857', 'transfer', 100, '09115876162', 'wallet-to-wallet transfer to djdkd dkkd ', 'djdkd dkkd ', 'AbaaPay wallet', '9ad71d054124224a0add55769a306c21', 'success', '2023-03-30 09:33:52'),
(1201, '08034148857', 'funding', 100, '08034148857', 'wallet-to-wallet from Nasir  Lawal', 'Nasir  Lawal', 'AbaaPay wallet', '9ad71d054124224a0add55769a306c21', 'success', '2023-03-30 09:33:52'),
(1202, '08161235924', 'transfer', 200, '08161235924', 'USSD Wallet transfer', 'Hoo Max', 'AbaaPay wallet', '371a62927cc3bb8f489d7b44f41e738b', 'success', '2023-03-30 15:00:41'),
(1203, '09115876162', 'funding', 200, '09115876162', 'USSD Wallet funding', 'Nasir  Lawal', 'AbaaPay wallet', '371a62927cc3bb8f489d7b44f41e738b', 'success', '2023-03-30 15:00:41'),
(1204, '09115876162', 'funding', 10000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '54f815aa-da58-49a8-a6b2-58f901021332', 'true', '2023-03-30 16:53:53'),
(1205, '09115876162', 'funding', 10000, '09115876162', 'Wallet funding (self)', 'Nasir  Lawal', 'Paystack', '5b5d5d49-1155-4b57-8575-ff00cb3ca4eb', 'true', '2023-03-30 16:59:26'),
(1206, '08161235924', 'transfer', 200, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'c87a289470d8eefc0393a15f005f2842', 'success', '2023-03-31 08:34:14'),
(1207, '08161235924', 'transfer', 100, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'bf43e0f7bd092e04cb8ceaa60ad91694', 'success', '2023-03-31 08:41:04'),
(1208, '08034148857', 'funding', 100, '08034148857', 'Wallet funding', 'Ani Marshall', 'AbaaPay Wallet', 'bf43e0f7bd092e04cb8ceaa60ad91694', 'success', '2023-03-31 08:41:04'),
(1209, '08161235924', 'transfer', 100, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'b089efced71cfdf387f93e366ea5f584', 'success', '2023-03-31 08:44:05'),
(1210, '08034148857', 'funding', 100, '08034148857', 'Wallet funding', 'Ani Marshall', 'AbaaPay Wallet', 'b089efced71cfdf387f93e366ea5f584', 'success', '2023-03-31 08:44:06'),
(1211, '08161235924', 'transfer', 100, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'ee28d0860c05788daab248050d62d15f', 'success', '2023-03-31 08:59:13'),
(1212, '08034148857', 'funding', 100, '08034148857', 'Wallet funding', 'Ani Marshall', 'AbaaPay Wallet', 'ee28d0860c05788daab248050d62d15f', 'success', '2023-03-31 08:59:14'),
(1213, '08161235924', 'transfer', 59, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', '61579', 'success', '2023-03-31 12:42:46'),
(1214, '08161235924', 'transfer', 59, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'AC0F8', 'success', '2023-03-31 13:15:54'),
(1215, '08161235924', 'transfer', 59, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'C4EB8', 'success', '2023-03-31 13:18:34'),
(1216, '08161235924', 'transfer', 367, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', '2954B', 'success', '2023-03-31 14:40:38'),
(1217, '08161235924', 'transfer', 367, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', '966A6', 'success', '2023-03-31 14:40:45'),
(1218, '08161235924', 'transfer', 100, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'F7C6A', 'success', '2023-03-31 16:46:16'),
(1219, '09115876162', 'funding', 100, '09115876162', 'Wallet funding', 'Nasir  Lawal', 'AbaaPay Wallet', 'F7C6A', 'success', '2023-03-31 16:46:16'),
(1220, '08161235924', 'transfer', 30, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', '2B2A0', 'success', '2023-04-01 05:51:50'),
(1221, '08161235924', 'transfer', 50, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', 'F364A', 'success', '2023-04-01 06:06:56'),
(1222, '08161235924', 'transfer', 50, '08161235924', 'Wallet transfer', 'Marshall Ekene', 'AbaaPay Wallet', '42604', 'success', '2023-04-01 06:09:50'),
(1223, '08034148857', 'funding', 50, '08034148857', 'Wallet funding', 'Ani Marshall', 'AbaaPay Wallet', '42604', 'success', '2023-04-01 06:09:51'),
(1224, '08161235924', 'funding', 59, '08034148857', 'USSD Payout to 08161235924', 'USSD Transaction', 'AbaaPay Wallet', 'fbd86a9b025d561c332f00ba7986a022', '', '2023-04-02 08:42:34'),
(1225, '08161235924', 'funding', 59, '08034148857', 'USSD Payout to 08161235924', 'USSD Transaction', 'AbaaPay Wallet', '116586239ea14fd5bdd44df21c87d16e', '', '2023-04-02 16:00:22'),
(1226, '0403422358', 'withdrawal', 100, '08034148857', 'Cash withdrawal to bank', 'Ani Marshall', 'Guaranty Trust Bank', '0c28587026a7351d902298af65fac944', 'pending', '2023-04-03 10:35:40'),
(1227, '0403422358', 'withdrawal', 100, '08034148857', 'Cash withdrawal to bank', 'Ani Marshall', 'Guaranty Trust Bank', '2788728676a51a38bc3ba9d6bea03a58', 'pending', '2023-04-03 10:37:06'),
(1228, '0403422358', 'withdrawal', 100, '08034148857', 'Cash withdrawal to bank', 'Ani Marshall', 'Guaranty Trust Bank', '0d163737cc23b53ff30f720118713d61', 'pending', '2023-04-03 10:38:44'),
(1229, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'dkdkkd', 'success', '2023-04-03 12:56:39'),
(1230, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 12:58:09'),
(1231, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:02:08'),
(1232, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:06:48'),
(1233, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:12:18'),
(1234, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:18:38'),
(1235, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:20:08'),
(1236, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:21:04'),
(1237, '08161235924', 'funding', 50, '08161235924', 'Card transaction', 'Marshall Ekene', 'Paystack', 'eoeeoeooeieeie0e', 'success', '2023-04-03 13:21:57'),
(1238, '08192770183', 'transfer', 100, '08161235924', 'Send to 08192770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '690654', '', '2023-04-06 12:01:21'),
(1239, '08102770183', 'transfer', 100, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', 'e2d8c8', '', '2023-04-06 12:02:34'),
(1240, '08102770183', 'transfer', 100, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', 'e1a113', '', '2023-04-06 12:05:13'),
(1241, '08102770183', 'transfer', 100, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '9bb11d', '', '2023-04-06 12:38:35'),
(1242, '08102770183', 'transfer', 200, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '272702', '', '2023-04-06 12:39:03'),
(1243, '08102770183', 'transfer', 200, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '909437', '', '2023-04-06 12:39:22'),
(1244, '08102770183', 'transfer', 200, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '34ff1f', '', '2023-04-07 11:26:51'),
(1245, '08102770183', 'transfer', 200, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', 'b905da', '', '2023-04-09 09:06:08'),
(1246, '08102770183', 'transfer', 200, '08161235924', 'Send to 08102770183 from wallet', 'Unregistered user', 'AbaaPay Wallet', '19d47d', '', '2023-04-09 09:18:05'),
(1247, '08161235924', 'credit', 59, '08034148857', 'Cash Pick-Up to 08161235924', 'Cash Pick-Up', 'AbaaPay Wallet', '228135', '', '2023-04-09 10:56:46'),
(1248, '08161235924', 'credit', 59, '08034148857', 'Cash Pick-Up to 08161235924', 'Cash Pick-Up', 'AbaaPay Wallet', '61789A', '', '2023-04-09 11:00:37'),
(1249, '08161235924', 'credit', 59, '08034148857', 'Cash Pick-Up to 08161235924', 'Cash Pick-Up', 'AbaaPay Wallet', 'DA2E81', '', '2023-04-09 11:10:06'),
(1250, 'undefined', 'debit', 200, '08034148857', 'Send to beneficiaries from wallet', '2 beneficiaries', 'AbaaPay Wallet', 'bb2597e64a2d1d0e1c8e45b50877bf53', '', '2023-04-11 13:36:02'),
(1251, '08034148857', 'debit', 200, '08034148857', 'Send to beneficiaries from wallet', '2 beneficiaries', 'AbaaPay Wallet', 'abf0583693992912860d424e9223b05b', 'success', '2023-04-11 13:39:20'),
(1252, '08161235924', 'debit', 200, '08161235924', 'Send to beneficiaries from wallet', '2 beneficiaries', 'AbaaPay Wallet', 'e689d9a4e560db82daa3aada10e76996', 'success', '2023-04-11 13:51:49'),
(1253, '08161235924', 'debit', 200, '08161235924', 'Send to beneficiaries from wallet', '2 beneficiaries', 'AbaaPay Wallet', '16274b7b36d58f532ee3a483906e4e78', 'success', '2023-04-11 13:52:19'),
(1254, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '164e6c80a98a9c3570399580b4d957a4', 'success', '2023-04-11 14:05:24'),
(1255, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '077c0f1d4227a59c8557315aa0644483', 'success', '2023-04-11 14:07:40'),
(1256, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '61a9b9815c768b3e5bc6b75cbe5324a5', 'success', '2023-04-11 14:14:14'),
(1257, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '04683dc0d41a6b751ff70c71cb9412b7', 'success', '2023-04-11 14:15:14'),
(1258, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '8192b5e1d7ae5af00720a2b8d4d45068', 'success', '2023-04-11 14:20:52'),
(1259, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', 'f699dfefc4544e2cb5b956f3902cf9ac', 'success', '2023-04-11 14:22:03'),
(1260, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '6332e65fb52a19a00433e8da5c619ef0', 'success', '2023-04-11 14:23:48'),
(1261, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '449e2f21c63b10153642df54602c5550', 'success', '2023-04-11 14:24:23'),
(1262, '08161235924', 'debit', 200, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', 'df2ec7e4a6107e90538bd58cc1479e63', 'success', '2023-04-11 14:34:59'),
(1263, '08161235924', 'debit', 300, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '9579c99115f7ed25b2297d9222151cbc', 'success', '2023-04-11 14:37:47'),
(1264, '08161235924', 'debit', 300, '08161235924', 'sjsjs (Split Payment)', '2 beneficiaries', 'AbaaPay Wallet', '19a5f5afea8e8b3030516cfb9bc4c032', 'success', '2023-04-11 14:39:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FirstName` text,
  `LastName` varchar(30) DEFAULT NULL,
  `MiddleName` varchar(30) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `EmailAddress` varchar(50) DEFAULT NULL,
  `Password` text,
  `Nin` varchar(11) DEFAULT NULL,
  `dob` text,
  `TransactionPin` text,
  `AccessToken` text,
  `verificationToken` int(6) DEFAULT NULL,
  `email_notification` tinyint(1) NOT NULL DEFAULT '0',
  `sms_notification` tinyint(1) NOT NULL DEFAULT '0',
  `account_type` varchar(50) DEFAULT 'regular',
  `PhoneNumber_Secondary` varchar(50) DEFAULT NULL,
  `default_PhoneNumber` varchar(15) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FirstName`, `LastName`, `MiddleName`, `PhoneNumber`, `EmailAddress`, `Password`, `Nin`, `dob`, `TransactionPin`, `AccessToken`, `verificationToken`, `email_notification`, `sms_notification`, `account_type`, `PhoneNumber_Secondary`, `default_PhoneNumber`, `CreatedAt`) VALUES
(36, 'Ani', 'Marshall', NULL, '08161235924', 'test2@aspacelife.com', 'd22ebece6170e2a25db9515fd87ebd83', '22222222890', '02100', '14e1b600b1fd579f47433b88e8d85291', '1726bb1edef06f32af05dfe479210f32', 0, 0, 0, 'merchant', NULL, NULL, '2023-04-11 13:49:50'),
(50, '', 'null', NULL, '08034148857', 'test5@aspacelife.com', '1a89b41df434c0df51c500ab7cb837ea', NULL, NULL, '123466', NULL, NULL, 0, 0, 'merchant', NULL, NULL, '2023-04-11 13:41:05'),
(51, 'Abraham', 'Israel', NULL, '08137281916', 'israelvictory87@gmail.com', '798ad8c7fde41699c7da3b1568e5f33f', '76543456789', '2023-03-01', '123456', '3f835c0baa85a635aa5ef62b916b73c3', NULL, 0, 0, 'regular', NULL, NULL, '2023-03-19 14:45:04'),
(52, 'Nasir ', 'Lawal', NULL, '09115876162', 'nasirlawal003@gmail.com', '49bad1aca8fbb624444d7e3ffb7c621b', '53396084303', '2023-03-18', '123456', '68dd59be87789189ea80c40b68519136', NULL, 0, 0, 'regular', NULL, NULL, '2023-04-01 11:31:09'),
(53, 'WHITE GOLD TABLE WATER', 'null', NULL, '09036770533', 'ojongemmanuel95@gmail.com', '1a89b41df434c0df51c500ab7cb837ea', NULL, NULL, '123466', '3df0d88307e0e201c018bae9513d787b', NULL, 0, 0, 'merchant', NULL, NULL, '2023-03-18 20:53:42'),
(54, 'KOBAM ENERGY LIMITED', 'null', NULL, '08163036664', 'KOBAMENERGYLTD@GMAIL.COM', '9f7c19472430db0795370d9648442a5b', NULL, NULL, '123456', '8586f40c0b21897905feab995fbe4c36', NULL, 1, 1, 'merchant', NULL, NULL, '2023-03-19 17:37:22'),
(55, 'Chinwendu', 'Ndukwe', 'Ndukwe', '07053453191', 'testaccount@gmail.com', '49bad1aca8fbb624444d7e3ffb7c621b', '32283232322', '2023-03-20', '211311', 'cc78598508712fe4d35f61af7f8425fb', NULL, 0, 0, 'regular', NULL, NULL, '2023-03-20 11:07:39'),
(56, 'DEEP WATERS SOLICITORS', 'null', NULL, '08038931801', '', '49bad1aca8fbb624444d7e3ffb7c621b', NULL, NULL, '232323', 'e4e3339b0cbc7618afd4ea30e10da21a', NULL, 0, 0, 'merchant', NULL, NULL, '2023-03-20 11:40:29'),
(81, 'Jackal Solutions', 'null', NULL, '08102770103', 'jackalsolutions@gmail.com', '1f626e92c13eeaa0fedd7842543d8156', NULL, NULL, '14e1b600b1fd579f47433b88e8d85291', NULL, NULL, 0, 0, 'merchant', NULL, NULL, '2023-04-11 14:34:31'),
(82, 'Jackal Solutions', 'null', NULL, '08102770180', 'jackalsolutionss@gmail.com', '1f626e92c13eeaa0fedd7842543d8156', NULL, NULL, '14e1b600b1fd579f47433b88e8d85291', NULL, NULL, 0, 0, 'merchant', NULL, NULL, '2023-04-10 00:24:45'),
(86, 'Hoop Joup kols', NULL, NULL, '08161235924', 'marshalgfx@gmail.com', '4ff71d299cb21e767987bc29b9ef8d9b', NULL, NULL, '14e1b600b1fd579f47433b88e8d85291', NULL, NULL, 1, 1, 'merchant', NULL, '08161235924', '2023-04-10 21:56:53');

-- --------------------------------------------------------

--
-- Table structure for table `ussd`
--

CREATE TABLE `ussd` (
  `uId` int(11) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `accessToken` text,
  `uDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ussd`
--

INSERT INTO `ussd` (`uId`, `PhoneNumber`, `accessToken`, `uDate`) VALUES
(1, '08161235924', 'KzIzNDgxNjEyMzU5MjR8MjAyMy0wMy0yOVQxMDo0MzowMS4zOTda', '2023-03-28 18:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `voice_transactions`
--

CREATE TABLE `voice_transactions` (
  `voice_id` int(11) NOT NULL,
  `phone_number` varchar(30) NOT NULL,
  `amount` float NOT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wallets`
--

CREATE TABLE `wallets` (
  `wallet_id` int(11) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wallets`
--

INSERT INTO `wallets` (`wallet_id`, `phone_number`, `balance`, `created_at`) VALUES
(9, '08161235904', 29400, '2023-03-11 08:52:42'),
(14, '08161235924', 18800, '2023-04-11 14:39:36'),
(15, '08034148857', 47295, '2023-04-11 14:39:36'),
(16, '08161235974', 3200, '2023-03-14 13:58:49'),
(18, '08137281916', 99070, '2023-03-20 07:19:18'),
(19, '09115876162', 238620, '2023-03-31 16:46:16'),
(20, '08163036664', 90000, '2023-03-19 18:00:37'),
(21, '07053453191', 50, '2023-03-20 11:25:03'),
(22, '08102770103', 600, '2023-04-11 14:34:20');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `withdraw_id` int(11) NOT NULL,
  `account_number` varchar(30) NOT NULL,
  `amount` float NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `withdraw_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_rules`
--
ALTER TABLE `account_rules`
  ADD PRIMARY KEY (`aid`);

--
-- Indexes for table `airtime_purchase`
--
ALTER TABLE `airtime_purchase`
  ADD PRIMARY KEY (`aId`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `BaseAccount`
--
ALTER TABLE `BaseAccount`
  ADD PRIMARY KEY (`bId`);

--
-- Indexes for table `data_purchase`
--
ALTER TABLE `data_purchase`
  ADD PRIMARY KEY (`dId`);

--
-- Indexes for table `documents_upload`
--
ALTER TABLE `documents_upload`
  ADD PRIMARY KEY (`dId`);

--
-- Indexes for table `electricity_purchase`
--
ALTER TABLE `electricity_purchase`
  ADD PRIMARY KEY (`eId`);

--
-- Indexes for table `merchant_profile`
--
ALTER TABLE `merchant_profile`
  ADD PRIMARY KEY (`mId`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `split_payment`
--
ALTER TABLE `split_payment`
  ADD PRIMARY KEY (`sPid`);

--
-- Indexes for table `split_payment_paticipants`
--
ALTER TABLE `split_payment_paticipants`
  ADD PRIMARY KEY (`sPpid`);

--
-- Indexes for table `system_auth`
--
ALTER TABLE `system_auth`
  ADD PRIMARY KEY (`sId`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`tid`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `ussd`
--
ALTER TABLE `ussd`
  ADD PRIMARY KEY (`uId`);

--
-- Indexes for table `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`wallet_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_rules`
--
ALTER TABLE `account_rules`
  MODIFY `aid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `airtime_purchase`
--
ALTER TABLE `airtime_purchase`
  MODIFY `aId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `bank`
--
ALTER TABLE `bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `BaseAccount`
--
ALTER TABLE `BaseAccount`
  MODIFY `bId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `data_purchase`
--
ALTER TABLE `data_purchase`
  MODIFY `dId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `documents_upload`
--
ALTER TABLE `documents_upload`
  MODIFY `dId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `electricity_purchase`
--
ALTER TABLE `electricity_purchase`
  MODIFY `eId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `merchant_profile`
--
ALTER TABLE `merchant_profile`
  MODIFY `mId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `split_payment`
--
ALTER TABLE `split_payment`
  MODIFY `sPid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `split_payment_paticipants`
--
ALTER TABLE `split_payment_paticipants`
  MODIFY `sPpid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_auth`
--
ALTER TABLE `system_auth`
  MODIFY `sId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `tid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1265;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `ussd`
--
ALTER TABLE `ussd`
  MODIFY `uId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wallets`
--
ALTER TABLE `wallets`
  MODIFY `wallet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
