import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactCrop from 'react-image-crop'
import ReactModal from 'react-modal'
import 'react-image-crop/dist/ReactCrop.css'
import logger from '../../utils/logger'
import { withApollo } from 'react-apollo'
import { UPLOAD_FILE_OP } from '../../operations/upload'
import ButtonPrimary from './ButtonPrimary'
import { parseServerErrors } from '../../utils/errors'
import { startUpdateUser } from '../../actions/user'

class ProfilePicture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
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
    this.setState(() => ({ showModal: true }))
  }

  handleCloseModal = () => {
    this.setState(() => ({ showModal: false }))
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
          logger('Canvas is empty')
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
      // logger('S3 url from upload', url)
      
      // Update the User picture URL
      const updatedUserData = await startUpdateUser(client, email, { picture: url })
      const updatedUser = updatedUserData.data.updateUser
      // logger('updatedUser', updatedUser)

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
    } = this.props
    const { imageUrl, crop, croppedImage, src, isUploading, uploadError } = this.state

    return (
      <Fragment>
        <div><img src={imageUrl} style={{ width: `${width}px`, height: `${height}px` }} /></div>
        {isEditable && <ButtonPrimary onClick={this.handleOpenModal}>Update Image</ButtonPrimary>}

        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Profile Picture Modal"
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
          <div>
            <label htmlFor="file" className="underline">Pick Image</label>
            <input id="file" type="file" onChange={this.onSelectFile} style={{ display: 'none' }} />
          </div>
          <ButtonPrimary onClick={e => this.handleUpdatePicture(croppedImage.file)} disabled={isUploading}>Done</ButtonPrimary>
          {isUploading && <span>Uploading...</span>}
          {uploadError}
          <ButtonPrimary onClick={this.handleCloseModal}>Cancel</ButtonPrimary>
        </ReactModal>
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