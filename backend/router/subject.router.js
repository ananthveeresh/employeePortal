const { create, list,listbydate, getbyid, update, remove } = require("../controller/subject.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/listbydate/:date", listbydate);
router.get("/getbyid/:subjectid", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

module.exports = router;
