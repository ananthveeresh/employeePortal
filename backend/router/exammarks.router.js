// routers/router.js
const { subjectmarksentrycreation, subjectwisemarksentry, getsubjectwisemarks, getsectionwiseexammarks, secwiseprogressreport, studentexamreportcard, examresbymongoid, pdfgenerate, downloadpdf } = require('../controller/exammarks.controller');
const router = require('express').Router();

router.post('/marksentrycreation', subjectmarksentrycreation);
router.post('/subjectentry', subjectwisemarksentry);
router.post('/subjectmarks', getsubjectwisemarks);
router.post('/sectionexammarks', getsectionwiseexammarks);
router.post('/generatereportcard', secwiseprogressreport);
router.get('/studentreportcard/:section/:exam_id/:suc_code', studentexamreportcard);
router.get('/mongo/:id', examresbymongoid);

module.exports = router;