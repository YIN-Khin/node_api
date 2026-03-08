// const Setting = require("../model/SettingModel");
// const logError = require("../util/service");

// // GET all settings
// const getAllSettings = async (req, res) => {
//   try {
//     const settings = await Setting.findAll();
//     res.status(200).json({
//       success: true,
//       message: "Settings retrieved successfully",
//       data: settings,
//     });
//   } catch (error) {
//     logError("SettingController", error, res);
//   }
// };

// // GET setting by code
// const getSettingByCode = async (req, res) => {
//   try {
//     const { code } = req.params;
//     const setting = await Setting.findByPk(code);
    
//     if (!setting) {
//       return res.status(404).json({
//         success: false,
//         message: "Setting not found",
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: setting,
//     });
//   } catch (error) {
//     logError("SettingController", error, res);
//   }
// };

// // POST create setting
// const createSetting = async (req, res) => {
//   try {
//     const { setting_code, setting_type, dec, status } = req.body;
    
//     const setting = await Setting.create({
//       setting_code,
//       setting_type,
//       dec,
//       status,
//     });
    
//     res.status(201).json({
//       success: true,
//       message: "Setting created successfully",
//       data: setting,
//     });
//   } catch (error) {
//     logError("SettingController", error, res);
//   }
// };

// // PUT update setting
// const updateSetting = async (req, res) => {
//   try {
//     const { code } = req.params;
//     const { setting_type, dec, status } = req.body;
    
//     const setting = await Setting.findByPk(code);
    
//     if (!setting) {
//       return res.status(404).json({
//         success: false,
//         message: "Setting not found",
//       });
//     }
    
//     await setting.update({
//       setting_type,
//       dec,
//       status,
//     });
    
//     res.status(200).json({
//       success: true,
//       message: "Setting updated successfully",
//       data: setting,
//     });
//   } catch (error) {
//     logError("SettingController", error, res);
//   }
// };

// // DELETE setting
// const deleteSetting = async (req, res) => {
//   try {
//     const { code } = req.params;
//     const setting = await Setting.findByPk(code);
    
//     if (!setting) {
//       return res.status(404).json({
//         success: false,
//         message: "Setting not found",
//       });
//     }
    
//     await setting.destroy();
    
//     res.status(200).json({
//       success: true,
//       message: "Setting deleted successfully",
//     });
//   } catch (error) {
//     logError("SettingController", error, res);
//   }
// };

// module.exports = {
//   getAllSettings,
//   getSettingByCode,
//   createSetting,
//   updateSetting,
//   deleteSetting,
// };


const Setting = require("../model/SettingModel");
const logError = require("../util/service");
const { Op } = require("sequelize");

// GET all settings
const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      order: [["setting_code", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    logError("SettingController.getAllSettings", error, res);
  }
};

// GET setting by code
const getSettingByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const setting = await Setting.findByPk(code);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Setting retrieved successfully",
      data: setting,
    });
  } catch (error) {
    logError("SettingController.getSettingByCode", error, res);
  }
};

// POST create setting
const createSetting = async (req, res) => {
  try {
    const { setting_code, setting_type, dec, status = 1 } = req.body;

    if (!setting_code || !setting_type) {
      return res.status(400).json({
        success: false,
        message: "setting_code and setting_type are required",
      });
    }

    const existing = await Setting.findByPk(setting_code);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Setting code already exists",
      });
    }

    const setting = await Setting.create({
      setting_code,
      setting_type,
      dec,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Setting created successfully",
      data: setting,
    });
  } catch (error) {
    logError("SettingController.createSetting", error, res);
  }
};

// PUT update setting
const updateSetting = async (req, res) => {
  try {
    const { code } = req.params;
    const { setting_type, dec, status } = req.body;

    const setting = await Setting.findByPk(code);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    await setting.update({
      setting_type:
        setting_type !== undefined ? setting_type : setting.setting_type,
      dec: dec !== undefined ? dec : setting.dec,
      status: status !== undefined ? status : setting.status,
    });

    return res.status(200).json({
      success: true,
      message: "Setting updated successfully",
      data: setting,
    });
  } catch (error) {
    logError("SettingController.updateSetting", error, res);
  }
};

// DELETE setting
const deleteSetting = async (req, res) => {
  try {
    const { code } = req.params;

    const setting = await Setting.findByPk(code);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    await setting.destroy();

    return res.status(200).json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    logError("SettingController.deleteSetting", error, res);
  }
};

