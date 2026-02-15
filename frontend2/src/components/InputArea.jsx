import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const InputArea = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

            // Cap max height if needed, though scrollbar handles overflow roughly
            if (textareaRef.current.scrollHeight > 200) {
                textareaRef.current.style.overflowY = 'scroll';
            } else {
                textareaRef.current.style.overflowY = 'hidden';
            }
        }
    }, [input]);


    return (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-chat-bg via-chat-bg to-transparent pt-10 pb-6 px-4">
            <div className="md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative flex items-center justify-center w-full p-0 m-0">
                    <div className="relative flex flex-col w-full p-3 pl-4 bg-chat-input border border-black/10 dark:border-gray-900/50 rounded-xl shadow-xs dark:shadow-none overflow-hidden focus-within:ring-1 focus-within:ring-white/30">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Send a message..."
                            rows={1}
                            className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-1 pr-10 text-white placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 max-h-[200px]"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 bottom-2.5 p-1 rounded-md text-gray-400 hover:bg-black/10 dark:hover:bg-gray-900/50 disabled:hover:bg-transparent disabled:opacity-40 transition-colors"
                        >
                            <Send size={16} className={input.trim() ? "text-white" : ""} />
                        </button>
                    </div>
                </form>
                <div className="text-center text-xs text-gray-400 mt-2">
                    Legal AI can make mistakes. Consider checking important information.
                </div>
            </div>
        </div>
    );
};

export default InputArea;
