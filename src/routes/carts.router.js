import express from 'express';
import Cart from '../dao/models/carts.model.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  // Crea un nuevo carrito en MongoDB
  const newCart = await cartsService.createCart();
  res.status(201).json({ message: 'Nuevo carrito creado', cartId: newCart._id });
});

// Obtener un carrito específico por ID con sus productos
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('productos');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.render('cart', { cart }); // Renderizar la vista del carrito con sus productos
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  // Agrega un producto al carrito en MongoDB
  const result = await cartsService.addProductToCart(cartId, productId, quantity);
  if (result) {
    res.json({ message: `Producto ${productId} agregado al carrito ${cartId}` });
  } else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

export default router;
