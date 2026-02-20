var {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controller/BrandController");

const Brands = (app) => {
  app.get("/api/brands", getAllBrand);
  app.post("/api/brands", createBrand);
  app.put("/api/brands/:id", updateBrand);
  app.delete("/api/brands/:id", deleteBrand);
};

module.exports = Brands;
