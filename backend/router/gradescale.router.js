// routers/router.js
const { create, getAll, getOneGradeScale, update } = require('../controller/gradescale.controller');
const router = require('express').Router();

router.post('/create', create);
router.get('/', getAll);
router.post('/getone', getOneGradeScale);
router.put('/update/:id', update);

module.exports = router;
