const { create, updateId } = require("../controller/autoincrement.controller");
const router  = require("express").Router();
 
router.post("/create", create); 
router.post("/updateId/:id", updateId); 

module.exports = router;