import * as Ably from "ably";
import {
  ChatClient,
  ConnectionStatusChange,
  ChatMessageEvent,
  RoomStatusChange,
  Room,
} from "@ably/chat";

class AblyChatService {
  private ablyClient: Ably.Realtime | null = null;
  private chatClient: ChatClient | null = null;
  private activeRooms: Map<string, Room> = new Map();

  constructor() {
    // Lazy init
  }

  public init(userId: string) {
    if (this.ablyClient) return; // Already initialized

    const apiKey =
      process.env.ABLY_API_KEY ||
      process.env.NEXT_PUBLIC_ABLY_API_KEY ||
      process.env.NEXT_PUBLIC_NEXT_PUBLIC_ABLY_API_KEY;

    if (!apiKey) {
      console.warn("Ably API Key is missing. Check your .env file.");
      return;
    }

    this.ablyClient = new Ably.Realtime({
      key: apiKey,
      clientId: userId,
    });

    this.chatClient = new ChatClient(this.ablyClient);

    this.chatClient.connection.onStatusChange(
      (change: ConnectionStatusChange) => {
        console.log("Connection state changed to", change.current);
      }
    );
  }

  public async getRoom(roomId: string) {
    // if (!this.chatClient) throw new Error("Chat client not initialized");
    // Allow checking, but don't try to auto-init without ID
    if (!this.chatClient)
      throw new Error("Chat client not initialized - call init(userId) first");

    if (this.activeRooms.has(roomId)) {
      return this.activeRooms.get(roomId)!;
    }

    console.log(`Getting room: ${roomId}`);
    const room = await this.chatClient.rooms.get(roomId);

    room.onStatusChange((change: RoomStatusChange) => {
      console.log(`Room ${roomId} state changed to`, change.current);
    });

    await room.attach();
    this.activeRooms.set(roomId, room);
    return room;
  }

  public async subscribeToRoom(
    roomId: string,
    callback: (text: string, msg: ChatMessageEvent) => void
  ) {
    const room = await this.getRoom(roomId);

    const { unsubscribe } = room.messages.subscribe(
      (event: ChatMessageEvent) => {
        console.log("Received message:", event.message.text);
        callback(event.message.text, event);
      }
    );

    return unsubscribe;
  }

  public async sendMessage(roomId: string, text: string) {
    const room = await this.getRoom(roomId);
    await room.messages.send({ text });
    console.log("Message sent:", text);
  }

  public async releaseRoom(roomId: string) {
    if (this.chatClient && this.activeRooms.has(roomId)) {
      await this.chatClient.rooms.release(roomId);
      this.activeRooms.delete(roomId);
    }
  }
}

export const ablyChatService = new AblyChatService();
