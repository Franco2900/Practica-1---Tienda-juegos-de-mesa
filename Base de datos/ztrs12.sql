-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-01-2025 a las 19:08:20
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ztrs12`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `texto`, `fecha_creacion`, `id_usuario`, `id_producto`) VALUES
(1, 'Excelentisimo, Maravilloso', '2025-01-11 21:52:30', 7, 4),
(2, 'Lo jugue y ahora soy mi propio jefe', '2025-01-13 14:17:40', 8, 3),
(3, 'Aburridisimo y las preguntas son super simples', '2025-01-13 14:21:21', 8, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `urlFotoProducto` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `cantidadJugadoresMinimo` int(11) NOT NULL,
  `cantidadJugadoresMaximo` int(11) NOT NULL,
  `duracionPartida` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `urlFotoProducto`, `precio`, `stock`, `descripcion`, `cantidadJugadoresMinimo`, `cantidadJugadoresMaximo`, `duracionPartida`, `id_usuario`) VALUES
(3, 'Monopoly', '\\images\\fotos de productos\\monopoly.jfif', 25000, 10, 'Juego clasico', 2, 6, 45, 5),
(4, 'Preguntados', '\\images\\fotos de productos\\preguntados.jpg', 1300, 4, 'Juegos de cartas con preguntas sobre distintos temas', 2, 2, 15, 5),
(7, 'Lamborghini', '\\images\\fotos de productos\\DOCpSJbLymLamborghini-Egoista-696x464.jpg', 1000000, 3, 'Cuchau', 1, 2, 50, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcomentario`
--

CREATE TABLE `subcomentario` (
  `id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_comentario_padre` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcomentario`
--

INSERT INTO `subcomentario` (`id`, `texto`, `fecha_creacion`, `id_comentario_padre`, `id_usuario`) VALUES
(1, 'Mirenlo al mentiroso. Seguro que es el vendedor del producto con una cuenta nueva ', '2025-01-13 17:54:54', 1, 8),
(2, 'Sin peleas en mi sitio web', '2025-01-13 18:49:37', 1, 5),
(3, 'Ahora toca dejar de ser pobre', '2025-01-13 18:54:20', 2, 5),
(10, 'Es un juego para niños ¿Qué esperabas?', '2025-01-13 19:05:39', 3, 5),
(12, 'Yo opino lo que quiero', '2025-01-14 00:14:13', 3, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contrasenia` varchar(50) NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'usuario',
  `urlFotoPerfil` varchar(255) DEFAULT '\\images\\fotos de perfil\\imagen-perfil-sin-foto.jpg',
  `dinero` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `email`, `contrasenia`, `rol`, `urlFotoPerfil`, `dinero`) VALUES
(5, 'asd', 'asd@gmail.com', 'asd', 'admin', '\\images\\fotos de perfil\\giphy.gif', 99999),
(7, 'fgh', 'fgh@hotmail.com', 'fgh', 'usuario', '\\images\\fotos de perfil\\eac8baf662529cd047fa3445c1a8849d.jpg', 0),
(8, 'zxc', 'zxc@gmail.com', 'zxc', 'usuario', '\\images\\fotos de perfil\\Lamborghini-Egoista-696x464.jpg', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion`
--

CREATE TABLE `valoracion` (
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `estrellas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valoracion`
--

INSERT INTO `valoracion` (`id_usuario`, `id_producto`, `estrellas`) VALUES
(5, 3, 5),
(7, 3, 2),
(7, 4, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `subcomentario`
--
ALTER TABLE `subcomentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_comentario_padre` (`id_comentario_padre`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id_usuario`,`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `subcomentario`
--
ALTER TABLE `subcomentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `subcomentario`
--
ALTER TABLE `subcomentario`
  ADD CONSTRAINT `subcomentario_ibfk_1` FOREIGN KEY (`id_comentario_padre`) REFERENCES `comentario` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `subcomentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD CONSTRAINT `valoracion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `valoracion_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
