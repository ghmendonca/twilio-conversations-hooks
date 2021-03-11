import Client from "@twilio/conversations"
import { Conversation } from "@twilio/conversations/lib/conversation"
import React, { FunctionComponent, useState } from "react"
import TwilioContext from "../contexts/TwilioContext"

const TwilioProvider: FunctionComponent = ({ children }) => {
    const [token, setToken] = useState<string>('')
    const [identity, setIdentity] = useState<string | undefined>(undefined)
    const [client, setClient] = useState<Client>({} as Client)
    const [conversations, setConversations] = useState<Conversation[]>([])

    const initClient = async (token: string, identity?: string): Promise<Conversation[]> => {
        const client = await Client.create(token)

        const conversations = await client.getSubscribedConversations()

        setConversations(conversations.items)

        setClient(client)
        setToken(token)
        setIdentity(identity)

        return conversations.items
    }

    return (
        <TwilioContext.Provider value={{
            token,
            setToken,
            identity,
            setIdentity,
            initClient,
            client,
            setClient,
            conversations
        }}>
            {children}
        </TwilioContext.Provider>
    )
}

export default TwilioProvider