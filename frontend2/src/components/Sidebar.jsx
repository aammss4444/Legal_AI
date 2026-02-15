import { Plus, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = ({ onNewChat }) => {
    return (
        <div className="hidden md:flex md:w-[260px] md:flex-col bg-chat-sidebar h-full border-r border-white/10">
            <div className="flex-1 flex flex-col p-2 space-y-2">
                {/* New Chat Button */}
                <button
                    onClick={onNewChat}
                    className="flex items-center gap-3 px-3 py-3 rounded-md border border-white/20 text-white hover:bg-gray-500/10 transition-colors text-sm text-left mb-1"
                >
                    <Plus size={16} />
                    New chat
                </button>

                {/* History List (Mock for now) */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <span className="px-3 text-xs font-medium text-gray-500 py-2">Today</span>
                        <button className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-500/10 transition-colors text-sm text-gray-100 truncate">
                            <MessageSquare size={16} />
                            <span className="truncate">Legal Query: Constitution Rights</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User / Logout Area */}
            <div className="border-t border-white/20 p-2">
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-500/10 transition-colors text-sm text-white">
                    <div className="w-8 h-8 rounded bg-green-700 flex items-center justify-center text-xs font-bold">
                        U
                    </div>
                    <div className="flex-1 text-left truncate font-medium">User</div>
                    <LogOut size={16} className="text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
