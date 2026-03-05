'use strict';
const { OK } = require('../core/success.response');
const { uploadImageFromUrl, uploadImageFromLocal, uploadImagesFromLocal } = require('../services/upload.service');

class UploadController {

    uploadImage = async (req, res, next) => {
        new OK({
            message: "Upload image successfully",
            metadata: await uploadImageFromUrl(),
        }).send(res);
    }

    uploadImageLocal = async (req, res, next) => {
        const {file} = req
        if(!file) throw new Error('File not found')
        new OK({
            message: "Upload image successfully",
            metadata: await uploadImageFromLocal({path: file.path}),
        }).send(res);
    }

    uploadImagesLocal = async (req, res, next) => {
        const {files} = req
        if(!files || files.length === 0) throw new Error('Files not found')
        new OK({
            message: "Upload multiple images successfully",
            metadata: await uploadImagesFromLocal({files}),
        }).send(res);
    }

}

module.exports = new UploadController();