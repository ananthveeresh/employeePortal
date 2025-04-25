module.exports = mongoose => {
    const project = mongoose.model(
      "layouts",
      mongoose.Schema(
        {       
          exam_category : {type:String, require : true}, 
          campus : {type:String, require : true},
          institute : {type:String, require : true},
          layout_path : {type:String, require : true},
          layout_name: { type: String, required: true },
          layout_html_file: { type: String, required: true },
          bg_image : {type:String, require : true},
          priview_image :{type:String, require : true},
          signature : {type:String, require : true}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return project;
  };