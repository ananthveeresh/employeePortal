module.exports = mongoose => {
    const subjects = mongoose.model(
      "examcategory",
      mongoose.Schema(
        {        
          categoryname: { type: String, require: true },
          categorycode: { type: String, require: true },
          inst_master: {type:Object,require:true}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return subjects;
  };