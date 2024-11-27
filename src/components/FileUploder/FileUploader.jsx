import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineFile, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import "./FileUploader.css";

const FileUploader = () => {
  const [file, setFile] = useState(null); // Single file state
  const [isSaving, setIsSaving] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      toast.warn("Please upload only one file at a time.", {
        position: "top-right",
      });
      return;
    }

    const newFile = acceptedFiles[0];
    setFile({
      file: newFile,
      name: newFile.name,
      size: (newFile.size / 1024).toFixed(2), // File size in KB
      id: `${newFile.name}-${Date.now()}`, // Unique ID
    });
  }, []);

  const removeFile = () => {
    setFile(null);
    toast.info("File removed.", {
      position: "top-right",
    });
  };

  const saveFiles = async () => {
    if (!file) {
      toast.warn("No file to save. Please upload a file first.", {
        position: "top-right",
      });
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("file", file.file);

      const response = await fetch(
        "https://file-upload-api-three.vercel.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        const message = errorResponse?.detail || "Failed to upload the file";
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file?.id || "New_File"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File saved successfully and downloaded!", {
        position: "top-right",
      });

      setFile(null);
    } catch (error) {
      const errorMessage =
        error.message || "An unexpected error occurred. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*, .pdf, .doc, .docx",
    maxFiles: 1,
  });

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
      </div>

      <div className="file-list">
        {file && (
          <div className="file-item fade-in-up">
            <div className="file-info">
              <AiOutlineFile className="file-icon" />
              <span>{file.name}</span>
              <span className="file-size">({file.size} KB)</span>
            </div>
            <AiOutlineDelete
              className="remove-icon"
              onClick={removeFile}
              title="Remove file"
            />
          </div>
        )}
        <button
          className={`save-btn ${isSaving ? "disabled" : ""}`}
          onClick={saveFiles}
          disabled={isSaving || !file}
        >
          {isSaving ? "Saving..." : "Save File"}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
