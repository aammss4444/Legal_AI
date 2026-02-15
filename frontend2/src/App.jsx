import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle new chat (Reset messages)
    const createNewChat = () => {
        setMessages([]);
        setIsLoading(false);
    };

    return (
        <div className="flex h-screen bg-chat-bg text-chat-text overflow-hidden font-sans">
            <Sidebar onNewChat={createNewChat} />
            <div className="flex-1 flex flex-col h-full relative">
                <ChatArea
                    messages={messages}
                    setMessages={setMessages}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
            </div>
        </div>
    );
}

export default App;
