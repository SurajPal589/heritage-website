import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { uploadFile } from '../lib/api';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Unsupported format '.${ext}'. Please upload JPG, PNG, WEBP, or PDF files.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage('File size exceeds the 50 MB threshold. Please upload an optimized archive.');
      return;
    }

    setSelectedFile(file);

    // Create thumbnail preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(20);
    setErrorMessage(null);

    try {
      // Simulate visual upload progress
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 80 ? prev + 20 : prev));
      }, 150);

      const response = await uploadFile(selectedFile);
      clearInterval(progressTimer);
      setUploadProgress(100);

      // Redirect immediately to AI Processing Centre with the job UUID
      setTimeout(() => {
        navigate(`/processing?job=${response.job_uuid}`);
      }, 300);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || 'File upload failed');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-heritage-sandstone/30 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta">
          Archival Ingestion Pipeline
        </span>
        <h1 className="text-2xl sm:text-3xl font-heritage font-bold text-heritage-dark mt-1">
          Digitise Historical Document
        </h1>
        <p className="text-xs text-heritage-navy/70 mt-1">
          Upload unstructured field surveys, ancient manuscript folios, or architectural photographs for OCR extraction and metadata generation.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-heritage-sandstone/40 shadow-sm space-y-6">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center
            ${dragActive 
              ? 'border-heritage-gold bg-heritage-cream/40 scale-[1.01]' 
              : 'border-heritage-sandstone/70 hover:border-heritage-gold hover:bg-heritage-cream/20 bg-heritage-cream/10'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-heritage-navy text-heritage-gold flex items-center justify-center shadow-md mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="font-heritage font-bold text-lg text-heritage-dark">
            {selectedFile ? 'Change Selected Document' : 'Drag & Drop Archival Record'}
          </h3>
          <p className="text-xs text-heritage-navy/70 mt-1 max-w-sm">
            Supported formats: <strong className="text-heritage-dark">PDF, JPG, PNG, WEBP</strong> (up to 50 MB)
          </p>

          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-xl bg-heritage-sandstone/40 hover:bg-heritage-sandstone/60 text-heritage-dark text-xs font-semibold transition"
          >
            Browse Local Files
          </button>
        </div>

        {/* Selected File Card & Preview */}
        {selectedFile && (
          <div className="p-5 rounded-2xl bg-heritage-cream/40 border border-heritage-sandstone/50 space-y-4">
            <div className="flex items-center space-x-4">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Document Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-heritage-sandstone/60 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-heritage-navy text-heritage-terracottaLight flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-heritage-dark truncate">
                    {selectedFile.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-heritage-navy text-heritage-gold">
                    {selectedFile.name.split('.').pop()}
                  </span>
                </div>
                <div className="text-[11px] text-heritage-navy/60 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for OCR pipeline
                </div>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-heritage-navy/70 font-medium">
                  <span>Uploading to archive repository...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-heritage-sandstone/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-heritage-terracotta transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Launch Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isUploading}
                onClick={handleUploadSubmit}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracottaLight text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <span>{isUploading ? 'Ingesting File...' : 'Proceed to AI Processing'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Archival Standards Guide */}
      <div className="p-6 rounded-2xl bg-heritage-parchment border border-heritage-sandstone/40 space-y-3">
        <div className="flex items-center space-x-2 text-heritage-terracotta">
          <Info className="w-4 h-4" />
          <h4 className="font-heritage font-bold text-xs uppercase tracking-wider">
            Recommendations for Optimal Extraction
          </h4>
        </div>
        <ul className="text-xs text-heritage-navy/70 space-y-1.5 list-disc list-inside">
          <li><strong>Resolution:</strong> For scanned manuscripts or inscriptions, 300 DPI yields optimal OCR character confidence.</li>
          <li><strong>PDF Multi-page:</strong> Multi-page field survey reports will be processed page-by-page.</li>
          <li><strong>Languages:</strong> Native support for English, Sanskrit, and Hindi in Devanagari script.</li>
        </ul>
      </div>

    </div>
  );
};

