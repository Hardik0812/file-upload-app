import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineFile, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import "./FileUploader.css";

const FileUploader = () => {
  const [file, setFile] = useState(null); // Single file state
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0); // Loader progress state

  // Handle the beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isSaving) {
        event.preventDefault();
        event.returnValue =
          "File upload is in progress. Are you sure you want to leave?";
      }
    };

    if (isSaving) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSaving]);

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
    setProgress(1);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1; // Increment by 1 for slower progress
      });
    }, 200); // 200ms interval for smoother and slower updates

    try {
      const formData = new FormData();
      formData.append("file", file.file);

      const response = await fetch(
        "https://file-upload-api-112857677948.us-central1.run.app/upload",
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
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsSaving(false);
        setProgress(0);
      }, 500);
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

        {/* Show loading line when saving */}
        {isSaving && <div className="loading-line"></div>}

        <button
          className={`save-btn ${isSaving ? "disabled" : ""}`}
          onClick={saveFiles}
          disabled={isSaving || !file}
        >
          {isSaving ? `Saving... ${progress}%` : "Upload File"}
        </button>

        {isSaving && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
