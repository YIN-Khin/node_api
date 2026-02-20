var {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  search,
} = require("../controller/CategoryController");

const Categories = (app) => {
  app.get("/api/categories", getAllCategory);
  app.get("/api/categories/search", search);
  app.get("/api/categories/:id", getCategoryById);
  app.post("/api/categories", createCategory);
  app.put("/api/categories/:id", updateCategory);
  app.delete("/api/categories/:id", deleteCategory);
};

module.exports = Categories;
