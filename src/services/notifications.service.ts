import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  type: string;
  message: string;
  data: any;
  timestamp: string;
}

export class NotificationsService {
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor() {
    this.socket = io('http://localhost:3002', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notifications service');
    });

    this.socket.on('notification', (notification: Notification) => {
      const currentNotifications = this.notifications.value;
      this.notifications.next([notification, ...currentNotifications]);
    });
  }

  register(userId: string) {
    this.socket.emit('register', userId);
  }

  disconnect() {
    this.socket.disconnect();
  }
} 