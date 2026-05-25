const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, income_source, profession, monthly_income } =
      req.body;

    // Validasi field wajib
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Nama, email, password wajib diisi." });

    // Validasi format email
    const emailRegex =
      /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|student)[.\w]*\.[a-z]{2,}$/i;
    if (!emailRegex.test(email))
      return res
        .status(400)
        .json({
          message: "Email tidak valid. Gunakan Gmail, Yahoo, Outlook, dll.",
        });

    // Validasi password
    if (password.length < 6)
      return res.status(400).json({ message: "Password minimal 6 karakter." });
    if (!/\d/.test(password))
      return res
        .status(400)
        .json({ message: "Password harus mengandung minimal 1 angka." });

    // cek email sudah ada atau belum
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // buat user baru
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      income_source,
      profession,
      monthly_income,
    });

    // response
    res.status(201).json({
      message: "Register success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        income_source: user.income_source,
        profession: user.profession,
        monthly_income: user.monthly_income,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cari user berdasarkan email
    const user = await User.findOne({
      email,
    });

    // cek user
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        income_source: user.income_source,
        profession: user.profession,
        monthly_income: user.monthly_income,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
