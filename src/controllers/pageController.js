import axios from 'axios';

export const productInfo = async (req, res) => {
  const barcode = req.query.productId;

  if (!barcode) {
    return res.status(400).send('Missing productId in query.');
  }

  try {
    const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}`);

    if (data.status === 0) {
      return res.status(404).send('Product not found.');
    }

    res.render('product_info', {
      product: data.product,
    });
  } catch (err) {
    console.error('Axios error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
