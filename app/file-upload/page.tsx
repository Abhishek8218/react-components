import FileUploader from '@/components/fileUploadInput/fileUploadInput'
import React from 'react'

const page = () => {
  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <FileUploader 
        accept="image/*,application/pdf" 
        maxSize={5 * 1024 * 1024} // 5 MB
        uploadUrl="/api/upload"  // Replace with your actual upload URL
      />
    </div>
  )
}

export default page

