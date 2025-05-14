'use strict'

const pick = require('lodash/pick')

const getInfoData = ({fields = [], object = {}}) => {
   return pick(object, fields)
}

const getSelectData = (select = []) => {
   return Object.fromEntries(select.map(el => [el, 1]))
}

const getUnSelectData = (unSelect = []) => {
   return Object.fromEntries(unSelect.map(el => [el, 0]))
}

const removeUndefinedObject = (object) => {
   Object.keys(object).forEach((key) => {
      if (object[key] === undefined || object[key] === null) {
         delete object[key]
      }
   })
   return object
}

const updateNestedObjectParser = (object) => {
   const final = {}
   Object.keys(object).forEach((key) => {
      if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
         const response = updateNestedObjectParser(object[key])
         Object.keys(response).forEach((a) => {
            final[`${key}.${a}`] = response[a]
         })
      }
      else {
         final[key] = object[key]
      }
   })
   return final
}

module.exports = {
   getInfoData,
   getSelectData,
   getUnSelectData,
   removeUndefinedObject,
   updateNestedObjectParser,

}