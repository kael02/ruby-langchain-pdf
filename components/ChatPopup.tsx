"use client";
import { Dialog, Transition } from "@headlessui/react";
import { useChat } from "ai/react";
import { AgentStep } from "langchain/schema";
import { FC, FormEvent, Fragment, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { IntermediateStep } from "./IntermediateStep";

interface ChatPopupProps {
  endpoint: string;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}

const ChatPopup: FC<ChatPopupProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    endpoint,
    placeholder,
    titleText = "An LLM",
    showIntermediateStepsToggle,
    emoji,
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);

  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input
        type="checkbox"
        id="show_intermediate_steps"
        name="show_intermediate_steps"
        checked={showIntermediateSteps}
        onChange={(e) => setShowIntermediateSteps(e.target.checked)}
      ></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onResponse(response) {
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({
        id: messages.length.toString(),
        content: input,
        role: "user",
      });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true,
        }),
      });
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        // Represent intermediate steps as system messages for display purposes
        const intermediateStepMessages = (json.intermediate_steps ?? []).map(
          (intermediateStep: AgentStep, i: number) => {
            return {
              id: (messagesWithUserReply.length + i).toString(),
              content: JSON.stringify(intermediateStep),
              role: "system",
            };
          },
        );
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000),
          );
        }
        setMessages([
          ...newMessages,
          {
            id: (
              newMessages.length + intermediateStepMessages.length
            ).toString(),
            content: json.output,
            role: "assistant",
          },
        ]);
      } else {
        if (json.error) {
          toast.error(json.error);
          throw new Error(json.error);
        }
      }
    }
  }

  return (
    <>
      <button type="button" onClick={openModal} className="btn btn-info">
        Ask me anything!
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`flex flex-col items-center p-4 w-4/5 max-w-7xl  rounded grow overflow-hidden bg-gray-950 ${
                    messages.length > 0 ? "border" : ""
                  }`}
                >
                  <div
                    className="flex flex-col-reverse w-full max-h-[70vh] mb-4 overflow-auto transition-[flex-grow] ease-in-out"
                    ref={messageContainerRef}
                  >
                    {messages.length > 0
                      ? [...messages].reverse().map((m, i) => {
                          const sourceKey = (
                            messages.length -
                            1 -
                            i
                          ).toString();
                          return m.role === "system" ? (
                            <IntermediateStep
                              key={m.id}
                              message={m}
                            ></IntermediateStep>
                          ) : (
                            <ChatMessageBubble
                              key={m.id}
                              message={m}
                              aiEmoji={emoji}
                              sources={sourcesForMessages[sourceKey]}
                            ></ChatMessageBubble>
                          );
                        })
                      : ""}
                  </div>

                  <form onSubmit={sendMessage} className="flex w-full flex-col">
                    <div className="flex">{intemediateStepsToggle}</div>
                    <div className="flex w-full gap-4 items-center justify-center mt-4">
                      <input
                        className="input input-bordered input-info w-full p-4"
                        value={input}
                        placeholder={
                          placeholder ?? "Ask me anything about the document"
                        }
                        onChange={handleInputChange}
                      />
                      <button type="submit" className="btn btn-info">
                        {(chatEndpointIsLoading ||
                          intermediateStepsLoading) && (
                          <span className="loading loading-spinner"></span>
                        )}
                        {chatEndpointIsLoading || intermediateStepsLoading
                          ? "Sending"
                          : "Send"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChatPopup;
