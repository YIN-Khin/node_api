const GeneralSetting = require("../model/GeneralSettingModel");
const Products = require("../model/ProductModel");
const { checkMultipleProductsStock } = require("../utils/stockAlert");
const logError = require("../util/service");

// GET general settings (usually only one record)
const getGeneralSettings = async (req, res) => {
  try {
    const settings = await GeneralSetting.findOne();
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "General settings not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logError("GeneralSettingController", error, res);
  }
};

// POST create general settings
const createGeneralSettings = async (req, res) => {
  try {
    const { stock_alert, qty_alert, remark, is_alert } = req.body;
    
    // Check if settings already exist
    const existing = await GeneralSetting.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "General settings already exist. Use update instead.",
      });
    }
    
    const settings = await GeneralSetting.create({
      stock_alert,
      qty_alert,
      remark,
      is_alert,
    });
    
    res.status(201).json({
      success: true,
      message: "General settings created successfully",
      data: settings,
    });
  } catch (error) {
    logError("GeneralSettingController", error, res);
  }
};

// PUT update general settings
const updateGeneralSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_alert, qty_alert, remark, is_alert } = req.body;
    
    const settings = await GeneralSetting.findByPk(id);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "General settings not found",
      });
    }
    
    await settings.update({
      stock_alert,
      qty_alert,
      remark,
      is_alert,
    });
    
    res.status(200).json({
      success: true,
      message: "General settings updated successfully",
      data: settings,
    });
  } catch (error) {
    logError("GeneralSettingController", error, res);
  }
};

// POST scan all products and send alerts for low/out of stock items
const scanAllProductsForAlerts = async (req, res) => {
  try {
    console.log('\n🔍 SCAN ALL PRODUCTS - Starting...');
    
    const products = await Products.findAll();
    
    if (!products || products.length === 0) {
      console.log('❌ No products found in database');
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    
    console.log(`✅ Found ${products.length} products to scan`);
    console.log('='.repeat(70));
    
    // Check all products and send alerts (non-blocking)
    checkMultipleProductsStock(products).catch((err) =>
      console.error("Scan products alert error:", err.message)
    );
    
    res.status(200).json({
      success: true,
      message: `Scanning ${products.length} products for stock alerts...`,
      data: {
        totalProducts: products.length,
        message: "Alerts will be sent to Telegram for low/out of stock products"
      }
    });
  } catch (error) {
    console.error('❌ Scan error:', error);
    logError("GeneralSettingController", error, res);
  }
};

module.exports = {
  getGeneralSettings,
  createGeneralSettings,
  updateGeneralSettings,
  scanAllProductsForAlerts,
};
