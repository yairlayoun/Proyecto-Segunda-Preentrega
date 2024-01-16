import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
  // Lógica para registrar un usuario en la base de datos
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      req.session.user = { id: user._id, email: user.email, first_name: user.first_name }; 
      res.json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', message: error.message });
  }
};