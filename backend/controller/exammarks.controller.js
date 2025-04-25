const db = require("../model");
const exammarksdb = db.exammarks;
const reportlayouts = db.reportlayouts;
require("../config/dbclass")();
require("../commonfunc/scriptFunctions")();
require("../commonfunc/apisFunctions")();


module.exports = {

  //subject wise marks entry creation
  subjectmarksentrycreation: async (req, res, next) => {
    try {
      const {campus, exam_id, section_id, paycode, class_teacher} = req.body;
      const findExamData = await readData(exammarksdb, { campus, exam_id, section_id });
      // console.log(exam_id, section_id)
      const examSubjects = await subjectsByExam(exam_id, section_id);
      if(class_teacher==0){
        const mappingSubjectList = await mappingSubjects(exam_id, section_id);
        var subjectsList = mappingSubjectList.filter(e=>e.paycode==paycode);
      } else {
        var subjectsList = examSubjects;
      }
      
      var subjectsData = []
      if(findExamData.length==0){
          for(let i=0; i<subjectsList.length; i++){
            var remainingSubjects = {
                "subject": subjectsList[i].subject_name,
                "max_marks": subjectsList[i].max_marks,
                "min_marks": subjectsList[i].min_marks,
                "marks": "-",
                "grade": "-",
                "user_name": "-",
                "date": "-",
                campus, exam_id, section_id
            }
            subjectsData.push(remainingSubjects)
          }
          res.status(200).json({status:true, subjectsData, examSubjects, result:[], msg:"No data found"});
        // console.log('no data')
      } else {
        if(findExamData[0].report_generated==true){
          let subjects = subjectsList.map(item => item['subject_name']);
          findExamData.forEach(document => {
              document.exam_result = subjects.map(subject => {
                return document.exam_result.find(result => result.subject === subject);
              });
            });
          res.status(200).json({status:true, subjectsData:[], examSubjects, result:findExamData,  report_generated:true, msg:"Progress card generated"});
        } else {
          
          var subjectsData = [];
          var examresult = findExamData[0].exam_result;
          for(let i=0; i<subjectsList.length; i++){
            var filtersubjects = examresult.filter(e=>e.subject==subjectsList[i].subject_name);
            if(filtersubjects.length>0){
              filtersubjects[0].campus = campus;
              filtersubjects[0].exam_id=exam_id; 
              filtersubjects[0].section_id=section_id;
              subjectsData.push(filtersubjects[0])
            } else {
              var remainingSubjects = {
                  "subject": subjectsList[i].subject_name,
                  "max_marks": subjectsList[i].max_marks,
                  "min_marks": subjectsList[i].min_marks,
                  "marks": "-",
                  "grade": "-",
                  "user_name": "-",
                  "date": "-",
                  campus, exam_id, section_id
              }
              subjectsData.push(remainingSubjects)
            }
          }
          if(subjectsList.length==examresult.length){
            res.status(200).json({status:true, subjectsData, examSubjects, report_generated:false, result:[], msg:"Marks Submitted"});
          } else {
            res.status(200).json({status:true, subjectsData, examSubjects, result:[], msg:"A few subjects have not been entered."});
          }
        }
          
      }
    }  catch (error) {
      console.log(error)
      res.status(500).json({ status:false, error: error.message });
    }
  },

  //post section wise subject marks
  subjectwisemarksentry: async (req, res, next) => {
      try {
        const examsData = req.body;
        for (let examData of examsData) {
          const { exam_id, student_id, exam_result, ...restData } = examData;
    
          // for (let subjectResult of exam_result) {
            // Check if the document with the same exam_id, student_id, and exam_result.subject already exists
            const existingExam = await readData(exammarksdb, {
              exam_id: exam_id,
              student_id: student_id,
              'exam_result.subject': exam_result.subject
            });
            // console.log(existingExam)
            // console.log(exam_result.subject)
            if (existingExam && existingExam.length>0) {
              // Update the existing subject result
              var finalres = await updateGivenArgs(exammarksdb,
                { exam_id: exam_id, student_id: student_id, 'exam_result.subject': exam_result.subject },
                { $set: { 'exam_result.$': exam_result, ...restData } },
                { returnOriginal: false }
              );
            } else {
              // Push the new subject result
              var finalres = await updateorinsert(exammarksdb, 
                { exam_id: exam_id, student_id: student_id },
                { $push: { exam_result: exam_result,  }, report_generated: false, ...restData },
                // { new: true, upsert: true } // `new` returns the updated document, `upsert` creates the document if it doesn't exist
              );
            }
          // }
        }
        
        res.status(200).json({status:true, result : finalres});
    
      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    },

    //get section wise subject marks
    getsubjectwisemarks: async (req, res, next) => {
      try {
        const {campus, exam_id, section_id, subject} = req.body;
        var result = await aggregateData(exammarksdb, [
          {
            $match: {
              exam_id, campus, section_id, "exam_result.subject" : subject
            }
          },
          {
            $unwind: "$exam_result"
          },
          {
            $match: {
              "exam_result.subject": subject
            }
          }
        ])
        if(result.length>0){
          res.status(200).json({status:true, result, msg:"Success"});
        } else {
          res.status(200).json({status:false, result:[], msg:"Data not found"});
        }
    
      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    },

    //get section wise exam marks
    getsectionwiseexammarks: async (req, res, next) => {
      try {
        const {campus, exam_id, class_name, section} = req.body;
        var result = await readData(exammarksdb, { exam_id, campus, class_name, section})
        if(result.length>0){
          res.status(200).json({status:true, result});
        } else {
          res.status(200).json({status:false, error:"Data not found"});
        }
      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    },

    //section wise progress report generate
    secwiseprogressreport: async (req, res, next) => {
      try {

        const { exam_id, campus, section, user_id, teacher_name, year_id, report_layout, user_name} = req.body;
        
        await updateMany(exammarksdb, {
          year_id, campus, exam_id, section
        }, { $set: { report_generated: true, user_id, user_name, teacher_name, report_layout } });
        var succcessres = await readData(exammarksdb, { campus ,exam_id, section, report_generated:true});
        // console.log(report_layout)
        var layoutfilter = await readData(reportlayouts, { layout_html_file:report_layout });
        
        if(layoutfilter.length>0){
          for(let i=0; i<succcessres.length; i++){
            console.log(process.env.REPORT_LAYOUT+layoutfilter[0].layout_html_file+"?id="+succcessres[i]._id)
            var pdfgenobj =
            {
              "url": process.env.REPORT_LAYOUT+layoutfilter[0].layout_html_file+"?id="+succcessres[i]._id,
              "path": "/"+year_id+"/"+campus+"/"+exam_id,
              "format": "A4",
              "filename": succcessres[i].suc_code,
              "pageNumbers": false,
              "headerLeft" :"",
              "headerRight" :"",
              "margin":{
                          "top": 0,
                          "right": 0,
                          "bottom": 0,
                          "left": 0
                      }
            }
            await kafkapdf(pdfgenobj);
          }
          res.status(200).json({status:true, result:"success"});
        } else {
          res.status(404).json({status:true, result:"Layout not found"});
        }

        

      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    },

    //student single exam report card
    studentexamreportcard: async (req, res, next) => {
      try {
        const{ exam_id, section, suc_code }  = req.params;
        var result = await readData(exammarksdb, {exam_id, suc_code})
        if(result.length>0){
          const subjectList = await subjectsByExam(exam_id, section);
          if(subjectList.length>0){
            const subjects = subjectList.map(item => item['subject_name']);
            result.forEach(document => {
              document.exam_result = subjects.map(subject => {
                return document.exam_result.find(result => result.subject === subject);
              });
            });
            res.status(200).json({status:true, result});
          }
          
        } else {
          res.status(200).json({status:false, error:"Data not found"});
        }
      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    },

    //get student exam result by mongoid
    examresbymongoid: async (req, res, next) => {
      try {
        if(req.params.id!='null'){
          // console.log(req.params.id)
          var result = await readData(exammarksdb, { _id:req.params.id})
          if(result.length>0){
            res.status(200).json({status:true, result});
          } else {
            res.status(200).json({status:false, error:"Data not found"});
          }
        } else {
          res.status(500).json({status:false, error:"Please send request parameters"});
        }
        
      }  catch (error) {
        console.log(error)
        res.status(500).json({ status:false, error: error.message });
      }
    }

};