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
        hero
        project
      }
    `
  }
}

export const UPLOAD_FILE_OP = gql`
  mutation uploadFile($folder: String, $file: Upload!, $project: Project, $hero: Boolean) {
    uploadFile(folder: $folder, file: $file, project: $project, hero: $hero)
    {
      ...FileInfo
    }
  }
  ${uploadOps.fragments.fileInfo}
`