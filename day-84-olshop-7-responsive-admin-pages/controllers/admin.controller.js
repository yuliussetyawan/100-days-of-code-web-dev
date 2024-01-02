function getProducts(req, res) {
  res.render('admin/product/all-products')
}

function getNewProduct(req, res) {
  res.render('admin/product/new-product')
}

function createNewProduct() {}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
};
