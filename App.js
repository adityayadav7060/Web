const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const app = express();
app.use(express.static('my-food-blog'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'my-food-blog')));
const cors = require("cors");
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/food")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));


const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model("Contact", ContactSchema);

app.post("/contact", async (req, res) => {
  console.log("🔥 Incoming Data:", req.body); 

  try {
    const contact = new Contact(req.body);

    await contact.save();

    console.log("✅ Saved to MongoDB");

    res.json({ status: "success" });

  } catch (error) {
    console.error("❌ Error:", error);
    res.json({ status: "error" });
  }
});


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

// REGISTER
app.post("/register", async (req, res) => {
  console.log("🔥 Register Data:", req.body);

  try {
    const user = new User(req.body);
    await user.save();

    console.log("✅ User saved");

    res.json({ status: "success" });

  } catch (err) {
    console.error(err);
    res.json({ status: "error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.json({ status: "user not found" });

    if (user.password !== password) {
      return res.json({ status: "wrong password" });
    }

    res.json({ status: "success", user });

  } catch (err) {
    res.json({ status: "error" });
  }
});





app.listen(5000, () => {
  console.log("Server running on port 5000");
});