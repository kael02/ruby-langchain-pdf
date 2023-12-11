import type { Message } from "ai/react";

export function ChatMessageBubble(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];
}) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";

  const prefix = props.message.role === "user" ? "🧑" : props.aiEmoji;

  const chatPosition =
    props.message.role === "user" ? "chat-end" : "chat-start";

  const chatColor = props.message.role === "user" ? "chat-bubble-info" : "";

  return (
    <div className={`rounded flex-col mb-2 flex`}>
      <div className={`chat ${chatPosition}`}>
        <div className="chat-header capitalize flex flex-col">
          {props.message.role}
        </div>
        <div className={`chat-bubble text-left ${chatColor}`}>
          {props.message.content}
        </div>
      </div>
    </div>
  );
}

// // <div
// //   className={`${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`}
// // >
// //   <div className="mr-2">{prefix}</div>
// //   <div className="flex flex-col">
//     /* <span>{props.message.content}</span> */
//     /* {props.sources && props.sources.length ? <>
//       <code className="mt-4 mr-auto px-2 py-1 rounded">
//         <h2>
//           🔍 Sources:
//         </h2>
//       </code>
//       <code className="mt-1 mr-2 px-2 py-1 rounded text-xs">
//         {props.sources?.map((source, i) => (
//           <div className="mt-2" key={"source:" + i}>
//             {i + 1}. &quot;{source.pageContent}&quot;{
//               source.metadata?.loc?.lines !== undefined
//                 ? <div><br/>Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}</div>
//                 : ""
//               }
//           </div>
//         ))}
//       </code>
//     </> : ""} *
// //   </div>
// // </div>
