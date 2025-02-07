const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.js");
const blogRouter = require("./routes/blog.js");
const {authMiddleware} = require("./middleware/auth");

const Blog = require("./models/blog.js")

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/blog")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.resolve('./public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(authMiddleware);
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", { user: req.user, blogs : allBlogs }); 
});

app.get("/signin", (req, res) => res.redirect("/user/signin"));
app.get("/signup", (req, res) => res.redirect("/user/signup"));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
