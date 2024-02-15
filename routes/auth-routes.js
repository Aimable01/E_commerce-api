const router = require("express").Router();
const controllers = require("../controllers/controllers.js");

router.post("/auth/users/register", controllers.authRegister);
router.post("/auth/users/login", controllers.authLogin);

//----------product routes
router.post("/products/add", controllers.createProduct);

module.exports = router;
