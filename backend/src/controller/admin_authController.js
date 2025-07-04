const db = require("../config/db");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/mailer");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  if (!emailOrMobile || !password) {
    return res
      .status(400)
      .json({ message: "Email/mobile and password required" });
  }

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    const user = users[0];

    if (!user.is_admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user);

    res.json({
      message: "Admin login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const sendOtp = async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );

    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (!user.is_admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await db.execute(
      "INSERT INTO otp_verifications (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
      [user.id, otp, expiresAt]
    );

    if (emailOrMobile.includes("@")) {
      await sendOtpEmail(emailOrMobile, otp);
    } else {
      console.log(`Mock SMS to ${emailOrMobile}: ${otp}`);
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    const [users] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR mobile = ?",
      [emailOrMobile, emailOrMobile]
    );
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    if (!user.is_admin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    const [otps] = await db.execute(
      "SELECT * FROM otp_verifications WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1",
      [user.id]
    );

    if (otps.length === 0)
      return res.status(404).json({ message: "No OTP found" });

    const latestOtp = otps[0];

    if (latestOtp.verified)
      return res.status(400).json({ message: "OTP already used" });

    if (new Date() > new Date(latestOtp.expires_at)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (latestOtp.otp_code !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await db.execute(
      "UPDATE otp_verifications SET verified = true WHERE id = ?",
      [latestOtp.id]
    );

    const token = generateToken(user);
    res.json({
      message: "OTP verified",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

const resetPassword = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "UPDATE users SET password_hash = ? WHERE email = ? OR mobile = ?",
      [hashedPassword, emailOrMobile, emailOrMobile]
    );
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.execute("SELECT COUNT(*) AS totalUsers FROM users WHERE is_admin = 0");
    const [[{ totalItems }]] = await db.execute("SELECT COUNT(*) AS totalItems FROM food_items");
    const [[{ totalCategories }]] = await db.execute("SELECT COUNT(*) AS totalCategories FROM categories");
    const [[{ totalOrders }]] = await db.execute("SELECT COUNT(*) AS totalOrders FROM order_status");
    const [[{ totalRevenue }]] = await db.execute("SELECT SUM(subtotal + taxes + delivery_charge - discount) AS totalRevenue FROM order_status");

    const [orderStatuses] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM order_status 
      GROUP BY status
    `);

    const [recentOrders] = await db.execute(`
      SELECT os.id, u.name as user_name, os.subtotal, os.status, os.created_at 
      FROM order_status os
      JOIN users u ON os.user_id = u.id
      ORDER BY os.created_at DESC 
      LIMIT 10
    `);

    res.json({
      totalUsers,
      totalItems,
      totalCategories,
      totalOrders,
      totalRevenue: totalRevenue || 0,
      ordersByStatus: Object.fromEntries(orderStatuses.map(o => [o.status, o.count])),
      recentOrders
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};




module.exports = {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
getDashboardStats,
};
