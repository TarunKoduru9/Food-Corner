const db = require("../config/db");

exports.getUsersCount = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM users WHERE is_admin = FALSE");
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users count" });
  }
};

exports.getOrdersCount = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM order_status");
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders count" });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT SUM(subtotal + taxes + delivery_charge - discount) as total FROM order_status WHERE status = 'delivered'");
    res.json({ total: rows[0].total || 0 });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch total revenue" });
  }
};

exports.getCategoriesCount = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM categories");
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories count" });
  }
};

exports.getItemsCount = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM food_items");
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items count" });
  }
};
