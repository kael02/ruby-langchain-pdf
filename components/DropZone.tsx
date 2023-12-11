import Image from "next/image";
import { useState } from "react";
// import styles from "../styles/DropZone.module.css";
import styles from "../app/styles/DropZone.module.css";
import FilePreview from "./FilePreview";

const DropZone = ({ data, dispatch }: { data: any; dispatch: any }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let files = [...e.dataTransfer.files];

    if (files && files.length > 0) {
      dispatch({ type: "ADD_FILE", file: files[0] });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    }
  };

  const handleFileSelect = async (e: any) => {
    let files = [...e.target.files];

    console.log("event", e.target.files);

    if (files && files.length > 0) {
      await dispatch({ type: "ADD_FILE", file: files[0] });
      // await uploadFiles();
      // setIsUploaded(true);
    }
  };

  const uploadFiles = async () => {
    // let files = data.fileList;

    setIsUploading(true);

    let file = data.file;

    const formData = new FormData();
    // files.forEach((file) => formData.append('files', file));

    formData.append("file", file);

    const response = await fetch("/api/process-pdf", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsUploaded(true);
    } else {
      alert("Error uploading files");
    }

    setIsUploading(false);
  };

  return (
    <>
      <div
        className={styles.dropzone}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <Image src="/upload.svg" alt="upload" height={50} width={50} />

        <input
          id="fileSelect"
          type="file"
          className={styles.files}
          onChange={handleFileSelect}
          accept=".pdf"
        />
        <label htmlFor="fileSelect">You can select Files</label>

        <h3 className={styles.uploadMessage}>
          or drag &amp; drop your files here
        </h3>
      </div>

      {data.file !== null && <FilePreview fileData={data.file} />}
      {data.file !== null && (
        <button className="btn btn-sm m-2 btn-accent" onClick={uploadFiles}>
          {isUploaded ? "Uploaded" : "Upload"}
          {isUploading && <span className="loading loading-spinner"></span>}
        </button>
      )}
    </>
  );
};

export default DropZone;
