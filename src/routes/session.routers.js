// routes/session.routes.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js'
import * as sessionsController from '../dao/fileSystem/controllers/sessionsController.js'

const router = express.Router();

// Registro de usuario
router.post('/register',  sessionsController.registerUser, async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario', message: error.message });
  }
});

// Inicio de sesión
router.post('/login', sessionsController.loginUser, async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }


  res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

export default router;
