# Twilio Conversations Hooks

## What is it

twilio-conversations-hooks is a library which provides a bunch of React Hooks to make your life easier when using Twilio Conversations API.

## Installation

You can get the latest release using npm:

```batch
$ npm install --save twilio-conversations-hooks
```

## Example

In order to be able to use the hooks, you first have
to render the Provider somewhere before your component
and pass the connection options, like:

```typescript
import React, FunctionComponent from "react"
import { TwilioProvider } from "twilio-conversations-hooks"

const Providers: FunctionComponent = ({ children }) => {
    return (
        <TwilioProvider>
            ...
            {children}
            ...
        </TwilioProvider>
    )
}
```

First you have to use the `useTwilio` hook to connect to twilio, and after that you can use the `useConversation` hook to get and send the messages.

Example:

```typescript
import React, { VoidFunctionComponent, useState } from "react"
import { useTwilio, useConversation } from "twilio-conversations-hooks"

const Chat: VoidFunctionComponent = () => {
    const [conversationUniqueName, setConversationUniqueName] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const { connect, conversations } = useTwilioChat()
    const { messages, sendMessages } = useConversation(conversationUniqueName)

    useEffect(() => {
        connectToTwilio()
    }, [])

    // This function will connect to twilio using your token and set a default conversation to pass to useConversation hook
    const connectToTwilio = async (): Promise<void> => {
        const token = localStorage.getItem('token')

        // Here you need to pass your token, in this example I'll get from local storage
        // Optionally you can pass the identity
        const conversations = await connect(token)

        const conversation = conversations.find(conversation => conversation.uniqueName === 'my-conversation-unique-name')

        if (conversation) {
            setConversationUniqueName('my-conversation-unique-name') 
        }
    }

    const addMessage = (): void => {
        sendMessage(message)
        setMessage('')
    }

    const switchConversation = (uniqueName: string): void {
        setConversationUniqueName(uniqueName)
    }

    return (
        <div>
            <ul>
                {
                    conversations.map(conversation => (
                        <li onClick={() => switchConversation(conversation.uniqueName)} key={conversation.uniqueName}>
                            {conversation.uniqueName}
                        </li>
                    ))
                }
            </ul>
            <ul>
                {
                    messages.map(message => (
                        <li>
                            {message.body}
                        </li>
                    ))
                }
            </ul>
            <input value={message} onChange={event => setMessage(event.target.value)} />
            <button onClick={() => addMessage()}>Send Message</button>
        </div>
    )
}
```

## API

### useTwilio()

Returns

- connect | Function - The function to connect to twilio server, you must call this function in order to receive and send messages
- loading | boolean - True if is connecting to twilio and false if the connection is done
- conversations | Conversation[] - List of conversations returned from the connection
- identity | string or undefined - If you pass the identity to the connect function, you can access it through the hook

### useConversation()

Parameters

- uniqueName | string - The unique name of your conversation

Returns

- messages | Message[] - The list of messages of that conversation
- sendMessage | Function - The function to send a new message to the conversation