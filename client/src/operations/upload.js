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
      }
    `
  }
}

export const UPLOAD_FILE_OP = gql`
  mutation uploadFile($folder: String, $file: Upload!) {
    uploadFile(folder: $folder, file: $file)
    {
      ...FileInfo
    }
  }
  ${uploadOps.fragments.fileInfo}
`