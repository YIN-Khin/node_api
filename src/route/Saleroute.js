const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} = require("../controller/Salecontroller");

// GET    /api/sales          → paginated list with search/date filters
// GET    /api/sales/:id      → single sale with items
// POST   /api/sales          → create sale + items (transaction)
// PUT    /api/sales/:id      → update sale + replace items
// DELETE /api/sales/:id      → delete sale + cascade items

const Sales = (app) => {
  app.get("/api/sales", getAllSales);
  app.get("/api/sales/:id", getSaleById);
  app.post("/api/sales", createSale);
  app.put("/api/sales/:id", updateSale);
  app.delete("/api/sales/:id", deleteSale);
};

module.exports = Sales;