import gql from 'graphql-tag'

const uploadOps = {
  fragments: {
    fileInfo: gql`
      fragment FileInfo on File {
        id
        createdAt
        updatedAt
        filename
        mimetype
        encoding
        url
        project {
          id
        }
      }
    `
  }
}

export const UPLOAD_FILE_OP = gql`
  mutation uploadFile($folder: String, $file: Upload!, $projectId: String) {
    uploadFile(folder: $folder, file: $file, projectId: $projectId) {
      ...FileInfo
    }
  }
  ${uploadOps.fragments.fileInfo}
`

export const UPLOAD_FILES_OP = gql`
  mutation uploadFiles($folder: String, $files: [Upload!]!, $projectId: String) {
    uploadFile(folder: $folder, files: $files, projectId: $projectId) {
      ...FileInfo
    }
  }
  ${uploadOps.fragments.fileInfo}
`

export const DELETE_FILE_OP = gql`
  mutation deleteFile($where: FileWhereUniqueInput!) {
    deleteFile(where: $where) {
      ...FileInfo
    }
  }
  ${uploadOps.fragments.fileInfo}
`
