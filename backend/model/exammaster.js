module.exports = mongoose => {
    const exammaster = mongoose.model(
      "exammaster",
      mongoose.Schema(
        {        
          name: { type: String, require: true },
          categorycode: { type: String, require: true },
          inst_master: {type:Object,require:true}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return exammaster;
  };