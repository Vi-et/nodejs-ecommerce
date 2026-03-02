'use strict'

const Comment = require('../models/comment.model');
const { getProductById } = require('../models/repositories/product.repo');

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

    static async getCommentsByParentId({
        productIdu      ,
        parentId = null,
        limit = 50,
        offset = 0
    }){
        if(parentId){
            // Lấy tất cả comment con/cháu của parentId (dùng Nested Set Model)
            const parentComment = await Comment.findById(parentId);
            if(!parentComment){
                throw new Error('Parent comment not found')
            }
            const comments = await Comment.find({
                comment_productId: productId,
                comment_left: {$gt: parentComment.comment_left},   // $gt: không lấy chính parent
                comment_right: {$lt: parentComment.comment_right},  // $lt: không lấy chính parent
                isDeleted: false
            }).sort({comment_left: 1}).lean().exec();
            return comments;
        }

        // Lấy tất cả root comment (không có parent)
        const comments = await Comment.find({
            comment_productId: productId,
            comment_parentId: null   // null: chỉ lấy root comments
        }).sort({comment_left: 1}).lean().exec();

        return comments;
    }

    static async deleteComment({commentId, productId}){
        const foundProduct = await getProductById(productId);
        if(!foundProduct){
            throw new Error('Product not found')
        }

        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new Error('Comment not found')
        }

        
    }
}

module.exports = CommentService