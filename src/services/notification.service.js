'use strict';
const Notification = require('../models/notification.model');

const pushNotiToSystem = async({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content

    if(type === 'SHOP-001'){
        noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`
    }else if(type === 'PROMOTION-001'){
        noti_content = `@@@ vừa mới thêm một voucher: @@@@`
    }

    const newNoti = new Notification({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receivedId: receivedId,
        noti_options: options
    })

    await newNoti.save()

    return newNoti  
}


const listNotiByUser = async({userId, type = 'ALL', limit = 50, offset = 0, isRead = false }) => {
    const query = { noti_receivedId: userId }
    if(type !== 'ALL'){
        query.noti_type = type
    }
    return await Notification.aggregate([
        {
            $match: query
        },
        {
            $project: {
                noti_type: 1,
                noti_content: 1,
                noti_senderId: 1,
                noti_receivedId: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
        ,
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: offset
        },
        {
            $limit: limit
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}