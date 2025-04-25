const { json } = require("body-parser");
const db = require("../model");
const questionmaster = db.questionmaster;
const tagmaster = db.tagmaster;
const autoIncrement = db.autoIncrement;
require("../config/dbclass")();


module.exports = {

    // Insert Question with AutoId

    create: async (req, res, next) => {
        try{
            //If autoincrement id needed other wise comment it below line
            req.body.question_master_id = (await getAutoId(autoIncrement, 'question_master_id')).seq;
            req.body = await addhtmlentities(req.body) // To update ans_master_question_id and description
            const result = await createData(questionmaster, req.body); // question_master_id is AutoIncrement Id FieldName
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Get Questions
    getlist: async (req, res, next) => {
        try{
            const result = await readData(questionmaster, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Get Question By ID
    getquestionmaster: async (req, res, next) => {
        try{
            const result = await readData(questionmaster, { "question_master_id": req.params.qid });
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Get Questions By Given Question IDs
    getquestionsbyids: async (req, res, next) => {
        try{
            var pipeline = [
                {
                    $match : { "question_master_id": {$in:req.body.qids} }
                }
            ]
            var projectobj = {};
            if(req.body.reqFields){
                req.body.reqFields.forEach(field => {
                    projectobj[field] = 1;
                });
            }
            if (req.body.reqFields) {
                pipeline.splice(1, 0, {
                    $project:  projectobj
                });
            }
            const result = await aggregateData(questionmaster, pipeline);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Update Question
    updateQuestion: async (req, res, next) => {
        try{
            const result = await updateByFilter(questionmaster, req.params.id, req.body);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Delete Question
    deleteQuestion: async (req, res, next) => {
        try{
            const result = await deleteByFilter(questionmaster, req.params.id);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        } 
    },

    // Upload Question
    uploadQuestion: async (req, res, next) => {
        try {
            file_name = "../uploads"
            const result = await uploadimage(req, res, file_name)
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Get questions given by filter arregements and return required fields
    getquesbygivenfilter: async (req, res, next) => {
        try{
            var reqobj = {
                "program.program_master_name":req.body.Program,
                "subject_master_name":req.body.Subject,
                "topic_master_name":req.body.Topic,
                "subtopic_master_name":req.body.subtopic,
                "question_master_type_name":req.body.Type,
                "question_master_level_name":req.body.Level
            }
            reqobj = removeUndefinedValues(reqobj); // Remove undefined values from the object
            var reqFields = req.body.reqFields
            const returnboj = {};
            if(reqFields){
                reqFields.forEach(field => {
                    returnboj[field] = 1;
                });
            }
            var pageNo = req.body.Pageno || 1; // Assuming the page number is in the request query
            var limit = req.body.Limit | 100;
            var offset = (pageNo - 1) * limit;
            const result = await filterData(questionmaster, reqobj, returnboj, limit, offset);
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // Get questions given by filter arregements and return quation ids
    getquesidsbygivenfilter: async (req, res, next) => {
        try{
            var tag_name = req.body.Tags ? { $in: req.body.Tags } : undefined;
            var matchobj = {
                "program.program_master_name":req.body.Program,
                "subject_master_name":req.body.Subject,
                "topic_master_name":req.body.Topic,
                "subtopic_master_name":req.body.subtopic,
                "question_master_type_name":req.body.Type,
                "question_master_level_name":req.body.Level,
                tag_name
            }
            matchobj = removeUndefinedValues(matchobj); // Remove undefined values from the object
            var pageNo = req.body.Pageno || 1; // Assuming the page number is in the request query
            var limit = req.body.Limit || 100;
            var offset = (pageNo - 1) * limit;
            const groupbyobj = {};
            Object.keys(matchobj).forEach(key => {
                if(key!="program.program_master_name" && key!="tag_name"){
                    groupbyobj[key] = `$${key}`
                }
              });
            var aggregatearr = [
                {
                    $sort: {
                        "question_master_id": -1 // Sort the question_master_id array in ascending order
                    }
                },
                { 
                    $match: matchobj
                },
                {
                    $group: { 
                        _id: groupbyobj,
                        question_master_id: { $addToSet: "$question_master_id"}, // Add all question_master_id values to an array
                    }
                },
                {
                    $project: {
                        _id: 1,
                        question_master_id: {
                            $slice: ["$question_master_id", offset, limit] 
                            // Limit the array to 10 elements starting from the 6th element (offset 5)
                        }
                    }
                }
            ]
            
            const result = await aggregateData(questionmaster, aggregatearr, {question_master_id:-1});
            res.status(200).send(result)
        }catch(err){
            res.status(500).json({ error: err.message });
        }
    },

    // tag rename
    tagrename: async (req, res, next) => {
        var quescondobj = {tag_name : req.body.oldtag}
        var quesupdateobj = { $set: { "tag_name.$": req.body.newtag } }

        //tag rename in quations master
        var tagupdateinques = await updateMany(questionmaster, quescondobj, quesupdateobj);

        //tag rename in tag master
        var tagcondobj = {tagname : req.body.oldtag}
        var tagupdateobj = {$set:{ "tagname": req.body.newtag}}
        
        var tagupdateintags = await updateGivenArgs(tagmaster, tagcondobj, tagupdateobj);

        res.status(200).send([tagupdateinques, tagupdateintags])
    },

    // tag rename by given questions ids 
    tagrenamebyqids: async (req, res, next) => {
        // console.log(req.body)
        //question master
        if(req.body.qids!=undefined && req.body.qids.length>0){
            var quescondobj = {tag_name : {$in : req.body.oldtag},  "question_master_id": { $in: req.body.qids }}
            var quesupdateobj = { $set: { "tag_name.$": req.body.newtag } }
            //tag rename in quations master
            var quesresult = await updateMany(questionmaster, quescondobj, quesupdateobj);

            //tag master
            var findques = await readData(tagmaster, {tagname : req.body.newtag});
            var existedtags = {}
            if(findques.length>0){
                var tagcondobj = { tagname: req.body.oldtag, qids: { $in: req.body.qids } }
                var tagupdateobj = { $pullAll: { qids: req.body.qids } }
                await updateGivenArgs(tagmaster, tagcondobj, tagupdateobj);
                var updateobj = {
                        "tagname": [req.body.newtag],
                        "qids" : req.body.qids
                    }
                var existedtags = await insertorupdatetags(updateobj)
            } else {
                if(req.body.qids!=undefined && req.body.qids.length>0){
                    const oldTagname = req.body.oldtag;
                    const qidsToRemove = req.body.qids;
                    const newTagname = req.body.newtag;
                    const newQids = req.body.qids;
                    var tagresult = await renametagintagmaster(oldTagname, qidsToRemove, newTagname, newQids);
                }
            }
        }    

        
        
        res.status(200).send({quesresult, tagresult, existedtags})
    }
}
