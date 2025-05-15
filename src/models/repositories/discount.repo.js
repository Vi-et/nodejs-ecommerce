'use strict'
const {getUnSelectData} = require('../../utils')

const findAllDiscountCodesUnselect = async({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model      
})=>{

    const skip = (page - 1) * limit
    const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1}
    const discounts = await model
        .find(filter)
        .select(getUnSelectData(unSelect))
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    return discounts
}

module.exports = {
    findAllDiscountCodesUnselect,
}