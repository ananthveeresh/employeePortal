const { create, getlist, getquestionmaster, getquestionsbyids, updateQuestion, deleteQuestion, uploadQuestion, getquesbygivenfilter, getquesidsbygivenfilter, tagrename, tagrenamebyqids } = require("../controller/questionmaster.controller");
const router  = require("express").Router();
 
//Question Master Apis
router.post("/create", create); 
router.get("/list", getlist);
router.get("/ques_by_id/:qid", getquestionmaster); 
router.post("/quesbygivenids", getquestionsbyids);
router.post("/updateQuestion/:id", updateQuestion); 
router.delete("/deleteQuestion/:id", deleteQuestion);
router.post("/quesbygivenfilter", getquesbygivenfilter);
router.post("/quesidsbygivenfilter", getquesidsbygivenfilter);
router.post("/tagrename", tagrename);
router.post("/tagrenamebyqids", tagrenamebyqids);

//Uplolad Question Apis
router.post("/uploadQuestion", uploadQuestion);



module.exports = router;