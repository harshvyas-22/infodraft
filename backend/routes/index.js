var express = require("express");
var router = express.Router();
var userModel = require("../models/useModel");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var docModel = require("../models/docModel");
// At the top of routes/index.js, you need to add:
const mongoose = require("mongoose");

const secret = "secret";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/test", function (req, res, next) {
  res.json({ message: "Test API" });
});

router.post("/signUp", async (req, res) => {
  console.log("Called");

  let { username, name, email, phone, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  let phoneCon = await userModel.findOne({ phone: phone });
  if (emailCon) {
    return res.json({ success: false, message: "email already exist" });
  } else if (phoneCon) {
    return res.json({ success: false, message: "Phone number already exist" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;
        let user = await userModel.create({
          username: username,
          name: name,
          email: email,
          phone: phone,
          password: hash,
        });
        res.json({
          success: true,
          message: "User created successfully",
          userId: user._id,
        });
      });
    });
  }
});

// Route: POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if it's a guest login
    if (user.username === "guest") {
      console.log("Guest login");
      const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1h" }
      );
      return res.json({
        success: true,
        message: "Guest login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    }

    // For other users, verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate token for authenticated user
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      secret,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/createDoc", async (req, res) => {
  let { userId, docName } = req.body;
  let user = userModel.findById(userId);
  if (user) {
    let doc = await docModel.create({
      uploadedBy: userId,
      title: docName,
    });

    return res.json({
      success: true,
      message: "Document created successfully",
      docId: doc._id,
    });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

router.post("/uploadDoc", async (req, res) => {
  let { userId, docId, content } = req.body;
  let user = userModel.findById(userId);
  if (user) {
    let doc = await docModel.findByIdAndUpdate(docId, { content: content });
    return res.json({
      success: true,
      message: "Document uploaded successfully",
    });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

router.post("/getDoc", async (req, res) => {
  let { docId, userId } = req.body;

  // Handle guest user explicitly
  if (userId === "guest-user") {
    return res.json({
      success: false,
      message: "Guest user cannot access documents",
    });
  }

  // Validate ObjectId before querying MongoDB
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(docId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    let user = await userModel.findById(userId);
    if (user) {
      let doc = await docModel.findById(docId);
      if (doc) {
        return res.json({
          success: true,
          message: "Document fetched successfully",
          doc: doc,
        });
      } else {
        return res.json({ success: false, message: "Invalid document" });
      }
    } else {
      return res.json({ success: false, message: "Invalid user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/deleteDoc", async (req, res) => {
  let { userId, docId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    let doc = await docModel.findByIdAndDelete(docId);
    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

router.post("/getAllDocs", async (req, res) => {
  const { userId } = req.body;

  console.log("Received userId:", userId); // Debug log

  // Handle guest user explicitly
  if (userId === "guest-user") {
    return res.json({
      success: true,
      docs: [], // Return an empty array for guest users
    });
  }

  // Validate user ID format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const docs = await docModel.find({ uploadedBy: userId });
    return res.status(200).json({ success: true, docs });
  } catch (error) {
    console.error("Error in /getAllDocs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/getUser", async (req, res) => {
  let { userId } = req.body;

  // Handle hardcoded guest user explicitly
  if (userId === "guest-user") {
    return res.json({
      success: true,
      message: "Guest user fetched successfully",
      user: {
        _id: "682727a14bc47d745b1c46b2",
        name: "guest",
        email: "guest@gmail.com",
        password: "123@123",
        phone: "123123123",
        username: "guest",
        isBlocked: false,
        isAdmin: false,
        date: new Date(1747396513157), // or new Date("2025-06-15T13:15:13.157Z") if you prefer ISO
        __v: 0,
      },
    });
  }

  // Validate ObjectId before querying MongoDB
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format" });
  }

  try {
    let user = await userModel.findById(userId);
    if (user) {
      return res.json({
        success: true,
        message: "User fetched successfully",
        user,
      });
    } else {
      return res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findById(userId);
  if (user) {
    return res.json({ success: true, message: "User logged out successfully" });
  } else {
    return res.json({ success: false, message: "Invalid user" });
  }
});

module.exports = router;
