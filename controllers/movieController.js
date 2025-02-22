const axios = require("axios");
require("dotenv").config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// Función auxiliar para hacer peticiones a TMDb
const fetchMovies = async (endpoint, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: { api_key: API_KEY, language: "es-ES" },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: "Error obteniendo datos de TMDb" });
  }
};

// Obtener películas populares
exports.getPopularMovies = (req, res) => {
  fetchMovies("/movie/popular", res);
};

// Obtener películas mejor calificadas
exports.getTopRatedMovies = (req, res) => {
  fetchMovies("/movie/top_rated", res);
};

// Obtener próximas películas
exports.getUpcomingMovies = (req, res) => {
  fetchMovies("/movie/upcoming", res);
};

// Buscar películas por nombre
exports.searchMovies = (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ msg: "Se requiere un parámetro de búsqueda" });
  fetchMovies(`/search/movie?query=${query}`, res);
};

// Obtener detalles de una película específica
exports.getMovieById = (req, res) => {
  const movieId = req.params.id;
  fetchMovies(`/movie/${movieId}`, res);
};