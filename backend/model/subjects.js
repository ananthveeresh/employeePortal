module.exports = mongoose => {
    const subjects = mongoose.model(
      "subjects",
      mongoose.Schema(
        {        
          subjectName: { type: String, require: true },
          subjectCode: { type: String, require: true },
          subjectType : {type :String, require:true },
          subjectInfo: {type:Array,require:true},
          instMaster: {type:Object,require:true}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return subjects;
  };