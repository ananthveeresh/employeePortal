module.exports = mongoose => {
    const project = mongoose.model(
      "exammarks",
      mongoose.Schema(
        {        
          exam_type: { type: String, required: true },
          exam_id : { type:Number, require:true },
          exam_name: { type: String, require: true },
          exam_date : { type: String, require: true },
          campus: { type: String, required: true },
          institute: { type: String, required: true },
          year_id : { type: String, required: true },
          suc_code : { type:String, require:true },
          student_id : { type:Number, require:true },
          student_name : { type:String, require:true },
          section_id : { type:Number, require:true },
          section : { type:String, require:true },
          class_name : { type:String, require:true },
          roll_no : { type:Number, require:true },
          exam_result : Array,
          std_aditional_info : Object,
          user_id : { type:String, require:true },
          user_name : { type:String, require:true },
          teacher_name : { type:String, require:true },
          report_layout : { type:String, require:true },
          report_generated: {type:Boolean, default:false}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return project;
  };