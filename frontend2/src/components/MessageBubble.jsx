import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import clsx from 'clsx';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={clsx(
            "group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50",
            isUser ? "bg-white dark:bg-chat-bg" : "bg-gray-50 dark:bg-chat-ai"
        )}>
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl flex p-4 m-auto">
                <div className="flex-shrink-0 flex flex-col relative items-end">
                    <div className="w-[30px]">
                        <div className={clsx(
                            "relative flex h-[30px] w-[30px] items-center justify-center rounded-sm p-1",
                            isUser ? "bg-indigo-600" : "bg-green-600"
                        )}>
                            {isUser ? <User className="text-white" size={20} /> : <Bot className="text-white" size={20} />}
                        </div>
                    </div>
                </div>
                <div className="relative flex-1 overflow-hidden min-h-[20px]">
                    <div className="prose dark:prose-invert max-w-none break-words">
                        {isUser ? (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
