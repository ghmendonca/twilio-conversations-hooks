import { Message } from "@twilio/conversations/lib/message"
import { Participant } from "@twilio/conversations/lib/participant"
import { useContext, useEffect, useState } from "react"
import TwilioContext from "../contexts/TwilioContext"

interface UseConversation {
    messages: Message[]
    loading: boolean
    sendMessage(message: string): Promise<void>
    sendTyping(): Promise<void>
    typing: string
}

const useConversation = (uniqueName: string): UseConversation => {
    const [loading, setLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [typing, setTyping] = useState<string>('')

    const { conversations } = useContext(TwilioContext)

    const conversation = conversations?.find(conversation => conversation.uniqueName === uniqueName)

    useEffect(() => {
        if (conversation) {
            join()
        }
    }, [conversation])

    const sendMessage = async (message: string): Promise<void> => {
        await conversation?.sendMessage(message)
    }

    const join = async (): Promise<void> => {
        setLoading(true)

        if (conversation) {
            if (conversation.status !== 'joined') {
                await conversation.join()
            }

            // @ts-ignore
            conversation.on('messageAdded', (message: Message) => {
                setMessages(messages => [...messages, message])
            })

            // @ts-ignore
            conversation.on('typingStarted', (member: Participant) => {
                setTyping(member.identity)
            })

            // @ts-ignore
            conversation.on('typingEnded', (member: Participant) => {
                setTyping('')
            })

            const messages = await conversation.getMessages()

            setMessages(messages.items)
        }

        setLoading(false)
    }

    const sendTyping = async (): Promise<void> => {
        if (conversation) {
            await conversation.typing()
        }
    }

    return {
        messages,
        loading,
        sendMessage,
        sendTyping,
        typing
    }
}

export default useConversation