'use client'

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

interface FileUploaderProps {
  accept: string; // Allowed file types
  maxSize: number; // Maximum file size in bytes
  uploadUrl: string; // API endpoint for file upload
}

const FileUploader: React.FC<FileUploaderProps> = ({ accept, maxSize, uploadUrl }) => {
  const { control, handleSubmit } = useForm();
  const [preview, setPreview] = useState<string | null>(null);
  const [isPDF, setIsPDF] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Mutation for file upload
  const uploadMutation = useMutation({
    mutationKey: ['file-upload'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      return response.json();
    },

    onSuccess: (data: any) => {
      console.log('File uploaded successfully:', data);
    },
    onError: (error: any) => {
      console.error('Error uploading file:', error.message);
    },
  });

  const onFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null);
      setIsPDF(false);
      setSelectedFileName(null);
      return;
    }

    if (file.size > maxSize) {
      alert('File size exceeds the maximum limit.');
      return;
    }

    const isFilePDF = file.type === 'application/pdf';
    setIsPDF(isFilePDF);
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (data: any) => {
    if (!data.file) return;
    uploadMutation.mutate(data.file);
  };

  const handleRemoveFile = () => {
    setPreview(null);
    setIsPDF(false);
    setSelectedFileName(null);
  };

  return (
    <div className="max-w-[350px] max-h-60 mx-auto px-6 py-2 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Upload Files</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col items-center">
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange, onBlur, ref } }) => (
            <>
              {/* Hidden File Input */}
              <input
                type="file"
                accept={accept}
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  onChange(file);
                  onFileChange(file);
                }}
                onBlur={onBlur}
                ref={ref}
                className="hidden"
                id="file-upload"
              />

              {/* Conditionally Render Preview or Upload Area */}
              <div className="w-full min-w-[300px] p-4 border-2 border-dashed border-gray-300 rounded-md text-center relative">
                {!preview ? (
                  <div className='text-center w-full'>
                    <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:underline">
                      Select File here
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Files Supported: {accept}</p>
                    <label
                      htmlFor="file-upload"
                      className="mt-4 inline-block px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="relative flex justify-center items-center">
                    {/* "Remove" button on top right corner */}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-[-20px] right-[-10px] m-2 text-sm text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>

                    <label htmlFor="file-upload" className="cursor-pointer">
                      {!isPDF ? (
                        <img src={preview} alt="Preview" className="max-w-32 max-h-32 rounded-md shadow-md object-contain" />
                      ) : (
                        <p className="text-gray-600 underline">{selectedFileName}</p>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </>
          )}
        />

        {/* Show Upload Button Only if a File is Selected */}
        {selectedFileName && (
          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className={`mt-2 px-4 py-1 text-white bg-green-500 rounded-md shadow-md ${
              uploadMutation.isPending ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-600'
            }`}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </form>
    </div>
  );
};

export default FileUploader;
