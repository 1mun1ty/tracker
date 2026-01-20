'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Command, HelpCircle, Plus, MessageCircle } from 'lucide-react';
import { useUser } from '@/lib/userContext';
import { useToast } from '@/components/UI/Toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface HeaderProps {
  onNavigate?: (view: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { user } = useUser();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat notification state
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const lastMessageCountRef = useRef<number>(0);
  const lastSeenMessageIdRef = useRef<string | null>(null);
  const isFirstLoadRef = useRef(true);
  
  // Check if user is currently viewing chat
  const isChatActive = () => {
    const lastViewed = localStorage.getItem('chat_last_viewed');
    if (!lastViewed) return false;
    return Date.now() - parseInt(lastViewed) < 5000;
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Poll for new chat messages - faster polling (every 3 seconds)
  useEffect(() => {
    if (!user) return;
    
    // Initial load
    checkNewMessages();
    
    // Poll every 3 seconds for real-time feel
    const chatInterval = setInterval(checkNewMessages, 3000);
    return () => clearInterval(chatInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkNewMessages = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) return;
      const data = await response.json();
      
      if (data.success && data.data) {
        const messages: Message[] = data.data;
        
        // Get messages from the OTHER user only
        const otherUserMessages = messages.filter(m => m.senderId !== user.id);
        const currentCount = otherUserMessages.length;
        
        // Skip notification on first load
        if (isFirstLoadRef.current) {
          lastMessageCountRef.current = currentCount;
          if (otherUserMessages.length > 0) {
            lastSeenMessageIdRef.current = otherUserMessages[otherUserMessages.length - 1].id;
          }
          isFirstLoadRef.current = false;
          return;
        }
        
        // Check if there are new messages from the other user
        if (currentCount > lastMessageCountRef.current) {
          const latestMessage = otherUserMessages[otherUserMessages.length - 1];
          
          // Only notify if not viewing chat AND it's a genuinely new message
          if (!isChatActive() && latestMessage.id !== lastSeenMessageIdRef.current) {
            const newCount = currentCount - lastMessageCountRef.current;
            setUnreadChatCount(prev => prev + newCount);
            
            // Show toast notification
            showToast('info', `💬 ${latestMessage.senderName}: "${latestMessage.content.slice(0, 40)}${latestMessage.content.length > 40 ? '...' : ''}"`);
            
            // Play notification sound (optional)
            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {});
            } catch {}
          }
          
          lastSeenMessageIdRef.current = latestMessage.id;
        }
        
        lastMessageCountRef.current = currentCount;
      }
    } catch {
      // Silently ignore errors
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) {
        const notifList = data.data || [];
        setNotifications(notifList);
        setUnreadCount(notifList.filter((n: Notification) => !n.read).length);
      }
    } catch {
      // Silently ignore fetch errors
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      loadNotifications();
    } catch {
      // Silently ignore errors
    }
  };

  const handleChatClick = () => {
    setUnreadChatCount(0);
    // Reset the count so we don't re-notify for existing messages
    lastMessageCountRef.current = 0;
    isFirstLoadRef.current = true;
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  return (
    <>
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4 flex-1">
          {/* Search Bar */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-400 transition-colors flex-1 max-w-lg"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search tasks, projects...</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Add */}
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Quick Add</span>
          </button>

          {/* Help */}
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Chat Messages */}
          <button
            onClick={handleChatClick}
            className="relative p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Chat"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full px-1 animate-bounce">
                {unreadChatCount > 9 ? '9+' : unreadChatCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-400 text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-700/50">
                        {notifications.slice(0, 10).map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`w-full p-4 text-left hover:bg-slate-800/50 transition-colors ${
                              !notif.read ? 'bg-cyan-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notif.read && (
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                              )}
                              <div className={!notif.read ? '' : 'ml-5'}>
                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                <p className="text-sm text-slate-400 mt-0.5">{notif.message}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-slate-700">
                      <button className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <div className="ml-2">
            {user && (
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold ${
                user.id === 'user-ali' 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                  : 'bg-gradient-to-br from-violet-500 to-purple-600'
              }`}>
                {user.avatar}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-slate-700">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tasks, projects..."
                className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
              />
              <kbd className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">ESC</kbd>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {searchQuery ? (
                <div className="text-center py-8 text-slate-400">
                  <p>Search for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-slate-500 mt-1">Press Enter to search</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="space-y-1">
                      {[
                        { label: 'Create new task', shortcut: 'T' },
                        { label: 'Create new project', shortcut: 'P' },
                        { label: 'Start timer', shortcut: 'S' },
                        { label: 'Open chat', shortcut: 'C' },
                      ].map((action) => (
                        <button
                          key={action.label}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-800 rounded-lg text-left transition-colors"
                        >
                          <span className="text-slate-300">{action.label}</span>
                          <kbd className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                            {action.shortcut}
                          </kbd>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
