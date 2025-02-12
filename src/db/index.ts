import { Message } from '../types/agent';

class DatabaseService {
  private dbName = 'chatHistoryDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Failed to open database");
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'id' });
          conversationsStore.createIndex('userAgent', ['userId', 'agentId'], { unique: false });
        }

        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
          messagesStore.createIndex('conversationId', 'conversationId', { unique: false });
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
    }
  }

  private async transaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore, transaction: IDBTransaction) => Promise<T>
  ): Promise<T> {
    await this.ensureInitialized();
    if (!this.db) throw new Error("Database not initialized");

    // If storeName is an array, use it directly, otherwise wrap single store in array
    const storeNames = Array.isArray(storeName) ? storeName : [storeName];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeNames, mode);
      const store = transaction.objectStore(storeNames[0]);

      transaction.onerror = () => reject(transaction.error);

      callback(store, transaction).then(resolve).catch(reject);
    });
  }

  // User methods
  async createUser(userId: string) {
    await this.transaction('users', 'readwrite', async (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put({ id: userId, createdAt: new Date() });
        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });
    });
  }

  // Conversation methods
  async createConversation(userId: string, agentId: string): Promise<string> {
    const conversationId = crypto.randomUUID();
    await this.transaction('conversations', 'readwrite', async (store, transaction) => {
      return new Promise((resolve, reject) => {
        const request = store.put({
          id: conversationId,
          userId,
          agentId,
          startedAt: new Date()
        });
        transaction.oncomplete = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });
    });
    return conversationId;
  }

  // Message methods
  async addMessage(conversationId: string, content: string, type: 'user' | 'agent') {
    const messageId = crypto.randomUUID();
    await this.transaction('messages', 'readwrite', async (store, transaction) => {
      return new Promise((resolve, reject) => {
        const request = store.put({
          id: messageId,
          conversationId,
          content,
          type,
          timestamp: new Date()
        });
        transaction.oncomplete = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async getConversationHistory(userId: string, agentId: string): Promise<Message[]> {
    return this.transaction('conversations', 'readonly', async (_, transaction) => {
      return new Promise((resolve, reject) => {
        const conversationsStore = transaction.objectStore('conversations');
        const conversationIndex = conversationsStore.index('userAgent');
        
        const conversationRequest = conversationIndex.getKey([userId, agentId]);
        
        conversationRequest.onsuccess = () => {
          const conversationId = conversationRequest.result;
          if (!conversationId) {
            resolve([]);
            return;
          }

          const messagesStore = transaction.objectStore('messages');
          const messageIndex = messagesStore.index('conversationId');
          const messageRequest = messageIndex.getAll(conversationId);
          
          messageRequest.onsuccess = () => {
            const messages = messageRequest.result.map(msg => ({
              id: msg.id,
              agentId,
              content: msg.content,
              timestamp: new Date(msg.timestamp),
              type: msg.type as 'user' | 'agent'
            }));
            resolve(messages);
          };
          
          messageRequest.onerror = () => reject(messageRequest.error);
        };
        
        conversationRequest.onerror = () => reject(conversationRequest.error);
      });
    });
  }
}

// Export singleton instance
export const db = new DatabaseService();