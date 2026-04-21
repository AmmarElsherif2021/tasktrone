/* eslint-disable react/prop-types */
import { useState, useRef } from 'react'
import Draggable from 'react-draggable'
import { Modal } from '../../Ui/Modal'

export const ImageUpload = ({ onImageSelect, previewUrl }) => {
  const [preview, setPreview] = useState(previewUrl)
  const [showModal, setShowModal] = useState(false)
  const [bounds, setBounds] = useState({ top: 0, left: 0, bottom: 0, right: 0 })
  const imageRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        onImageSelect(file)
      }
      reader.readAsDataURL(file)
      setShowModal(true)
    }
  }

  const handleModalClose = () => setShowModal(false)

  const handleDragStart = () => {
    const img = imageRef.current
    if (img) {
      const rect = img.getBoundingClientRect()
      const frame = document.getElementById('image-frame').getBoundingClientRect()
      setBounds({
        left: -(rect.width - frame.width),
        top: -(rect.height - frame.height),
        right: 0,
        bottom: 0,
      })
    }
  }

  return (
    <div className="text-center mb-3">
      {preview && (
        <>
          <img
            src={preview}
            className="mb-3"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: 'var(--border-width-base) solid var(--color-card-border)',
            }}
            alt="Profile"
          />

          <Modal isOpen={showModal} onClose={handleModalClose} title="Adjust Profile Picture">
            <div
              id="image-frame"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                margin: '0 auto',
                border: 'var(--border-width-base) solid var(--color-card-border)',
              }}
            >
              <Draggable bounds={bounds} onStart={handleDragStart}>
                <img
                  ref={imageRef}
                  src={preview}
                  style={{
                    cursor: 'move',
                    width: 'auto',
                    height: '200%',
                    position: 'relative',
                  }}
                  alt="Profile Preview"
                />
              </Draggable>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" className="btn-cold" onClick={handleModalClose}>
                Done
              </button>
            </div>
          </Modal>
        </>
      )}

      <label className="btn-cold inline-block cursor-pointer">
        {preview ? 'Change Profile Picture' : 'Upload Profile Picture'}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  )
}

export default ImageUpload