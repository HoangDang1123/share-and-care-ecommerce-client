'use client'

import {
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  MinusIcon
} from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ConversationResponse, MessageItem } from "@/interface/chat";
import Image from "next/image";
import { formatTimestamp } from "@/utils/helpers";
import { initSocket } from "@/utils/socket";
import { getAllConversation, getConversation } from "../api/chat";
import { useSocket } from "../context/SocketContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "../context/AppContext";
import { uploadChatImage } from "../api/upload";

export default function Chat() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [openChatFrame, setOpenChatFrame] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [fileImages, setFileImages] = useState<File[] | undefined>();
  const [sendingMessage, setSendingMessage] = useState(false);
  const messTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { socket, setSocket } = useSocket();
  const { isLogin } = useAuth();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId') || '');
      setAccessToken(localStorage.getItem('accessToken') || '');
      setDeviceToken(localStorage.getItem('deviceToken') || '');
    };

    window.addEventListener('storage', handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!deviceToken) return;

    const role = 'user';
    const socketInstance = accessToken
      ? initSocket(deviceToken, role, accessToken)
      : initSocket(deviceToken, role);

    setSocket(socketInstance);
  }, [deviceToken, accessToken]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: ConversationResponse) => {
      console.log('📩 Received new_message:', data);

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.conversationId === conversationId || conversationId === null) {
        setMessages(prev => {
          const newMessages: MessageItem[] = [];

          if (data.userMessages && Array.isArray(data.userMessages)) {
            const userMsgsWithPosition = data.userMessages.map(msg => ({
              ...msg,
              position: !(msg.sender === 'Share And Care Admin'),
            }));
            newMessages.push(...userMsgsWithPosition);
          }

          if (data.aiResponse) {
            newMessages.push({
              ...data.aiResponse,
              position: false,
            });
          }

          return [...prev, ...newMessages];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    if (userId !== '' && accessToken !== '') {
      const fetchAllConversation = async () => {
        try {
          const response = await getAllConversation(userId, accessToken);
          const firstConversation = response?.items?.[0];

          if (firstConversation) {
            setConversationId(firstConversation.id);
          } else {
            setConversationId(null);
          }
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };

      fetchAllConversation();
    }
  }, [accessToken, userId]);

  useEffect(() => {
    if (conversationId && userId && accessToken) {
      const fetchConversation = async () => {
        try {
          setLoadingConversation(true);

          const response = await getConversation(conversationId, userId, accessToken);
          setMessages(
            response.items.map((item) => ({
              ...item,
              position: item.sender !== 'Share And Care Admin' && item.sender !== 'AI_Assistant',
            })).reverse()
          );
        } catch (error) {
          console.error("Error fetching conversation:", error);
        } finally {
          setLoadingConversation(false);
        }
      };

      fetchConversation();
    }
  }, [accessToken, conversationId, isLogin, userId]);

  useEffect(() => {
    if (messTextareaRef.current) {
      messTextareaRef.current.focus();
    }
  });

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!message.trim() && (!fileImages || fileImages.length === 0)) return;

    setSendingMessage(true);

    let imageUrls: string[] = [];

    try {
      if (fileImages && fileImages.length > 0) {
        const uploadedImages = await Promise.all(
          fileImages.map(async (file) => {
            const response = await uploadChatImage(file, userId, accessToken);
            return response;
          })
        );

        imageUrls = [...imageUrls, ...uploadedImages];
      }

      if (socket) {
        socket.emit("send_message", {
          conversationId: conversationId,
          content: message,
          imageUrls: imageUrls,
          useAI: useAI,
        });

        if (!conversationId && userId && accessToken) {
          setTimeout(async () => {
            const response = await getAllConversation(userId, accessToken);
            const firstConversation = response?.items?.[0];
            if (firstConversation) {
              setConversationId(firstConversation.id);
            }
          }, 10);
        }
      }

      setMessage('');
      setImagePreviews([]);
      setFileImages(undefined);
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSendingMessage(false);
    }
  };


  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    setFileImages(prevFiles => [...(prevFiles || []), ...newFiles]);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prevImages => [...prevImages, ...newPreviewUrls]);
  };

  const handleDelete = (indexToRemove: number) => {
    setImagePreviews(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    setFileImages(prevFiles => prevFiles?.filter((_, index) => index !== indexToRemove));
  };

  const renderMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div>
      <button
        onClick={() => openChatFrame ? setOpenChatFrame(false) : setOpenChatFrame(true)}
        className={`${openChatFrame ? 'flex' : 'flex'} fixed items-center space-x-2 bottom-[20px] right-[20px] p-4 shadow-2xl bg-gray-900 text-white rounded-full transition ease-in-out hover:scale-110 duration-300`}
      >
        <ChatBubbleBottomCenterTextIcon className='size-6' />
      </button>

      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: openChatFrame ? 1 : 0.2, opacity: openChatFrame ? 1 : 0 }}
        exit={{ scale: 0.2, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed flex-col bottom-0 md:right-[90px] sm:w-full md:w-96 sm:h-[80vh] md:h-[60vh] shadow-2xl shadow-gray-400 bg-white rounded-tl-lg rounded-tr-lg"
        style={{ display: openChatFrame ? "flex" : "hidden", transformOrigin: "bottom right" }}
      >
        <div className="flex justify-between w-full items-center px-4 py-2 bg-gray-900 rounded-tl-lg rounded-tr-lg">
          <span className="text-xl font-semibold text-white">Chat</span>
          <button
            onClick={() => setOpenChatFrame(false)}
            className="bg-white text-gray-900 rounded-sm"
          >
            <MinusIcon className="size-4" />
          </button>
        </div>

        <div className="flex flex-col justify-between w-full h-full overflow-hidden border bg-white">
          <div className="flex justify-between gap-x-2 border-b-2 shadow-md p-2 bg-white">
            <div className="flex items-center gap-x-2">
              <Image
                src="/assets/favicon.png"
                alt="avatar"
                title="ShareAndCare avatar"
                width={32}
                height={32}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-base font-semibold">
                {useAI ? 'Share And Care AI' : 'Share And Care Admin'}
              </span>
            </div>

            <button
              onClick={() => setUseAI(prev => !prev)}
              className="p-1 text-gray-600 hover:text-blue-600"
              title="Change Admin/Chatbot"
            >
              <ArrowPathIcon className="w-6 h-6 font-semibold" />
            </button>
          </div>

          <div className="flex flex-col gap-y-2 overflow-y-auto flex-grow p-2" ref={messageContainerRef}>
            {loadingConversation ? (
              <div className="flex flex-col w-full h-full justify-center items-center">
                <ClipLoader className="size-20" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col w-full h-full justify-center items-center gap-y-2">
                <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-gray-400" />
                <p className="text-lg font-medium">Chưa có tin nhắn nào.</p>
                <p className="text-sm text-gray-400">Bắt đầu cuộc trò chuyện ngay nhé!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.position === true;

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-x-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <Image
                        src={
                          msg.userId?.avatar === 'https://via.placeholder.com/400x400.png'
                            ? '/assets/default-avatar-icon.jpg'
                            : msg.userId?.avatar || '/assets/default-avatar-icon.jpg'
                        }
                        alt="avatar"
                        title="avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />

                      <div
                        className={`flex flex-col gap-y-2 max-w-44 p-2 rounded-lg shadow text-sm break-words whitespace-pre-wrap ${isUser ? 'bg-blue-100' : 'bg-white'
                          }`}
                      >
                        {msg.image ? (
                          <Image
                            src={msg.image}
                            alt="chat-image"
                            width={300}
                            height={300}
                            className="rounded-md object-contain"
                          />
                        ) : (
                          <p className="text-gray-800">{renderMessageContent(msg.content)}</p>
                        )}
                        <p className="text-xs text-gray-500 text-right">
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="h-[8%] border-t-2">
          <textarea
            name="message"
            value={message}
            ref={messTextareaRef}
            spellCheck={false}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none outline-none text-base p-2 bg-white"
            placeholder="Enter your message..."
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="w-full px-2 py-1 border-t border-b bg-gray-50 flex gap-2 overflow-x-auto overflow-y-hidden">
            {imagePreviews.map((url, idx) => (
              <div key={idx} className="relative h-24 overflow-hidden">
                <Image
                  src={url}
                  alt={`preview-${idx}`}
                  width={1000}
                  height={1000}
                  className="object-cover w-14 h-14"
                />
                <button
                  onClick={() => handleDelete}
                  className="absolute top-0 right-0 bg-white bg-opacity-70 text-red-500 px-1 rounded-full text-xs hover:bg-gray-200 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center w-full h-[10%] p-2">
          <div className="flex justify-start space-x-2">
            <button
              onClick={handleClick}
            >
              <PhotoIcon className="size-6" />
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </button>

            {/* <button>
              <FaceSmileIcon className="size-6" />
            </button>

            <button>
              <GifIcon className="size-6" />
            </button> */}
          </div>

          <button onClick={handleSubmit} disabled={sendingMessage}>
            {sendingMessage ? (
              <ClipLoader size={18} color="#1f2937" />
            ) : (
              <PaperAirplaneIcon className="size-6 text-gray-900" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
