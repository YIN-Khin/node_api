const Brand = require("../model/BrandModel");
const Categories = require("../model/CategoryModel");

// const db = require("../config/db");
const getAllBrand = async (req, res) => {
  try {
    const brand = await Brand.findAll({
      include: [
        {
          model: Categories,
          as: "category",
          required: false,
        },
      ],
    });

    res.status(200).json({
      message: "success get brands",
      brand,
    });
  } catch (e) {
    res.status(500).json({
      message: "not fount brands",
      error: e.message,
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body, {
      include: [
        {
          model: Categories,
          as: "category",
          required: false,
        },
      ],
    });
    return res.status(201).json({
      message: "Create brands success",
      brand,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating brand", error });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { desc, category_id, remark, photo } = req.body;
    const brand = await Brand.findByPk(id);

    await brand.update({ desc, category_id, remark, photo });

    res.status(200).json({
      message: "Updated success",
      brand,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error updating brand",
      error: e.message,
    });
  }
};
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    await brand.destroy();
    res.status(200).json({
      message: "Deleted successfully",
      brand,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error deleting brand",
      error: e.message,
    });
  }
};
module.exports = {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
