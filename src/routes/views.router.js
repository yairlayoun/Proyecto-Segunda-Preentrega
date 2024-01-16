import express from 'express';
import path from 'path'; 
 import { products } from '../app.js';
 import * as viewController from '../dao/fileSystem/controllers/viewController.js'
 import { isAuthenticated, isAdmin } from './authMiddleware.js';
const router = express.Router();

router.get('/home', (req, res) => {
  // Obtener la lista de productos (simulada para este ejemplo)
  const products = [
    { name: 'Producto 1', price: 10 },
    { name: 'Producto 2', price: 20 },
    { name: 'Producto 3', price: 30 },
    { name: 'Producto 4', price: 40 },
    { name: 'Producto 5', price: 50 },
  ];

  res.render('home', { products });
});

router.get('/', (req, res) => {
});

router.get('/api/realtimeproducts', isAuthenticated, (req, res) => {
  res.render('realTimeProducts');
    // Obtén los datos del usuario desde la sesión
    const user = req.session.user;

    // Renderiza la vista de productos y pasa los datos del usuario
    res.render('products', { user });
  });

router.get('/api/chat', (req, res) => {
  res.render('chat'); // Renderizar la vista chat.handlebars
});

// Ruta para acceder al panel de administración (requiere rol de administrador)
router.get('/profile', isAuthenticated, viewController.profileView, (req, res) => {
  // Lógica para manejar la ruta /profile
  if (req.session.userId) {
    res.render('profile');
  } else {
    res.redirect('/login');
  }
});
// Formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
  res.redirect('/realtimeproducts');
});

// Página de perfil (requiere autenticación)
router.get('/profile', isAuthenticated, viewController.profileView, (req, res) => {
  // Verifica si el usuario está autenticado
  if (req.session.userId) {
    res.render('profile');
  } else {
    res.redirect('/login');
  }
});


export default router;