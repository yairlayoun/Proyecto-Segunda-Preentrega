// auth.router.js
import express from 'express';
import * as authController from '../dao/fileSystem/controllers/authController.js';

const router = express.Router();

// Ruta de login
router.post('/login', authController.login);
router.post('/logout', authController.logout);
// Resto de las rutas

export default router;
