const { json } = require("body-parser");
const db = require("../model");
const eventcategory = db.eventcategory;
require("../config/dbclass")();

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(eventcategory, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(eventcategory, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    listbydate: async (req, res, next) => {
        try{
            const result = await readData(eventcategory, {"report_date": req.params.date+"T05:30:00.000+05:30"});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(eventcategory, { "question_level_id": req.params.subjectid });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(eventcategory, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(eventcategory, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    

}
