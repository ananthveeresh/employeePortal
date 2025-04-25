module.exports = mongoose => {
  const project = mongoose.model(
    "homework",
    mongoose.Schema(
      {        
        report_date: { type: Date },
        year_info: { type: Object, require: true },
        faculty_info : {type :Object, require:true },
        category_info: { type: String, required:true},
        campus_info: { type: Object, require: true },
        category_info: { type: Object, require: true },
        section_info: { type: Object, require: true },
        subject_info: { type: Object, require: true },
        homework_description: { type: String, require: true },
        filename:{ type: String},
        filetype: { type: String },
        filepath: { type: String },
        notificationinfo:{ type: Array},
      },
      {
        timestamps: true
      }, { versionKey: false })
  );
  return project;
};