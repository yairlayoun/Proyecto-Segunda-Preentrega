// authController.js
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos por correo electrónico
    const user = await User.findOne({ email: email });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    // Almacenar detalles del usuario en la sesión
    req.session.user = {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role, 'usuario'
      // Otros campos que desees incluir en la sesión
    }

    // Redirigir al usuario después del login
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }

  export const logout = (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al cerrar la sesión' });
      }
  
      // Redirigir a la vista de login después del logout
      res.redirect('/');
    });
  }}