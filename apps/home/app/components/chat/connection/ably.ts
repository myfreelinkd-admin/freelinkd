"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ablyChatService } from "../ably-integration/integration";
import { ChatMessageEvent } from "@ably/chat";

// Define the shape of a message for our UI
export interface UIMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isSelf: boolean;
}

export function useProjectChat(projectId: string, userId: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if we've initialized to prevent double-init in Strict Mode
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!projectId || !userId) return;

    const roomId = `project-${projectId}`;

    const setupChat = async () => {
      try {
        // Initialize the service with the current user ID
        ablyChatService.init(userId);

        // Load chat history from database
        try {
          const historyResponse = await fetch(`/api/chat/history?roomId=${roomId}&limit=100`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            if (historyData.success && historyData.data) {
              const historicalMessages: UIMessage[] = historyData.data.map((msg: any) => ({
                id: msg._id || `${msg.senderId}-${msg.timestamp}`,
                text: msg.text,
                senderId: msg.senderId,
                timestamp: msg.timestamp,
                isSelf: msg.senderId === userId
              }));
              setMessages(historicalMessages);
            }
          }
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }

        // Subscribe to the room
        console.log(`Joining chat room: ${roomId}`);
        
        // We pass a callback to handle incoming messages
        const unsubscribe = await ablyChatService.subscribeToRoom(roomId, async (text, event: ChatMessageEvent) => {
            const msgId = (event.message as any).id || `${event.message.clientId}-${event.message.timestamp.getTime()}`;
            
            const incomingMsg: UIMessage = {
                id: msgId,
                text: event.message.text,
                senderId: event.message.clientId || 'unknown',
                timestamp: event.message.timestamp.getTime(),
                isSelf: event.message.clientId === userId
            };
            
            setMessages((prev) => {
                if (prev.some(m => m.id === incomingMsg.id)) return prev;
                return [...prev, incomingMsg];
            });

            // Save to database (save all messages including our own from the echo)
            try {
              await fetch('/api/chat/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  roomId,
                  senderId: incomingMsg.senderId,
                  senderName: incomingMsg.senderId, // Could enhance with actual name
                  text: incomingMsg.text,
                  timestamp: incomingMsg.timestamp
                })
              });
            } catch (err) {
              console.error("Failed to save message to history:", err);
            }
        });

        setIsConnected(true);
        setError(null);

        return () => {
          unsubscribe();
          ablyChatService.releaseRoom(roomId);
          setIsConnected(false);
        };

      } catch (err: any) {
        console.error("Chat connection error:", err);
        setError(err.message || "Failed to connect to chat");
        setIsConnected(false);
      }
    };

    const cleanup = setupChat();

    // Cleanup function handling the async promise from setupChat
    return () => {
       cleanup.then(unsub => {
           if (unsub) unsub();
       });
    };

  }, [projectId, userId]);

  const sendMessage = useCallback(async (text: string) => {
      if (!text.trim() || !isConnected) return;
      const roomId = `project-${projectId}`;
      try {
          await ablyChatService.sendMessage(roomId, text);
          // Note: We don't manually add the message to state here 
          // because we subscribe to the room, so we'll receive our own message back.
      } catch (err) {
          console.error("Failed to send message", err);
          alert("Failed to send message");
      }
  }, [projectId, isConnected]);

  return { 
      messages, 
      sendMessage, 
      isConnected, 
      error 
  };
}

// Hook for Group Chat (Freelancer Groups)
export function useGroupChat(groupId: string, userId: string) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId || !userId) return;

    const roomId = `group-${groupId}`;

    const setupChat = async () => {
      try {
        ablyChatService.init(userId);

        // Load chat history from database
        try {
          const historyResponse = await fetch(`/api/chat/history?roomId=${roomId}&limit=100`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            if (historyData.success && historyData.data) {
              const historicalMessages: UIMessage[] = historyData.data.map((msg: any) => ({
                id: msg._id || `${msg.senderId}-${msg.timestamp}`,
                text: msg.text,
                senderId: msg.senderId,
                timestamp: msg.timestamp,
                isSelf: msg.senderId === userId
              }));
              setMessages(historicalMessages);
            }
          }
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }

        console.log(`Joining group chat room: ${roomId}`);
        
        const unsubscribe = await ablyChatService.subscribeToRoom(roomId, async (text, event: ChatMessageEvent) => {
            const msgId = (event.message as any).id || `${event.message.clientId}-${event.message.timestamp.getTime()}`;
            
            const incomingMsg: UIMessage = {
                id: msgId,
                text: event.message.text,
                senderId: event.message.clientId || 'unknown',
                timestamp: event.message.timestamp.getTime(),
                isSelf: event.message.clientId === userId
            };
            
            setMessages((prev) => {
                if (prev.some(m => m.id === incomingMsg.id)) return prev;
                return [...prev, incomingMsg];
            });

            // Save to database
            try {
              await fetch('/api/chat/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  roomId,
                  senderId: incomingMsg.senderId,
                  senderName: incomingMsg.senderId,
                  text: incomingMsg.text,
                  timestamp: incomingMsg.timestamp
                })
              });
            } catch (err) {
              console.error("Failed to save message to history:", err);
            }
        });

        setIsConnected(true);
        setError(null);

        return () => {
          unsubscribe();
          ablyChatService.releaseRoom(roomId);
          setIsConnected(false);
        };

      } catch (err: any) {
        console.error("Group chat connection error:", err);
        setError(err.message || "Failed to connect to group chat");
        setIsConnected(false);
      }
    };

    const cleanup = setupChat();

    return () => {
       cleanup.then(unsub => {
           if (unsub) unsub();
       });
    };

  }, [groupId, userId]);

  const sendMessage = useCallback(async (text: string) => {
      if (!text.trim() || !isConnected) return;
      const roomId = `group-${groupId}`;
      try {
          await ablyChatService.sendMessage(roomId, text);
      } catch (err) {
          console.error("Failed to send message", err);
          alert("Failed to send message");
      }
  }, [groupId, isConnected]);

  return { 
      messages, 
      sendMessage, 
      isConnected, 
      error 
  };
}
