-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-03-2026 a las 20:03:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `boutiquecdo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` int(11) NOT NULL,
  `pedido_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 25000.00),
(2, 1, 2, 1, 18000.00),
(3, 2, 3, 1, 12000.00),
(4, 2, 4, 1, 2500.00),
(5, 3, 2, 1, 18000.00),
(6, 3, 3, 1, 12000.00),
(7, 4, 4, 1, 2500.00),
(8, 5, 1, 1, 25000.00),
(9, 5, 4, 1, 2500.00),
(10, 6, 2, 1, 18000.00),
(11, 6, 3, 1, 12000.00),
(12, 7, 2, 1, 18000.00),
(13, 7, 3, 1, 12000.00),
(14, 8, 4, 1, 2500.00),
(15, 8, 3, 1, 12000.00),
(16, 9, 3, 1, 12000.00),
(17, 10, 2, 1, 18000.00),
(18, 10, 3, 1, 12000.00),
(19, 11, 4, 1, 2500.00),
(20, 11, 2, 1, 18000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `estado` varchar(20) DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `total`, `fecha`, `estado`) VALUES
(1, 2, 43000.00, '2026-02-28 18:14:48', 'Pendiente'),
(2, 2, 14500.00, '2026-02-28 18:53:27', 'Pendiente'),
(3, 2, 30000.00, '2026-02-28 19:05:33', 'Pendiente'),
(4, 2, 2500.00, '2026-02-28 19:08:22', 'Pendiente'),
(5, 2, 27500.00, '2026-02-28 19:21:50', 'Pendiente'),
(6, 2, 30000.00, '2026-03-01 12:40:01', 'Pendiente'),
(7, 2, 30000.00, '2026-03-01 12:40:08', 'Pendiente'),
(8, 2, 14500.00, '2026-03-01 12:43:53', 'Pendiente'),
(9, 3, 12000.00, '2026-03-01 13:10:07', 'Pendiente'),
(10, 4, 30000.00, '2026-03-01 15:28:13', 'Pendiente'),
(11, 4, 20500.00, '2026-03-01 15:47:00', 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `imagen` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `categoria`, `precio`, `stock`, `imagen`) VALUES
(1, 'Aceite CBD 10%', 'Frasco de 10ml, extracción natural full spectrum.', 'Aceites', 25000.00, 48, 'img/aceite.png'),
(2, 'Semillas Amnesia', 'Pack de 3 semillas feminizadas de alta producción.', 'Semillas', 18000.00, 94, 'img/semillas.png'),
(3, 'Pipa de Cristal', 'Pipa artesanal de 10cm, fácil de limpiar.', 'Accesorios', 12000.00, 13, 'img/pipa.png'),
(4, 'Papel Raw King Size', 'Librillo de 32 hojas de papel sin blanquear.', 'Accesorios', 2500.00, 195, 'img/papel.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `rol` varchar(20) DEFAULT 'cliente',
  `nombre_completo` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password`, `rol`, `nombre_completo`, `dni`, `direccion`, `telefono`) VALUES
(1, 'admin', 'admin123', 'admin', NULL, NULL, NULL, NULL),
(2, 'silvia@test.com', '123456', 'cliente', 'Silvia Ambros', '63736367', 'calle falsa 123', '1156543422'),
(3, 'test@test.com', '123456', 'cliente', 'cliente falso', '34567890', 'calle falsa 345', '11432566443'),
(4, 'prueba', '123456', 'socio', 'prueba@test.com', '45678234', 'calle falsa 567', '112344432');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_id` (`pedido_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  ADD CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