// SAVE / UPDATE stock clock settings
const saveStockClockSetting = async (req, res) => {
  try {
    const {
      stock_open_time,
      stock_close_time,
      stock_status = "OPEN",
      low_stock_threshold = "5",
    } = req.body;

    if (!stock_open_time || !stock_close_time) {
      return res.status(400).json({
        success: false,
        message: "stock_open_time and stock_close_time are required",
      });
    }

    const settingRows = [
      {
        setting_code: "STOCK_OPEN",
        setting_type: stock_open_time,
        dec: "Stock opening time",
        status: 1,
      },
      {
        setting_code: "STOCK_CLOSE",
        setting_type: stock_close_time,
        dec: "Stock closing time",
        status: 1,
      },
      {
        setting_code: "STOCK_STATUS",
        setting_type: stock_status,
        dec: "Stock status OPEN/CLOSE",
        status: 1,
      },
      {
        setting_code: "LOW_STOCK_THRESHOLD",
        setting_type: String(low_stock_threshold),
        dec: "Low stock threshold",
        status: 1,
      },
    ];

    for (const item of settingRows) {
      const existing = await Setting.findByPk(item.setting_code);

      if (existing) {
        await existing.update({
          setting_type: item.setting_type,
          dec: item.dec,
          status: item.status,
        });
      } else {
        await Setting.create(item);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Stock settings saved successfully",
      data: {
        stock_open_time,
        stock_close_time,
        stock_status,
        low_stock_threshold,
      },
    });
  } catch (error) {
    logError("SettingController.saveStockClockSetting", error, res);
  }
};

// GET stock settings
const getStockClockSetting = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      where: {
        setting_code: {
          [Op.in]: [
            "STOCK_OPEN",
            "STOCK_CLOSE",
            "STOCK_STATUS",
            "LOW_STOCK_THRESHOLD",
          ],
        },
      },
      order: [["setting_code", "ASC"]],
    });

    const result = {
      stock_open_time: null,
      stock_close_time: null,
      stock_status: null,
      low_stock_threshold: null,
    };

    settings.forEach((item) => {
      if (item.setting_code === "STOCK_OPEN") {
        result.stock_open_time = item.setting_type;
      }
      if (item.setting_code === "STOCK_CLOSE") {
        result.stock_close_time = item.setting_type;
      }
      if (item.setting_code === "STOCK_STATUS") {
        result.stock_status = item.setting_type;
      }
      if (item.setting_code === "LOW_STOCK_THRESHOLD") {
        result.low_stock_threshold = item.setting_type;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Stock settings retrieved successfully",
      data: result,
    });
  } catch (error) {
    logError("SettingController.getStockClockSetting", error, res);
  }
};

// CHECK stock open status
const checkStockOpenStatus = async (req, res) => {
  try {
    const openSetting = await Setting.findByPk("STOCK_OPEN");
    const closeSetting = await Setting.findByPk("STOCK_CLOSE");
    const statusSetting = await Setting.findByPk("STOCK_STATUS");

    if (!openSetting || !closeSetting) {
      return res.status(400).json({
        success: false,
        message: "Stock open/close settings not found",
      });
    }

    const stockStatus = statusSetting?.setting_type || "OPEN";
    const currentTime = new Date().toTimeString().slice(0, 5);

    let isOpen = false;

    if (stockStatus === "OPEN") {
      isOpen =
        currentTime >= openSetting.setting_type &&
        currentTime <= closeSetting.setting_type;
    }

    return res.status(200).json({
      success: true,
      message: isOpen ? "Stock is open" : "Stock is closed",
      data: {
        is_open: isOpen,
        stock_status: stockStatus,
        current_time: currentTime,
        stock_open_time: openSetting.setting_type,
        stock_close_time: closeSetting.setting_type,
      },
    });
  } catch (error) {
    logError("SettingController.checkStockOpenStatus", error, res);
  }
};

// MANUAL open/close stock only
const updateStockStatus = async (req, res) => {
  try {
    const { stock_status } = req.body;

    if (!stock_status || !["OPEN", "CLOSE"].includes(stock_status)) {
      return res.status(400).json({
        success: false,
        message: "stock_status must be OPEN or CLOSE",
      });
    }

    const existing = await Setting.findByPk("STOCK_STATUS");

    if (existing) {
      await existing.update({
        setting_type: stock_status,
        dec: "Stock status OPEN/CLOSE",
        status: 1,
      });
    } else {
      await Setting.create({
        setting_code: "STOCK_STATUS",
        setting_type: stock_status,
        dec: "Stock status OPEN/CLOSE",
        status: 1,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Stock status updated to ${stock_status}`,
    });
  } catch (error) {
    logError("SettingController.updateStockStatus", error, res);
  }
};

module.exports = {
  getAllSettings,
  getSettingByCode,
  createSetting,
  updateSetting,
  deleteSetting,
  saveStockClockSetting,
  getStockClockSetting,
  checkStockOpenStatus,
  updateStockStatus,
};