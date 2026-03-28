import React, { useCallback, useRef } from 'react'
import { Upload, X, Camera } from 'lucide-react'

interface ImageAttachmentProps {
  onImageSelected: (base64: string, imageType: string, file: File) => void
  onRemove?: () => void
  preview?: string
}

export const ImageAttachment: React.FC<ImageAttachmentProps> = ({
  onImageSelected,
  onRemove,
  preview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64String = e.target?.result as string
          onImageSelected(base64String, file.type, file)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelected]
  )

  const handleGalleryClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload from gallery"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Capture from camera"
      />

      {/* Image Preview */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Attached"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-culinary-terracotta/20 shadow-md"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-culinary-terracotta text-white rounded-full p-1 hover:bg-culinary-coral transition-colors"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!preview && (
        <div className="flex gap-2">
          <button
            onClick={handleGalleryClick}
            className="btn-icon-small"
            title="Upload from gallery"
            aria-label="Upload from gallery"
          >
            <Upload size={16} />
          </button>
          <button
            onClick={handleCameraClick}
            className="btn-icon-small"
            title="Capture with camera"
            aria-label="Capture with camera"
          >
            <Camera size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageAttachment
