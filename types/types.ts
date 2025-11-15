export interface UserInfoApi {
  id: string
  name: string
  phone: string
}

export interface MessageApi {
  id?: string
  createdAt: string
  updatedAt?: string
  content: string
  conversationId: string
  senderId: string
  recievedAt?: string
  readAt?: string
}

export type MessageListApi = MessageApi[]

export interface ConversationApi {
  id: string
  name?: string
  messages: MessageListApi
  participants: UserInfoApi[]
  isGroup: boolean
}

export type ConversationsListApi = ConversationApi[]
