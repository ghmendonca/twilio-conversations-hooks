import { useContext, useState } from "react"
import { Conversation } from "@twilio/conversations/lib/conversation"
import TwilioContext from "../contexts/TwilioContext"

interface UseTwilio {
    connect(token: string, identity?: string): Promise<Conversation[]>
    loading: boolean
    conversations: Conversation[]
    identity: string | undefined
}

const useTwilio = (): UseTwilio => {
    const [loading, setLoading] = useState<boolean>(false)

    const { initClient, conversations, identity } = useContext(TwilioContext)

    const connect = async (token: string, identity?: string): Promise<Conversation[]> => {
        setLoading(true)

        const conversations = await initClient(token, identity)

        setLoading(false)

        return conversations
    }

    return {
        connect,
        loading,
        conversations,
        identity
    }
}

export default useTwilio