// import { useReducer } from "react";
// import DropZone from "../components/DropZone";

// const FileUploader = () => {
//   const reducer = (state: any, action: any) => {
//     switch (action.type) {
//       case "SET_IN_DROP_ZONE":
//         return { ...state, inDropZone: action.inDropZone };
//       case "ADD_FILE":
//         console.log("action", action);
//         return { ...state, file: action.file };
//       default:
//         return state;
//     }
//   };

//   const [data, dispatch] = useReducer(reducer, {
//     inDropZone: false,
//     file: null,
//   });

//   return <DropZone data={data} dispatch={dispatch} />;
// };

// export default FileUploader;

import { FC, useState } from "react";
import toast from "react-hot-toast";

interface FileUploaderProps {
  onUploadFinished?: () => void;
}

const FileUploader: FC<FileUploaderProps> = ({ onUploadFinished }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File>();

  // Handle file upload event
  const uploadFile = async (event: any) => {
    console.log("event", event.target);

    if (!file) {
      console.error("file is empty");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    console.log("file", file);

    const response = await fetch("/api/chat/process-pdf", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("process pdf api");
      toast.success("File uploaded");
      setIsUploading(false);
      if (onUploadFinished) {
        onUploadFinished();
      }
    } else {
      toast.error("Error uploading file");
    }
  };

  const handleFileSelect = async (e: any) => {
    let files = [...e.target.files];

    console.log("event", e.target.files);

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-8">
        <input
          type="file"
          onChange={handleFileSelect}
          className="file-input file-input-bordered file-input-info w-full max-w-xs"
        />
        <button onClick={(e) => uploadFile(e)} className="btn btn-info">
          {isUploading ? "Uploading" : "Upload"}
          {isUploading && <span className="loading loading-spinner"></span>}
        </button>
      </div>
    </>
  );
};

export default FileUploader;

// <div>
//   <input
//     id="fileSelect"
//     type="file"
//     onChange={handleFileSelect}
//     accept=".pdf"
//   />

//   <button className="btn btn-sm m-2 btn-accent" onClick={uploadFile}>
//     Upload
//   </button>
// </div>
