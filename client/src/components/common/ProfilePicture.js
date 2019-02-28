import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactCrop from 'react-image-crop'
import Modal from './Modal'
import 'react-image-crop/dist/ReactCrop.css'
import logger from '../../utils/logger'
import { withApollo } from 'react-apollo'
import { UPLOAD_FILE_OP } from '../../operations/upload'
import ButtonPrimary from './ButtonPrimary'
import Upload from './Upload'
import { parseServerErrors } from '../../utils/errors'
import { startUpdateUser } from '../../actions/user'

class ProfilePicture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      reader: null,
      src: null,
      crop: {
        aspect: 1,
        width: 90,
        x: 0,
        y: 0,
      },
      imageUrl: this.props.srcURL,
      isUploading: false,
      uploadError: '',
    }
  }

  handleOpenModal = () => {
    this.setState(() => ({ modalVisible: true }))
  }

  handleCloseModal = () => {
    this.setState(() => ({ modalVisible: false }))
  }

  getCroppedImg = (image, pixelCrop, fileName) => {
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'))
          logger.error('Canvas is empty')
          return
        }
        blob.name = fileName
        window.URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = window.URL.createObjectURL(blob)
        resolve({ file: blob, url: this.fileUrl })
      }, 'image/jpeg')
    })
  }

  onSelectFile = e => {
    const { files } = e.target
    if (files && files.length > 0) {
      const reader = new FileReader()

      reader.addEventListener('load', () =>
        this.setState(() => ({ src: reader.result })),
      )

      reader.readAsDataURL(files[0])

      // Save reader on state for removeEventListner
      this.setState(() => ({ reader }))
    }
  }

  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image
  }

  onCropComplete = (crop, pixelCrop) => {
    this.makeClientCrop(crop, pixelCrop)
  }

  onCropChange = crop => {
    this.setState(() => ({ crop }))
  }

  makeClientCrop = async (crop, pixelCrop) => {
    const { username } = this.props.user
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        `${username}.jpg`,
      )
      this.setState(() => ({ croppedImage }))
    }
  }

  handleUpdatePicture = async (file) => {
    const { client, user, startUpdateUser } = this.props
    const { email } = user

    this.setState(() => ({ isUploading: true }))

    try {
      // First upload to S3
      const fileUploadData = await client.mutate({
        mutation: UPLOAD_FILE_OP,
        variables: {
          folder: 'images/profile',
          file,
        }
      })
      const { url } = fileUploadData.data.uploadFile
      // logger.info('S3 url from upload', url)

      // Update the User picture URL
      await startUpdateUser(client, email, { picture: url })

      this.setState(() => ({ imageUrl: url }))

      this.handleCloseModal()
    } catch (errors) {
      const errorMessage = parseServerErrors(errors)
      this.setState(() => ({ uploadError: errorMessage }))
    }
    this.setState(() => ({ isUploading: false }))
  }

  componentWillUnmount() {
    const { reader } = this.state
    if (reader) { reader.removeEventListner('load') }
  }

  render() {
    const {
      isEditable = false,
      width = 160,
      height = 160,
      user,
    } = this.props
    const { imageUrl, crop, croppedImage, src, isUploading, uploadError } = this.state
    const { name } = user

    return (
      <Fragment>
        <div><img src={imageUrl} alt={`Profile of ${name}`} style={{ width: `${width}px`, height: `${height}px` }} /></div>
        {isEditable && <ButtonPrimary onClick={this.handleOpenModal}>Update Image</ButtonPrimary>}

        <Modal
          visible={this.state.modalVisible}
        >
          {src && (
            <ReactCrop
              src={src}
              crop={crop}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}

          <Upload onChange={this.onSelectFile}>Pick image</Upload>

          <ButtonPrimary onClick={e => this.handleUpdatePicture(croppedImage.file)} disabled={isUploading}>Done</ButtonPrimary>
          {isUploading && <span>Uploading...</span>}
          {uploadError}
          <ButtonPrimary onClick={this.handleCloseModal}>Cancel</ButtonPrimary>
        </Modal>
      </Fragment>
    )
  }
}

ProfilePicture.propTypes = {
  isEditable: PropTypes.bool,
  srcURL: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
}

const mapStateToProps = state => ({
  user: state.user
})

export default withApollo(connect(mapStateToProps, { startUpdateUser })(ProfilePicture))