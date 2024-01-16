import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, unique: true, required: true },
  edad: { type: Number, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'usuario'], default: 'user' },
});

const User = model('User', UserSchema);

export default User;
