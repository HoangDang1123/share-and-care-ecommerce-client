export interface PostMessageByAnonymous {
    deviceToken: string,
    content: string,
    imageUrls: string[],
    useAI: boolean,
}

export interface PostMessageByUser {
    conversationId: string,
    content: string,
    imageUrls: string[],
    useAI: boolean,
    role: Role,
}

export interface PostMessageResponse {
    conversationId: string,
    userMessages: Message[],
    aiResponse: Message,
}

export interface Message {
    id: string,
    sender: string,
    userId: {
        id: string,
    } | null,
    senderType: Role,
    content: string,
    image: string[] | null,
    seen: boolean,
}

export interface AllConversationResponse {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: ConversationItem[],
}

export interface ConversationItem {
    id: string,
    latestMessage: {
        id: string,
        sender: string,
        userId: ChatUser,
        content: string,
        image: string[] | null,
        seen: boolean,
        createdAt: string,
    },
}

export interface MessageDetailResponse {
  total: number,
  totalPages: number,
  page: number,
  size: number,
  hasMore: boolean,
  items: MessageItem[],
}

export interface MessageItem {
  id: string,
  sender: string,
  userId: ChatUser | null,
  senderType: Role,
  content: string,
  image: string | null,
  seen: boolean,
  createdAt: string,
  position: boolean,
}

export interface ChatUser {
  id: string,
  name: string,
  avatar: string,
}

export interface ConversationResponse {
    conversationId: string, 
    userMessages: MessageItem[] | null,
    aiResponse: MessageItem | null,
}

export enum Role {
    USER = 'user',
    ADMIN = 'admin',
    ASSISTANT = 'assistant',
}