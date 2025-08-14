const express = require('express')
const app= express()
const db = require('./config/db')
const path = require('path')
const cors = require('cors')
const usermodel = require('./models/User')
const bcrypt = require('bcrypt')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));


app.post("/login", async function (req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  // 1. Find user
  const user = await usermodel.findOne({ email: email });
  if (!user) {
    return res.json({ success: false, message: "Email not found" });
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password); // user.password = hashed from DB

  if (isMatch) {
    res.json({ success: true, message: "Logined",email:user.email });
  } else {
    res.json({ success: false, message: "Invalid Password" });
  }
});
app.post("/register", async function (req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Check if all required fields are provided
    if (!name || !email || !password || !confirmPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    // 3. Check if user already exists
    const existingUser = await usermodel.findOne({ email: email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save user to DB
    const newUser = new usermodel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    // 6. Send success response
    res.json({ success: true,email :newUser.email, message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));