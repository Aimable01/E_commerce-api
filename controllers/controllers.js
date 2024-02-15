const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

//----product
const Product = require("../models/product-model");

//------------------------USER REGISTRATION AND LOGIN-------------------------------------------------
//-------User registration
const authRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//-------middle ware to check token validation
const authenticateToken = (req, res, next) => {
  const token = req.header.authorization;
  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }

  jwt.verify(token, "Secret-key", (err, decoded) => {
    if (err) return res.status(400).json({ message: err });
    req.user = decoded.User;
    next();
  });
};

//---------User login
const authLogin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(404).json({ message: "No password match found" });

    const token = jwt.sign({ username, email }, "Secret-key", {
      expiresIn: "10h",
    });
    req.header.authorization = token;

    res.status(200).json({ message: "user found", token: token, user: user });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
//-----------------------------------------END USER REGISTRATION AND LOGIN----------------------------------

//------------------------------------CRUD FOR THE PRODUCTS-------------------------------------------------
//create product
const createProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;
  try {
    const product = await new Product(req.body);
    await product.save();
    res.status(200).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ message: "All products", products });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//get a single product
const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(400).json({ message: "No product found" });
    res.status(200).json({ message: "product found", product });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "No product found" });

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Updated product now", updatedProduct });
  } catch (error) {
    res
      .status(404)
      .json({ message: error, message: "Not sending update request" });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  //const id = req.params.id;
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted now", product });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
//---------------------------------END CRUD FOR PRODUCTS------------------------------------------------
//------------export the controllers
module.exports = {
  authRegister,
  authLogin,
  authenticateToken,
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
