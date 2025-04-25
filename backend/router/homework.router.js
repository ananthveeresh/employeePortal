const { create, list,listbydate,listbysectiondate, getbyid, update, remove,masterinstitute,mastersections,sectionsubjects,empattendance,getsectionwisestudentslist,empregister,verifylogin,changepassword,empbasicinfo,studenthomework } = require("../controller/homework.controller");
const router = require("express").Router();

router.post("/create", create);
router.get("/list", list);
router.get("/listbydate/:date", listbydate);
router.post("/listbysectiondate", listbysectiondate);
router.get("/getbyid/:subjectid", getbyid);
router.post("/update/:id", update);
router.delete("/delete/:id", remove);

//master data from analysis application
router.get("/masterinstitute", masterinstitute);
router.get("/mastersections/:campus/:year", mastersections);
router.get("/sectionsubjects/:secid", sectionsubjects);
router.post("/getsectionwisestudentslist", getsectionwisestudentslist);

router.get("/empattendance/:paycode", empattendance);
router.get("/empbasicinfo/:paycode", empbasicinfo);

router.post("/empregister", empregister);
router.post("/verifylogin", verifylogin);
router.post("/changepassword", changepassword);

router.post("/studenthomework", studenthomework);

module.exports = router;
