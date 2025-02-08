const {Schema, model} = require("mongoose");

const CommentSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    blogID: {
        type: Schema.Types.ObjectId,
        ref: "blog"
    }
},{timestamps: true});

const comments = model('comments', CommentSchema);

module.exports = comments;

