import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle2, Loader } from 'lucide-react'

function FileUpload({ onFileSelect, loading, disabled }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }
    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <motion.div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`glass-card p-12 rounded-xl transition-all ${
        isDragActive
          ? 'border-2 border-electric-blue bg-electric-blue bg-opacity-5'
          : 'border-2 border-dashed border-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-electric-blue'}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        disabled={disabled || loading}
        className="hidden"
        id="file-input"
      />

      <label htmlFor="file-input" className="cursor-pointer block">
        <motion.div className="flex flex-col items-center gap-4">
          {loading ? (
            <>
              <Loader className="w-12 h-12 text-electric-blue animate-spin" />
              <p className="text-lg font-semibold">Processing...</p>
            </>
          ) : selectedFile ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="text-center">
                <p className="font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">Ready to analyze</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-electric-blue" />
              <div className="text-center">
                <p className="font-semibold text-lg">Upload Network Traffic Data</p>
                <p className="text-sm text-gray-400">Drag and drop your CSV file or click to browse</p>
              </div>
            </>
          )}
        </motion.div>
      </label>
    </motion.div>
  )
}

export default FileUpload
