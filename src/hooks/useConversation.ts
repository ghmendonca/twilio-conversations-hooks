import { Message } from "@twilio/conversations/lib/message"
import { useContext, useEffect, useState } from "react"
import TwilioContext from "../contexts/TwilioContext"

interface UseConversation {
    messages: Message[]
    loading: boolean
    sendMessage(message: string): Promise<void>
}

const useConversation = (uniqueName: string): UseConversation => {
    const [loading, setLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])

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

            const messages = await conversation.getMessages()

            setMessages(messages.items)
        }

        setLoading(false)
    }

    return {
        messages,
        loading,
        sendMessage
    }
}

export default useConversation