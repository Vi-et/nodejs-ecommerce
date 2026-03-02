'use strict'

const Comment = require('../models/comment.model')

class CommentService {
 
    static async createComment({
        productId, userId, content, parentId = null
    })
    {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentId
        })

        let rightValue = 0;
        if(parentId){
            const parentComment = await Comment.findById(parentId);
            if(!parentComment){
                throw new Error('Parent comment not found')
            }
            rightValue = parentComment.comment_right 
            
            await Comment.updateMany({
                comment_productId: productId,
                comment_right: {$gte: rightValue}
            }, {
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_productId: productId,
                comment_left: {$gt: rightValue}
            }, {
                $inc: {comment_left: 2}
            })

            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
        }else{
            const maxRightValue = await Comment.findOne({
                comment_productId: productId
            }).sort({comment_right: -1}).lean().exec();

            rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1;

            comment.comment_left = rightValue;
            comment.comment_right = rightValue + 1;
        }

        return await comment.save();
    }  
}

module.exports = CommentService