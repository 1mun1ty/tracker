'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, USERS } from '@/lib/userContext';
import { useToast } from '@/components/UI/Toast';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface OnlineStatus {
  [userId: string]: {
    lastSeen: string;
    isOnline: boolean;
  };
}

export default function ChatPage() {
  const { user } = useUser();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Send heartbeat to update online status
  const sendHeartbeat = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/online-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        setOnlineStatus(data.data || {});
      }
    } catch {
      // Silently ignore heartbeat errors
    }
  };

  // Get online status
  const getOnlineStatus = async () => {
    try {
      const response = await fetch('/api/online-status');
      const data = await response.json();
      if (data.success) {
        setOnlineStatus(data.data || {});
      }
    } catch {
      // Silently ignore status errors
    }
  };

  useEffect(() => {
    // Mark chat as viewed immediately
    localStorage.setItem('chat_last_viewed', Date.now().toString());
    
    loadMessages();
    sendHeartbeat();
    
    // Poll for new messages every 2 seconds for real-time feel
    const messageInterval = setInterval(() => {
      loadMessages();
    }, 2000);
    
    // Send heartbeat every 10 seconds
    const heartbeatInterval = setInterval(sendHeartbeat, 10000);
    
    // Get online status every 5 seconds
    const statusInterval = setInterval(getOnlineStatus, 5000);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(heartbeatInterval);
      clearInterval(statusInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Only auto-scroll on initial load or when user sends a message
  useEffect(() => {
    if (shouldScrollToBottom || isInitialLoad) {
      scrollToBottom();
      if (isInitialLoad && messages.length > 0) {
        setIsInitialLoad(false);
      }
    }
  }, [messages, shouldScrollToBottom, isInitialLoad]);

  // Check if user is near bottom of chat
  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      if (data.success) {
        const newMessages = data.data || [];
        
        // Check if there are new messages from others
        const hasNewMessages = newMessages.length > lastMessageCount;
        const isNearBottom = checkIfNearBottom();
        
        // Only auto-scroll if user is already near bottom or it's initial load
        if (hasNewMessages && isNearBottom) {
          setShouldScrollToBottom(true);
        }
        
        setMessages(newMessages);
        setLastMessageCount(newMessages.length);
        
        // Always mark chat as viewed when loading messages
        localStorage.setItem('chat_last_viewed', Date.now().toString());
      }
    } catch {
      // Silently ignore message load errors
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShouldScrollToBottom(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear immediately for better UX

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          senderName: user.name,
          content: messageContent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShouldScrollToBottom(true); // Scroll to bottom when user sends message
        loadMessages();
      } else {
        showToast('error', 'Failed to send message');
        setNewMessage(messageContent); // Restore message on failure
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('error', 'Failed to send message. Check your connection.');
      setNewMessage(messageContent); // Restore message on failure
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherUser = () => {
    return USERS.find(u => u.id !== user?.id);
  };

  const otherUser = getOtherUser();
  const isOtherUserOnline = otherUser ? onlineStatus[otherUser.id]?.isOnline : false;

  const getLastSeenText = () => {
    if (!otherUser || !onlineStatus[otherUser.id]) return 'Offline';
    if (isOtherUserOnline) return 'Online';
    
    const lastSeen = new Date(onlineStatus[otherUser.id].lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    return `Last seen ${lastSeen.toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
              otherUser?.id === 'user-ali' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {otherUser?.avatar || '?'}
            </div>
            {/* Online/Offline indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
              isOtherUserOnline ? 'bg-emerald-500' : 'bg-slate-500'
            }`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chat with {otherUser?.name}</h1>
            <p className={`text-sm ${isOtherUserOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
              {getLastSeenText()}
              {isOtherUserOnline && ' • Learning Partner'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
              <p className="text-slate-400">Start a conversation with {otherUser?.name}!</p>
              {!isOtherUserOnline && (
                <p className="text-sm text-slate-500 mt-2">
                  {otherUser?.name} is currently offline
                </p>
              )}
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      message.senderId === 'user-ali' 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : 'bg-gradient-to-br from-violet-500 to-purple-600'
                    }`}>
                      {message.senderName.charAt(0)}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                          : 'bg-slate-800 text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className={`text-xs text-slate-500 mt-1 px-2 ${isOwnMessage ? 'text-right' : ''}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${
              user?.id === 'user-ali' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {user?.avatar || '?'}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${otherUser?.name}...`}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`p-3 rounded-xl transition-all ${
                newMessage.trim()
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
