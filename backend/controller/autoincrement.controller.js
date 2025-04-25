const { json } = require("body-parser");
const db = require("../model");
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();

module.exports = {
    create: async (req, res, next) => {
        const result = await createData(autoIncrement, req.body);
        res.status(result.status).send(result)
    },

    updateId: async (req, res, next) => {
        try {
            const result = await autoIncrement.findByIdAndUpdate({ _id: req.params.id }, { $inc: { seq: 1 } }, args)
            res.status(result.status).send(result)

        } catch (err) {
            const obj = {
                status: 500,
                result: err
            };
            res.status(obj.status).send(obj)
        }
    }
}
