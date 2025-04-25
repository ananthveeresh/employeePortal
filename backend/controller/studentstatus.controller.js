const { json } = require("body-parser");
const db = require("../model");
const studentstatus = db.studentstatus;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            const data = req.body;
            var  result;

        // Process each item in the array
        for (const item of data) {
            const existingRecord = await studentstatus.findOne({
                std_suc: item.std_suc,
                campus_connect_id: item.campus_connect_id
            });

            result;
            if (existingRecord) {
                // Delete existing record
                await studentstatus.deleteOne({
                    std_suc: item.std_suc,
                    campus_connect_id: item.campus_connect_id
                });
            }
            
            // Insert new data
            result = await createData(studentstatus, item);
            // results.push(result);
        }

        res.status(200).json(result);
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try {
            const result = await readData(studentstatus, req.body);
            res.status(200).send(result)
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    listbysuc: async (req, res, next) => {
        try {
            const result = await readData(studentstatus, { std_suc: req.body.std_id, campus_connect_id: req.body.cmp_conn_id, section_id: req.body.sec_id });

            res.status(200).send(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try {
            const dataToDelete = req.body;
            if (!dataToDelete || dataToDelete.length === 0) {
                return res.status(400).json({ error: "No data provided for deletion" });
            }
            for (const obj of dataToDelete) {
                const filter = {
                    campus_connect_id: obj.campus_connect_id,
                    section_id: obj.section_id,
                    std_suc: obj.std_suc
                };
                await deleteDataByFilter(studentstatus, filter);
            }

            res.status(200).send({ result: "Records deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    statuslist: async (req, res, next) => {
        try {
            const result = await readData(studentstatus, {
                entry_date: {
                  $gte: new Date(req.params.reportdate+"T00:00:00.000Z"),
                  $lt: new Date(req.params.reportdate+"T23:59:00.000Z")
                },
                "staffinfo.paycode": req.params.paycode
              });
            res.status(200).send(result)
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


}
