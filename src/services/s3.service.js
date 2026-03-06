const {s3Client, PutObjectCommand, GetObjectCommand} = require('../configs/s3.config')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const uploadImageS3 = async ({file}) => {
    try{
        const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: 'image/jpeg',
    })

    // You deleted the logic to send the upload request here! You need it first before you can fetch the image.
    await s3Client.send(command)

    const urlGet = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
    })
    const url = await getSignedUrl(s3Client, urlGet, { expiresIn: 60 * 60 * 24 * 7 })
    return url
    }catch(error){
        console.log(error)
    }
    
}

module.exports = {uploadImageS3}