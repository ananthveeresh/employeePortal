const { json } = require("body-parser");
const db = require("../model");
const homework = db.homework;
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();
const request = require('request');
const analysiApi = 'http://10.60.1.9:3006/api';
const payrollApi = 'http://10.30.1.21:4602/api';

module.exports = {

    create: async (req, res, next) => {
        try{
            const result = await createData(homework, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    list: async (req, res, next) => {
        try{
            const result = await readData(homework, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    listbydate: async (req, res, next) => {
        try{
            const result = await readData(homework, {"report_date": req.params.date+"T05:30:00.000+05:30"});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    listbysectiondate: async (req, res, next) => {
        try{

            const reportDate = req.body.reportdate; // e.g., '2024-06-14'
            const sectionId = req.body.sectionid;   // e.g., 3385
            
            // Convert to ISO string and create start and end date objects
            const startDate = new Date(reportDate + "T00:00:00.000+05:30");
            const endDate = new Date(new Date(reportDate + "T00:00:00.000+05:30").getTime() + 24 * 60 * 60 * 1000);


            const result = await readData(homework, {
                "report_date": {
                    $gte: startDate,
                    $lt: endDate
                },
                "section_info.id": sectionId,
                "year_info.year_id": req.body.yearid
            });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    getbyid: async (req, res, next) => {
        try{ 
            const result = await readData(homework, { "question_level_id": req.params.subjectid });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try{
            const result = await updateData(homework, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    remove: async (req, res, next) => {
        try{
            const result = await deleteData(homework, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    masterinstitute: async (req, res, next) => {
        try{
            request.get(analysiApi+'/master/institute', function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    mastersections: async (req, res, next) => {
        try{
            request.get(analysiApi+'/master/section?campus='+req.params.campus+'&year='+req.params.year, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    sectionsubjects: async (req, res, next) => {
        try{
            request.get(analysiApi+'/master/sectionsubjects/'+req.params.secid, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    empattendance: async (req, res, next) => {
        try{
            request.get(payrollApi+'/employeelogin/attendance/'+req.params.paycode, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    empbasicinfo: async (req, res, next) => {
        try{
            request.get(payrollApi+'/employeemaster/basicinfo/'+req.params.paycode, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    getsectionwisestudentslist: async (req, res, next) => {
        try{
            request.post(analysiApi+'/student/getsectionwisestudentslist',{ json: true, body: req.body }, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    empregister: async (req, res, next) => {
        try{
            request.post(payrollApi+'/employeelogin/register',{ json: true, body: req.body }, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    verifylogin: async (req, res, next) => {
        try{
            request.post(payrollApi+'/employeelogin/verifylogin',{ json: true, body: req.body }, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }
    ,

    changepassword: async (req, res, next) => {
        try{
            request.post(payrollApi+'/employeelogin/changepassword',{ json: true, body: req.body }, function (error, response,body) {

            res.status(200).send(body)

        })
           
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    studenthomework: async (req, res, next) => {
        try{

            const sectionId = req.body.sectionid;   // e.g., 3385
            

            const result = await readData(homework, {
                "section_info.id": sectionId,
                "year_info.year_id": req.body.yearid
            });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    }

    

}
