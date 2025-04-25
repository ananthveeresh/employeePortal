module.exports = mongoose => {
    const project = mongoose.model(
      "gradescale",
      mongoose.Schema(
        {        
          institute : {type:String, require : true},
          exam_category : {type:String, require : true},
          campus : {type:Array, require : true},
          grade_scale: { type: Array, required: true }
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return project;
  };