const express = require("express");
const multer  = require('multer');
const path = require("path");

const Blog = require("../models/blog.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`)); 
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  })
  
const upload = multer({ storage: storage })

const router = express.Router();

router
    .get('/add-new',(req,res)=>{
        return res.render('addBlog');
    })
    .post('/', upload.single('coverImage'), async (req,res) => {
        const { title, body } = req.body;
        const blog = await Blog.create({
            title: title,
            body: body,
            coverImageURL: `uploads/${req.file.filename}`, // Corrected field name
            createdBy: req.user._id
        });
        return res.redirect(`/blog/${blog._id}`);
    })
    .get('/:id', async (req, res) => {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        return res.render('blogDetail', { blog });
    });

module.exports = router;
