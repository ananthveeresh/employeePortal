const multer = require("multer");
const path = require("path");
const db = require("../model");

module.exports = function () {
    this.createData = async (col_name, args) => {
        try {
            return await col_name.insertMany(args);
        } catch (err) {
            throw new Error(err);
        }
    },

    this.readData = async (col_name, args,sortarg='{_id:-1}') => {
       try {        
        //console.log(args)
            return await col_name.find(args).sort(sortarg)
        } catch (err) {
            throw new Error(err);
        }
    },

    this.updateData = async (col_name, data_id, args) => {
        try {
            return await col_name.findByIdAndUpdate(data_id, args)
        } catch (err) {
            throw new Error(err);
        }
    },

    this.updateByFilter = async (col_name, data_id, args) => {
        try {
            return await col_name.findOneAndUpdate({ "question_master_id": data_id }, args)
        } catch (err) {
            throw new Error(err);
        }
    },

    this.deleteData = async (col_name, data_id) => {
        try {
            return await col_name.findByIdAndDelete(data_id)
        } catch (err) {
            throw new Error(err);
        }
    },
    
    this.deleteDataByFilter = async (col_name, args) => {
        try {
            return await col_name.deleteMany(args)
        } catch (err) {
            throw new Error(err);
        }
    },

    this.deleteByFilter = async (col_name, data_id) => {
        try {
            return await col_name.findOneAndDelete({ "question_master_id": data_id})
        } catch (err) {
            throw new Error(err);
        }
    },

    this.getAutoId = async (col_name, data_id) => {
        try {
            return await col_name.findByIdAndUpdate({ _id: data_id }, { $inc: { seq: 1 } }, { new: true });
        } catch (err) {
            throw new Error(err);
        }
    },

    this.uploadimage = async (req, res, file_path_name) => {
        return new Promise((resolve, reject) => {
            try {
                const storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, path.join(__dirname, file_path_name));
                    },
                    filename: function (req, file, cb) {
                        cb(null, Date.now() + path.extname(file.originalname));
                    },
                });
        
                const fileFilter = function (req, file, cb) {
                    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
                        cb(null, true); // Accept the file
                    } else {
                        reject(new Error('File type not supported!'));
                    }
                };
        
                const upload = multer({ 
                    storage: storage,
                    fileFilter: fileFilter // Apply the file filter
                });
        
                upload.single('QuestionImage')(req, res, async (err) => {
                    if (err instanceof multer.MulterError) {
                        reject(err);
                    } else if (err) {
                        reject(err);
                    } else {
                        const file = req.file;
                        if (!file) {
                            // No file uploaded
                            const error = new Error('No image uploaded.');
                            error.statusCode = 404;
                            reject(error);
                        } else {
                            resolve(file);
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };
    
    this.aggregateData = async (col_name, args) => {
        try {        
             return await col_name.aggregate(args);
         } catch (err) {
             throw new Error(err);
         }
    }

    this.filterData = async (col_name, args, returnagrs, limit=100, offset=1, sortarg='{_id:-1}') => {
        try {        
             return await col_name.find(args, returnagrs).sort(sortarg).limit(limit).skip(offset);
         } catch (err) {
             throw new Error(err);
         }
    }

    this.updateMany = async (col_name, condition, updateargs) => {
        try {
            return await col_name.updateMany(condition, updateargs)
        } catch (err) {
            throw new Error(err);
        }
    }

    this.updateGivenArgs = async (col_name, condition, args, returndata='{ new: true }') => {
        try {
            return await col_name.findOneAndUpdate(condition, args, returndata)
        } catch (err) {
            throw new Error(err);
        }
    }

    this.updateorinsert = async (col_name, condition, args) => {
        try {
            return await col_name.findOneAndUpdate(condition, args, { new: true, upsert: true  })
        } catch (err) {
            throw new Error(err);
        }
    }
}