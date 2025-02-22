// routes/movies.js - Rutas de películas protegidas con autenticación
const express = require("express");
const router = express.Router();
const {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieById,
} = require("../controllers/movieController");

const { authMiddleware } = require("../controllers/authController"); // Importar middleware de autenticación

// Proteger todas las rutas de películas con authMiddleware
router.get("/popular", authMiddleware, getPopularMovies);
router.get("/top-rated", authMiddleware, getTopRatedMovies);
router.get("/upcoming", authMiddleware, getUpcomingMovies);
router.get("/search", authMiddleware, searchMovies);
router.get("/:id", authMiddleware, getMovieById);

module.exports = router;
