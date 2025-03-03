'use client'

import { ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon, MinusIcon } from "@heroicons/react/20/solid";
import { FaceSmileIcon, GifIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Chat() {
  const [openChatFrame, setOpenChatFrame] = useState(false);
  const [message, setMessage] = useState('');
  const messTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (messTextareaRef.current) {
      messTextareaRef.current.focus();
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setMessage('');
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <button
        onClick={() => openChatFrame ? setOpenChatFrame(false) : setOpenChatFrame(true)}
        className={`${openChatFrame ? 'flex' : 'flex'} fixed items-center space-x-2 bottom-[20px] right-[20px] p-4 shadow-2xl bg-teal-600 text-white rounded-full transition ease-in-out hover:scale-110 duration-300`}
      >
        <ChatBubbleBottomCenterTextIcon className='size-6' />
      </button>

      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: openChatFrame ? 1 : 0.2, opacity: openChatFrame ? 1 : 0 }}
        exit={{ scale: 0.2, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed flex-col bottom-0 right-[90px] w-96 shadow-2xl shadow-gray-400 bg-white rounded-lg"
        style={{ display: openChatFrame ? "flex" : "hidden", transformOrigin: "bottom right" }}
      >
        <div className="flex justify-between w-full items-center px-4 py-2 bg-teal-600 rounded-tl-lg rounded-tr-lg">
          <span className="text-xl font-semibold text-white">Chat</span>
          <button
            onClick={() => setOpenChatFrame(false)}
            className="bg-white text-teal-600 rounded-sm"
          >
            <MinusIcon className="size-4" />
          </button>
        </div>

        <div className="w-full border bg-white">
          <div className="w-full h-[40vh] bg-gray-100 border-b-2 border-gray-200"></div>

          <textarea
            name="message"
            value={message}
            ref={messTextareaRef}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-10 flex-grow resize-none outline-none break-words box-border text-base text-inherit p-2 focus:border-white"
            placeholder="Enter your message..."
          />

          <div className="flex justify-between items-center w-full p-2">
            <div className="flex justify-start space-x-2">
              <button
                onClick={handleClick}
              >
                <PhotoIcon className="size-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              />

              <button>
                <FaceSmileIcon className="size-6" />
              </button>

              <button>
                <GifIcon className="size-6" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
            >
              <PaperAirplaneIcon className="size-6 text-teal-600" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
