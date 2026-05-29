const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER SERVICE
const registerService = async (body) => {
  const { name, email, password, income_source, profession, monthly_income } =
    body;

  // Validasi field wajib
  if (!name || !email || !password)
    throw new Error("Nama, email, password wajib diisi.");

  // Validasi format email
  const emailRegex =
    /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|student)[.\w]*\.[a-z]{2,}$/i;
  if (!emailRegex.test(email))
    throw new Error("Email tidak valid. Gunakan Gmail, Yahoo, Outlook, dll.");

  // Validasi password
  if (password.length < 6) throw new Error("Password minimal 6 karakter.");
  if (!/\d/.test(password))
    throw new Error("Password harus mengandung minimal 1 angka.");

  // Cek email sudah ada
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email sudah digunakan.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    income_source,
    profession,
    monthly_income,
  });

  return {
    success: true,
    message: "Register success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

// LOGIN SERVICE
const loginService = async (body) => {
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) throw new Error("User tidak ditemukan.");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Password salah.");

  const token = generateToken(user._id);

  return {
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = { registerService, loginService };
