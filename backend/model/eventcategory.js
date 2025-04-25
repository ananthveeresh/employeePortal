module.exports = mongoose => {
  const eventcategory = mongoose.model(
    "eventcategory",
    mongoose.Schema(
      {        
        categoryname: { type: String, require: true },
        categorycode: { type: String, require: true },
        subjectdisplay: { type: Number, require: true },
        inst_id: {type:Number,require:true}
      },
      {
        timestamps: true
      }, { versionKey: false })
  );
  return eventcategory;
};