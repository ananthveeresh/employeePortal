const db = require("../model");
const gradescaledb = db.gradescale;
require("../config/dbclass")();
const analysiApi = 'http://10.60.1.9:3006/api';
const payrollApi = 'http://10.30.1.21:4602/api';


module.exports = {
    create: async (req, res, next) => {
        try {
            const result = await createData(gradescaledb, req.body);
            res.status(201).send(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAll: async (req, res, next) => {
        try {
            const gradescales = await readData(gradescaledb, {});
            res.status(200).send(gradescales);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getOneGradeScale: async (req, res, next) => {
        try {
            const {institute, exam_category, campus} = req.body
            var qry = [
                {
                  $match: {institute, exam_category, campus}
                },
                {
                  $addFields: {campus}
                }
              ]
            const gradescale = await aggregateData(gradescaledb, qry);
            if (!gradescale) {
                return res.status(404).json({ error: 'Grade Scale not found' });
            }
            res.status(200).send(gradescale);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    update: async (req, res, next) => {
        try {
            const gradescale = await updateData(gradescaledb, req.params.id, req.body);
            if (!gradescale) {
                return res.status(404).json({ error: 'Grade Scale not found' });
            }
            res.status(200).send(gradescale);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};