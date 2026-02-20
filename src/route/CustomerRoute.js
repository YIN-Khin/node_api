// var { get, createCustomer } = require("../controller/CustomerController");
// const Customers = (app) => {
//   app.get("/api/customers", get);
//   app.post("/api/customers", createCustomer);
// };

// module.exports = Customers;
const upload = require("../middleware/upload");
var {
  get,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controller/CustomerController");

const Customers = (app) => {
  app.get("/api/customers", get);
  app.post("/api/customers",upload.single("photo") , createCustomer);
  app.put("/api/customers/:id", updateCustomer);
  app.delete("/api/customers/:id", deleteCustomer);
};

module.exports = Customers;
