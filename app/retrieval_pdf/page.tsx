"use client";
import ChatPopup from "@/components/ChatPopup";
import FileUploader from "@/components/FileUploader";
import { useState } from "react";

export default function RetrievalPdfPage() {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-12">
      <FileUploader
        onUploadFinished={() => {
          console.log("finished");
        }}
      />
      <ChatPopup
        endpoint="api/chat/retrieval_pdf"
        placeholder={"Ask me anything about the document"}
        emoji="🤖"
      />
    </div>
    // <>
    //   <FileUploader />
    //   <ChatWindow
    // endpoint="api/chat/retrieval_pdf"
    // emptyStateComponent={InfoCard}
    // showIngestForm={false}
    // placeholder={
    //   'I\'ve got a nose for finding the right documents! Ask, "What is a document loader?"'
    // }
    // emoji="🐶"
    // titleText="Hi"
    //   ></ChatWindow>
    // </>
  );
}
