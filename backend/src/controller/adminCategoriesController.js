const db = require("../config/db");
const path = require("path");
const fs = require("fs");

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM categories ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : null;

  if (!name) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const [existing] = await db.execute("SELECT id FROM categories WHERE name = ?", [name]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Category name already exists." });
    }

    const [result] = await db.execute(
      "INSERT INTO categories (name, catimage_url) VALUES (?, ?)",
      [name, imagePath]
    );

    res.status(201).json({ id: result.insertId, name, catimage_url: imagePath });
  } catch (err) {
    res.status(500).json({ message: "Failed to create category." });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    const old = rows[0];
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : old.catimage_url;

    if (req.file && old.catimage_url) {
      const oldPath = path.join(__dirname, "..", old.catimage_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const [existing] = await db.execute("SELECT id FROM categories WHERE name = ? AND id != ?", [name, id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Another category with this name already exists." });
    }

    await db.execute(
      "UPDATE categories SET name = ?, catimage_url = ? WHERE id = ?",
      [name || old.name, imagePath, id]
    );

    res.json({ id, name: name || old.name, catimage_url: imagePath });
  } catch (err) {
    res.status(500).json({ message: "Failed to update category." });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    const imagePath = rows[0].catimage_url;
    if (imagePath) {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await db.execute("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category." });
  }
};
