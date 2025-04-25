module.exports = mongoose => {
  const project = mongoose.model(
    "AutoIncrement",
    mongoose.Schema(
      {
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 }
      }
    )
  );
  return project;
};
