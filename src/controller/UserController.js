const User = require("../model/UserModel"); // Import the Sequelize model
const logError = require("../util/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const TelegramBot = require("node-telegram-bot-api");
const nodemailer = require("nodemailer");

// 1. Config Telegram Bot
const TOKEN = "8243066577:AAH7fw9vaiH4An9X2XwxNxGQkWwGydVEfa0";
// const bot = new TelegramBot(TOKEN, { polling: true });

// 2. Config JWT Secret
const TOKEN_SECRET = "SJDHFKJSDFjshsdhKJ%(*%#74y35";

// 3. Config Nodemailer Transporter
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kspacelite1999@gmail.com",
    pass: "ttmk nhhs bybi mkri", // Ensure this is a 16-character App Password
  },
});

// 4. In-memory OTP store (Use Redis for production)
const otpStore = {};

// --- USER MANAGEMENT CONTROLLERS ---

// GET ALL USERS
const Get = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "username", "email", "status"],
    });
    res.json({
      message: "Get users successfully",
      total: users.length,
      list: users,
    });
  } catch (err) {
    logError("User", err, res);
  }
};

// GET USER BY ID
const GetOne = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findByPk(id, {
      attributes: ["user_id", "username", "email", "status"],
    });
    res.json({
      message: "Get user by ID successfully",
      user: userData || {},
    });
  } catch (err) {
    logError("User", err, res);
  }
};

// CREATE USER (REGISTER)
const Create = async (req, res) => {
  try {
    const { username, password, email, status } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        error: true,
        message: "Email, username and password are required",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPass,
      email,
      status: status || "active",
    });

    res.json({
      message: "Create user successfully",
      user_id: newUser.user_id,
      success: true,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: true,
        message: "Email already exists",
      });
    }
    logError("User", err, res);
  }
};

// LOGIN WITH EMAIL AND PASSWORD
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        isLogin: false,
      });
    }

    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res.status(401).json({
        message: "User not found",
        isLogin: false,
      });
    }

    const comparePassword = await bcrypt.compare(password, userData.password);

    if (comparePassword) {
      const token = jwt.sign(
        {
          user_id: userData.user_id,
          email: userData.email,
          username: userData.username,
        },
        TOKEN_SECRET,
        { expiresIn: "1h" },
      );

      res.json({
        message: "Login successful",
        token: token,
        isLogin: true,
        user: {
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          status: userData.status,
        },
      });
    } else {
      res.status(401).json({
        message: "Invalid password",
        isLogin: false,
      });
    }
  } catch (err) {
    logError("User", err, res);
  }
};

// UPDATE USER
const Update = async (req, res) => {
  try {
    const { user_id, username, password, email, status } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ error: true, message: "user_id is required" });
    }

    const updateData = { username, email, status };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updatedCount] = await User.update(updateData, {
      where: { user_id },
    });

    res.json({
      message: updatedCount > 0 ? "Update user successfully" : "User not found",
    });
  } catch (err) {
    logError("User", err, res);
  }
};

// DELETE USER
const Delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await User.destroy({
      where: { user_id: id },
    });

    res.json({
      message: deletedCount > 0 ? "Delete user successfully" : "User not found",
    });
  } catch (err) {
    logError("User", err, res);
  }
};

// --- FORGOT PASSWORD / OTP FLOW ---

// SEND OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    const mailOptions = {
      from: "kspacelite1999@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP for password reset is: ${otp}</h2><p>This code expires in 10 minutes.</p>`,
    };

    await mailer.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully", success: true });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP", success: false });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (
      !otpStore[email] ||
      otpStore[email].otp !== otp ||
      otpStore[email].expiresAt < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", success: false });
    }
    res.json({ message: "OTP verified successfully", success: true });
  } catch (err) {
    logError("User", err, res);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!otpStore[email] || otpStore[email].otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP session", success: false });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });
    delete otpStore[email];
    res.json({ message: "Password reset successfully", success: true });
  } catch (err) {
    logError("User", err, res);
  }
};

// --- EXTERNAL SERVICES ---

// SEND TELEGRAM MESSAGE
// const SendTelegramMessage = async (req, res) => {
//   try {
//     const { chat_id, image } = req.body;
//     bot.sendPhoto(chat_id, image, {
//       caption: "*The Company SHDD*\nProduct for sale",
//       parse_mode: "Markdown",
//     });
//     res.json({ message: "Message sent successfully" });
//   } catch (err) {
//     logError("Telegram", err, res);
//   }
// };

// SEND TEST EMAIL
const SendEmail = async (req, res) => {
  try {
    const mailOptions = {
      from: "kspacelite1999@gmail.com",
      to: "kspacelite1999@gmail.com",
      subject: "Test Email",
      text: "Hello from your application!",
    };
    await mailer.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    logError("Email", err, res);
  }
};

module.exports = {
  Get,
  GetOne,
  Create,
  Update,
  Delete,
  login,
  // SendTelegramMessage,
  SendEmail,
  sendOTP,
  resetPassword,
  verifyOtp,
};
