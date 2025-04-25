module.exports = mongoose => { 
    const project = mongoose.model(
      "QuestionMaster",
      mongoose.Schema(
        {
        question_master_id :  { type: Number, required: true, unique: true },
        question_master_desc: { type: String, required: true },
        ans:{ type: Array,required: true}, 
        program:{type:Array,require:true},  
        tag_name:{type:Array,require:true},
        question_master_type:{type:String,require:true},
        question_master_type_name:{type:String,require:true},
        question_master_type_code:{type:String,require:true},
        question_master_level_id:{type:String,require:true},
        question_master_level_name:{type:String,require:true},
        question_master_subject_id:{type:String,require:true},
        subject_master_name:{type:String,require:true},
        topic_id:{type:String,require:true}, 
        topic_master_name:{type:String,require:true},
        subtopic_id:{type:String,require:true},
        subtopic_master_name:{type:String,require:true},
        question_master_hint:{type:String},
        user_id:{type:String},
        ques_created:{type:String},
        ques_update:{type:String},
        videos:{type:Array,},
        createdAt: {type: Date,default: Date.now }
      },
      {
        timestamps: true
      },{ versionKey: false })
      
    ); 
    return project;
  };
  