import { Jimp } from 'jimp';
import Quagga from '@ericblade/quagga2';

export const searchProduct = (req, res) => {
  res.redirect(`/product-info?productId=${req.query.productId}`);
};

export const getBarcodeFromImage = async (req, res) => {
  try {
    const image = await Jimp.read(req.file.buffer);
    const base64 = await new Promise((resolve, reject) => {
      image.getBase64('image/png', (err, src) => {
        if (err) reject(err);
        else resolve(src);
      });
    });

    const result = await new Promise((resolve, reject) => {
      Quagga.decodeSingle(
        {
          decoder: {
            readers: ["ean_reader", "ean_8_reader"]
          },
          locate: true,
          src: base64
        },
        (result) => {
          if (result && result.codeResult) {
            resolve(result.codeResult.code);
          } else {
            reject(new Error('Barcode not detected'));
          }
        }
      );
    });

    res.json({ barcode: result });

  } catch (err) {
    console.error('Barcode scan failed:', err);
    res.status(500).json({ error: err.message || 'Barcode scan failed' });
  }
};
