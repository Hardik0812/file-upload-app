import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineFile, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import "./FileUploader.css";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(2), // File size in KB
        id: `${file.name}-${Date.now()}`, // Unique ID
      })),
    ]);
  }, []);

  const removeFile = (fileId) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const saveFiles = async () => {
    if (files.length === 0) {
      toast.warn("No files to save. Please upload files first.", {
        position: "top-right",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate API call success
      toast.success("Files saved successfully!", {
        position: "top-right",
      });

      // Clear files after successful save
      setFiles([]);
    } catch (error) {
      console.log("error: ", error);
      // Simulate API call failure
      toast.error("Failed to save files. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*, .pdf, .doc, .docx",
  });

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop some files here, or click to select files</p>
        )}
      </div>

      <div className="file-list">
        {files.length > 0 && (
          <>
            <ul>
              {files.map(({ name, size, id }) => (
                <li key={id} className="file-item fade-in-up">
                  <div className="file-info">
                    <AiOutlineFile className="file-icon" />
                    <span>{name}</span>
                    <span className="file-size">({size} KB)</span>
                  </div>
                  <AiOutlineDelete
                    className="remove-icon"
                    onClick={() => removeFile(id)}
                    title="Remove file"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          className={`save-btn ${isSaving ? "disabled" : ""}`}
          onClick={saveFiles}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Files"}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
