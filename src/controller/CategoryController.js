const Category = require("../model/CategoryModel");

// const db = require("../config/db");
const getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();

    res.status(200).json({
      success: true,
      message: "success get category",
      category,
    });
  } catch (e) {
    res.status(500).json({
      message: "not fount category",
      error: e.message,
    });
  }
};


// SEARCH categories by code or description
const search = async (req, res) => {
    try {
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: 'Search keyword is required'
            });
        }

        const { Op } = require('sequelize');
        const data = await Category.findAll({
            where: {
                [Op.or]: [
                    { code: { [Op.like]: `%${keyword}%` } },
                    { desc: { [Op.like]: `%${keyword}%` } },
                    { remark: { [Op.like]: `%${keyword}%` } }
                ]
            }
        });

        res.json({
            success: true,
            data: data,
            count: data.length
        });
    }
    catch (error) {
        logError("CategoryController - search", error, res);
    }
}


//by id category
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (category) {
      res.status(200).json({
        success: true,
        message: "success get category by id",
        category,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "category not found",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error fetching category by ID",
      error: e.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json({
      success: true,
      message: "create category succuss",
      category,
    });
  } catch (e) {
    res.status(500).json({
      message: "is not create category",
      error: e.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { desc, remark } = req.body;
    const categoryUpdate = await Category.findByPk(id);
    await categoryUpdate.update({
      desc,
      remark,
    });
    res.status(200).json({
       success: true,
      message: "Update category success",
      categoryUpdate,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error updating product",
      error: e.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    await category.destroy();
    res.status(200).json({
       success: true,
      message: "Deleted successfully",
      category,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Error deleting brand",
      error: e.message,
    });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  search,
};
