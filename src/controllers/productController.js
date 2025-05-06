//search the product with the id
export const searchProduct = (req, res) => {
    res.redirect(`/product-info?productId=${req.query.productId}`) 
};