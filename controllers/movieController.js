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
    res.status(500).json({ msg: error });
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

// controllers/movieController.js - Endpoint de recomendaciones
exports.getRecommendations = async (req, res) => {
  try {
    let endpoint = "/discover/movie"; // Base de consulta en TMDb
    let params = { api_key: API_KEY, language: "es-ES" };

    // Filtrar por género
    if (req.query.genre) {
      const genreResponse = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, { params });
      const genres = genreResponse.data.genres;
      const genre = genres.find((g) => g.name.toLowerCase() === req.query.genre.toLowerCase());
      if (!genre) return res.status(400).json({ msg: "Género no encontrado" });
      params.with_genres = genre.id;
    }

    // Filtrar por año de lanzamiento
    if (req.query.year) {
      params.primary_release_year = req.query.year;
    }

    // Obtener películas en tendencia
    if (req.query.trending === "true") {
      endpoint = "/trending/movie/week"; // Cambiar la consulta si es trending
    }

    // Hacer la solicitud a TMDb
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
