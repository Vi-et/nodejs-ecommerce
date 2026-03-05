'use strict'

const {cloudinary} = require('../configs/cloudinary.config')

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://thanhnien.mediacdn.vn/uploaded/congson/2021_09_25/3motquandaithanthoiminhmang_WRTD.jpg?width=500'
        const folderName = 'product'
        const fileName = 'test'

        const result = await cloudinary.uploader.upload(urlImage, { folder: folderName, public_id: fileName })
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

const uploadImageFromLocal = async ({path}) => {
    try {
        const folderName = 'product'
        const fileName = 'test'

        const result = await cloudinary.uploader.upload(path, { folder: folderName, public_id: fileName })
        return result
    } catch (error) {
        console.log(error)
    }
}


const uploadImagesFromLocal = async ({files, folderName = 'product'}) => {
    try {
        if(!files.length) return []
        
        const uploadUrls = await Promise.all(
            files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { folder: folderName })
                return {
                    url: result.secure_url,
                    thumb_url: await cloudinary.url(result.public_id, {
                        height: 500, width: 500, format: 'jpg'
                    })
                }
            })
        )
        return uploadUrls
    } catch (error) {
        console.log(error)
    }
}

module.exports = {uploadImageFromUrl, uploadImageFromLocal, uploadImagesFromLocal}