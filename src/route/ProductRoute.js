var { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controller/ProductController");

const Products = (app) => {
  app.get("/api/products", getAllProducts);
  app.get("/api/products/:id",getProductById);
  app.post("/api/products",createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);
};

module.exports = Products;
