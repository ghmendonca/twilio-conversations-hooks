import Client from "@twilio/conversations"
import { Conversation } from "@twilio/conversations/lib/conversation"
import { createContext, Dispatch, SetStateAction } from "react"

interface TwilioContextProps {
    token: string
    setToken: Dispatch<SetStateAction<string>>
    identity: string | undefined
    setIdentity: Dispatch<SetStateAction<string | undefined>>
    client: Client
    setClient: Dispatch<SetStateAction<Client>>
    initClient(token: string, identity?: string): Promise<Conversation[]>
    conversations: Conversation[]
}

const TwilioContext = createContext<TwilioContextProps>({
    token: '',
    setToken: () => null,
    initClient: () => Promise.resolve([]),
    client: {} as Client,
    setClient: () => null,
    identity: '',
    setIdentity: () => null,
    conversations: []
})



export default TwilioContext