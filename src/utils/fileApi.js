import uuid from 'uuid/v4'
import aws from 'aws-sdk'
import logger from '../../client/src/utils/logger'

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    Bucket: 'sidetrek'
  },
  endpoint: new aws.Endpoint('https://s3.us-west-1.amazonaws.com')
})

export const uploadToS3 = async (prisma, folder, file) => {
  if (!file) { 
    logger.error('ERROR: No file received.')
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
  const data = {
    filename,
    mimetype,
    encoding,
    url,
  }

  const fileInPrisma = await prisma.mutation.createFile({ data })

  logger.info('Saved prisma file:')
  logger.info(fileInPrisma)

  return fileInPrisma
}