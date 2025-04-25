module.exports = mongoose => {
    const notifications = mongoose.model(
      "notifications",
      mongoose.Schema(
        {        
          notifytype: { type: String, require: true },
          status: {type:Boolean,require:true}
        },
        {
          timestamps: true
        }, { versionKey: false })
    );
    return notifications;
  };