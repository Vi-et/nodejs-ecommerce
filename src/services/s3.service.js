const {s3Client, PutObjectCommand} = require('../configs/s3.config')
const {getSignedUrl} = require('@aws-sdk/cloudfront-signer')
const cloudFrontUrl = 'd1ayvk1bqe4nyr.cloudfront.net'
const dateLessThan = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // 1 days

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

    const signedUrl = getSignedUrl({
  url: `https://${cloudFrontUrl}/${file.originalname}`,
  keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
  dateLessThan,
  privateKey : process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
});

    return signedUrl
    }catch(error){
        console.log(error)
    }
    
}

module.exports = {uploadImageS3}