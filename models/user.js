const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    fullName :{
        type: String,
        required : true,
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    salt :{
        type: String,
    },
    password :{
        type: String,
        required: true,
    },
    profileImgURL :{
        type: String,
        default: "/images/default.png"
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }
},{timestamps: true});

userSchema.pre("save", async function (next) {
    const user = this;
    if(!user.isModified()) return;
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(13);
        user.salt = salt;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
      } catch (error) {
        next(error);
      }
})
const User = model('user', userSchema);

module.exports = User