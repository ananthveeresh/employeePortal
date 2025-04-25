const db = require("../model");
const axios = require('axios');
require("../config/dbclass")();
require("../commonfunc/scriptFunctions")();

const analysisApi = analysisapi();
const payrollApi = payrollapi();

module.exports = function() { 

    // subjects list by given exam and section
    this.subjectsByExam = async (exam_id, section_id)=>{
        try {
            const endpoint = process.env.ANALYSIS_API+'exams/examsecsubjects';
            const payload = { exam_id, section_id };
            // console.log(endpoint, payload)
            const resultdate = await axios.post(endpoint, payload);
            return resultdate.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    // subjects list by employee section maping
    this.mappingSubjects = async (exam_id, section_id)=>{
        try {
            const endpoint = process.env.ANALYSIS_API+'exams/employeesecsubjects';
            const payload = { exam_id, section_id };
            // console.log(endpoint, payload)
            const resultdate = await axios.post(endpoint, payload);
            return resultdate.data;
        } catch (error) {
            throw new Error(error);
        }
    }

    // progress report post to Kafka
    this.kafkapdf = async (payload)=>{
        try {
            var finalobj = {data:payload}
            await axios.post(process.env.KAFKA_URL, finalobj);
        } catch (error) {
            throw new Error(error);
        }
    }
    
}    