const { Router } = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const router = Router();

router
    .get("/signin", (req, res) => {
        return res.render("signin");
    })
    .get("/signup", (req, res) => {
        return res.render("signup");
    })
    .post("/signup", async (req, res) => {
        const { fullName, email, password } = req.body;
        try {
            await User.create({
                fullName,
                email,
                password
            });
            return res.redirect("/");
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).send("Internal Server Error");
        }
    })
    .post("/signin", async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).send("Invalid email or password");
            }

            // Compare provided password with stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send("Invalid email or password");
            }

            // Store user session (if using sessions)
            // req.session.user = user;

            return res.redirect("/");
        } catch (error) {
            console.error("Error signing in:", error);
            return res.status(500).send("Internal Server Error");
        }
    });

module.exports = router;
