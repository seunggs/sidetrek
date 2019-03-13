import * as R from 'ramda'
import uuid from 'uuid/v4'
import aws from 'aws-sdk'
import { AWS_BUCKET, AWS_ENDPOINT } from './constants'

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    Bucket: AWS_BUCKET
  },
  endpoint: new aws.Endpoint(AWS_ENDPOINT)
})

export const uploadToS3 = async (prisma, folder, file, projectId) => {
  if (!file) { 
    console.log('ERROR: No file received.')
    return
  }

  const { createReadStream, filename, mimetype, encoding } = await file
  const key = (folder ? `${folder}/` : '') + `${uuid()}-${filename}`

  // Upload to S3
  const response = await s3.upload({
    Key: key,
    ACL: 'public-read',
    Body: createReadStream()
  }).promise()

  const url = response.Location

  // Sync with Prisma
  const baseData = {
    filename,
    mimetype,
    encoding,
    url,
  }
  const data = projectId ? R.merge(baseData, {
    project: {
      connect: {
        id: projectId
      }
    }
  }) : baseData

  const fileInPrisma = await prisma.mutation.createFile({ data })

  return fileInPrisma
}

export const deleteFromS3 = async (prisma, url) => {
  // Get the key (filename) from the url
  const key = decodeURIComponent(R.compose(R.last, R.split('amazonaws.com/'))(url))

  // Delete from S3
  const response = await s3.deleteObject({
    Bucket: AWS_BUCKET,
    Key: key,
  }).promise()

  // Delete in Prisma
  const fileInPrisma = await prisma.mutation.deleteFile({
    where: {
      url
    }
  })
  return fileInPrisma
}