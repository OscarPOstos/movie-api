const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "El usuario ya existe" });

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ msg: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Credenciales incorrectas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Credenciales incorrectas" });

    // Incluir más datos en el payload del token
    const payload = { id: user.id, name: user.name, email: user.email };

    // Generar el token correctamente
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


// Obtener usuario autenticado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Middleware para verificar token
exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  // Asegurar que el token no está vacío
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  try {
    // Extraer solo el token sin la palabra "Bearer "
    const tokenString = token.split(" ")[1];

    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error al verificar token:", error);
    res.status(401).json({ msg: "Token inválido" });
  }
};