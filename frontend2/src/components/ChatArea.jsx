import { useEffect, useRef } from 'react';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Bot } from 'lucide-react';

const ChatArea = ({ messages, setMessages, isLoading, setIsLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        // Add user message
        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Send to API
            // Note: In development, ensure backend is allowing CORS or setup proxy
            // For now assuming localhost:8000 is accessible directly
            const response = await axios.post('http://localhost:8000/chat', {
                query: text
            });

            const aiMessage = {
                role: 'assistant',
                content: response.data.response,
                sources: response.data.sources
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                role: 'assistant',
                content: "Sorry, I encountered an error connecting to the server. Please ensure the backend is running."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-hidden relative">
            <div className="h-full overflow-y-auto w-full pb-36">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-100">
                        <div className="bg-white/10 p-4 rounded-full mb-4">
                            <Bot size={48} />
                        </div>
                        <h1 className="text-3xl font-semibold mb-2">Legal AI Assistant</h1>
                        <p className="mb-4 text-gray-400">Ask any question about Indian Law</p>
                    </div>
                ) : (
                    <div className="flex flex-col w-full items-center">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="w-full bg-gray-50 dark:bg-chat-ai border-b border-black/10 dark:border-gray-900/50 text-gray-100">
                                <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl flex p-4 m-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
    );
};

export default ChatArea;
