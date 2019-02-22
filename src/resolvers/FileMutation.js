import { uploadToS3 } from '../utils/fileApi'

const FileMutation = {
  async uploadFile(parent, { folder, file }, { prisma }, info) {
		const s3URL = await uploadToS3(prisma, folder, file)
		return s3URL
	},

	async uploadFiles(parent, { folder, files }, { prisma }, info) {
		const s3URLs = await Promise.all(files.map(file => uploadToS3(prisma, folder, file)))
		return s3URLs
	},
}

export { FileMutation as default }