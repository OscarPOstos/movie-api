const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));