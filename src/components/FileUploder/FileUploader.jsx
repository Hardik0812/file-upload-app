import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineFile, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import io from "socket.io-client";
import "./FileUploader.css";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
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
      size: (newFile.size / 1024).toFixed(2),
      id: `${newFile.name}-${Date.now()}`,
    });
  };

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
    setProgress(0);

    // Connect to Socket.IO when starting the upload
    const socket = io("https://your-socket-io-server-url"); // Replace with your server URL

    socket.on("connect", () => {
      console.log("Socket.IO connection established.");
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        socket.emit("upload-file", {
          fileName: file.name,
          fileData: reader.result, // The ArrayBuffer containing the file
        });

        socket.on("upload-progress", (data) => {
          setProgress(data.progress); // Update progress
        });

        socket.on("upload-complete", (data) => {
          const fileLink = data.fileLink;
          const fileName = data.fileName || "New_File.xlsx";

          // Handle file download
          const a = document.createElement("a");
          a.href = fileLink;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();

          toast.success("File uploaded and downloaded successfully!", {
            position: "top-right",
          });

          setFile(null); // Reset file after successful upload
        });

        socket.on("error", (message) => {
          toast.error(message || "An error occurred during file upload.", {
            position: "top-right",
          });
        });
      }
    };

    reader.readAsArrayBuffer(file.file); // Start reading the file as binary data

    // Close the socket after the upload completes
    socket.on("upload-complete", () => {
      socket.close(); // Close the connection once the upload is complete
    });
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
