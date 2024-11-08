const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user  
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'User registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  console.log(
    "startedd to login "
  )
  const { email, password } = req.body;
  console.log(
    email,password
  )
  try {
    const user = await User.findOne({ email });
    console.log(
      "user found"  
    )
    if (!user || !(await bcrypt.compare(password, user.password))){
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
    console.log("user id is ",user.id)
    res.json({ token});
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
