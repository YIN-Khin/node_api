const {
  getGeneralSettings,
  createGeneralSettings,
  updateGeneralSettings,
  scanAllProductsForAlerts,
} = require("../controller/GeneralSettingController");

const GeneralSettingsRoutes = (app) => {
  // IMPORTANT: Specific routes must come BEFORE parameterized routes
  app.post("/api/general-settings/scan-alerts", scanAllProductsForAlerts);
  app.get("/api/general-settings", getGeneralSettings);
  app.post("/api/general-settings", createGeneralSettings);
  app.put("/api/general-settings/:id", updateGeneralSettings);
};

module.exports = GeneralSettingsRoutes;
