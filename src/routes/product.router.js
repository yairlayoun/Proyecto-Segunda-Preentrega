import express from 'express';
import Product from '../dao/models/product.model.js';
import Cart from '../dao/models/carts.model.js'; // Asumiendo que existe un modelo de carrito

const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit)
  };

  try {
    let products;

    const sortOptions = {};
    if (sort) {
      sortOptions.precio = sort === 'asc' ? 1 : -1;
    }

    if (query) {
      const filter = query === 'disponibles' ? { esVisible: true } : { categoria: { $regex: query, $options: 'i' } };
      products = await Product.find(filter, null, options).sort(sortOptions).populate('categoria');
    } else {
      products = await Product.find({ esVisible: true }, null, options).sort(sortOptions).populate('categoria');
    }

    const totalPages = Math.ceil(await Product.countDocuments({ esVisible: true }) / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage !== null ? `/?limit=${limit}&page=${prevPage}` : null,
      nextLink: nextPage !== null ? `/?limit=${limit}&page=${nextPage}` : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const nuevoProducto = await product.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-to-cart/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const cart = await Cart.findOne({ userId: req.headers['x-user-id'] });

    if (!cart) {
      const newCart = new Cart({
        userId: req.headers['x-user-id'],
        products: [{
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1,
        }],
      });
      await newCart.save();
    } else {
      cart.products.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
      });
      await cart.save();
    }

    res.redirect('/products');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
