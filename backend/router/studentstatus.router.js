const { create, list, listbysuc, remove,statuslist } = require("../controller/studentstatus.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.post("/listbysuc", listbysuc);
router.post("/delete", remove);

router.get("/statuslist/:reportdate/:paycode", statuslist);

module.exports = router;
