module.exports = mongoose => {
  const project = mongoose.model(
    "studentstatus",
    mongoose.Schema(
      {        
        academic_year: { type: Number, require: true },
        branch: { type: String, require: true },
        branch_id: { type: Number, require: true },
        inst_id : {type :Number, require:true },
        campus_connect_type: { type: String },
        campus_connect_id: { type: String },
        campus_connect_entry_date: { type: Date },
        entry_date: { type: Date, require: true },
        std_suc: { type: String, require: true },
        student_name: { type: String, require: true },
        section_name: { type: String, require: true },
        section_id: { type: Number,require: true  },
        homework_status: { type: Boolean, require: true  },
        comment: { type: String },
        staffinfo: { type: Object}
      },
      {
        timestamps: true
      }, { versionKey: false })
  );
  return project;
};
