"use client";
import ChatPopup from "@/components/ChatPopup";
import FileUploader from "@/components/FileUploader";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteData = async () => {
    setIsDeleting(true);
    const response = await fetch("/api/clear-supabase", {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("process pdf api");
      setIsDeleting(false);
      toast.success("Data deleted");
    } else {
      setIsDeleting(false);
      toast.error("Error deleting data");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
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
      <button onClick={deleteData} className="btn btn-ghost justify-self-end">
        {!isDeleting ? "Delete data" : "Deleting"}
        {isDeleting && <span className="loading loading-spinner"></span>}
      </button>
    </div>
  );
  // const InfoCard = (
  //   <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
  //     <h1 className="text-3xl md:text-4xl mb-4">
  //       ▲ Next.js + LangChain.js 🦜🔗
  //     </h1>
  //     <ul>
  //       <li className="hidden text-l md:block">
  //         🎨
  //         <span className="ml-2">
  //           The main frontend logic is found in <code>app/page.tsx</code>.
  //         </span>
  //       </li>
  //       <li className="text-l">
  //         🐙
  //         <span className="ml-2">
  //           This template is open source - you can see the source code and
  //           deploy your own version{" "}
  //           <a
  //             href="https://github.com/langchain-ai/langchain-nextjs-template"
  //             target="_blank"
  //           >
  //             from the GitHub repo
  //           </a>
  //           !
  //         </span>
  //       </li>
  //       <li className="text-l">
  //         👇
  //         <span className="ml-2">
  //           Try asking e.g. <code>What is it like to be a pirate?</code> below!
  //         </span>
  //       </li>
  //     </ul>
  //   </div>
  // );
  // return (
  //   <ChatWindow
  //     endpoint="api/chat"
  //     emoji="🏴‍☠️"
  //     titleText="Patchy the Chatty Pirate"
  //     placeholder="I'm an LLM pretending to be a pirate! Ask me about the pirate life!"
  //     emptyStateComponent={InfoCard}
  //   ></ChatWindow>
  // );
}
