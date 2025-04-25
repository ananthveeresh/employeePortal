const db = require("../model");
const reportlayouts = db.reportlayouts;
require("../config/dbclass")();


module.exports = {
    create: async (req, res, next) => {
        try {
            const result = await createData(reportlayouts, req.body);
            res.status(201).send(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAll: async (req, res, next) => {
        try {
            const layouts = await readData(reportlayouts, {});
            res.status(200).send(layouts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getCategoryWise: async (req, res, next) => {
        try {
            const layout = await readData(reportlayouts, {exam_category:req.params.name});
            if (!layout) {
                return res.status(404).json({ error: 'Layout not found' });
            }
            res.status(200).send(layout);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getCategoryandInst: async (req, res, next) => {
        try {
            const layout = await readData(reportlayouts, {exam_category:req.params.name, institute:req.params.inst});
            if (!layout) {
                return res.status(404).json({ error: 'Layout not found' });
            }
            res.status(200).send(layout);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getOne: async (req, res, next) => {
        try {
            const layout = await readData(reportlayouts, {grade:req.params.grade, exam_category:req.params.examcategory});
            if (!layout) {
                return res.status(404).json({ error: 'Layout not found' });
            }
            res.status(200).send(layout);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: async (req, res, next) => {
        try {
            const layout = await updateData(reportlayouts, req.params.id, req.body);
            if (!layout) {
                return res.status(404).json({ error: 'Layout not found' });
            }
            res.status(200).send(layout);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getLayoutInfo: async (req, res, next) => {
        try {
            const layout = await readData(reportlayouts, {layout_html_file:req.params.layouthtml});
            if (!layout) {
                return res.status(404).json({ error: 'Layout not found' });
            }
            res.status(200).send(layout);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};