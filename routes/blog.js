const express = require("express");
const multer  = require('multer');
const path = require("path");

const Blog = require("../models/blog.js");
const comments = require("../models/comments.js");

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
            coverImageURL: `uploads/${req.file.filename}`, 
            createdBy: req.user._id
        });
        return res.redirect(`/blog/${blog._id}`);
    })
    .get('/:id', async (req, res) => {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const Comments = await comments.find({ blogID: req.params.id }).populate("createdBy");
        if (!blog) {
            return res.status(404).send("Blog not found");
        }
        return res.render('blogDetail', {
             blog ,
             user: req.user,
             Comments,
         });
    })
    .post('/comment/:blogID' , async (req,res) =>{
        try {
            console.log("Blog ID received:", req.params.blogID); // Log the blog ID
            const blog = await Blog.findById(req.params.blogID);

            if(!blog) res.send("Blog either deleted or not found");
            const Comment = await comments.create({
                content : req.body.content,
                blogID : req.params.blogID,
                createdBy : req.user._id
            });
            return res.redirect(`/blog/${req.params.blogID}`);

        }
        catch(err){
            console.log(err);
            return res.redirect("/");
        }
        
    });

module.exports = router;
