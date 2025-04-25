// routers/router.js
const { create, getAll, getCategoryWise, getCategoryandInst, getOne, update, getLayoutInfo } = require('../controller/layouts.controller');
const router = require('express').Router();

router.post('/create', create);
router.get('/', getAll);
router.get('/category/:name', getCategoryWise);
router.get('/filter/:inst/:name', getCategoryandInst);
router.get('/getone/:layout/:category', getOne);
router.put('/update/:id', update);
router.get('/filter/:layouthtml', getLayoutInfo);

module.exports = router;
