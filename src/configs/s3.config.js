'use strict'

const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY
    }
})

module.exports = {s3Client, PutObjectCommand, GetObjectCommand}