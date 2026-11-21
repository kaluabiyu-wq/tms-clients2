import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { apiV2Url } from './api-url';
import { NotificationItem, NotificationPage, NotificationPreference, NotificationRealtimeMessage } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  readonly unreadCount = signal(0);
  readonly latest = signal<NotificationItem[]>([]);

  async load(page = 1, pageSize = 20, unreadOnly = false): Promise<NotificationPage> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize).set('unreadOnly', unreadOnly);
    const result = await firstValueFrom(this.http.get<NotificationPage>(`${apiV2Url}/notifications`, { params }));
    this.unreadCount.set(result.unreadCount);
    if (page === 1) this.latest.set(result.items);
    return result;
  }

  async refreshUnreadCount(): Promise<void> {
    const result = await firstValueFrom(this.http.get<{ unreadCount: number }>(`${apiV2Url}/notifications/unread-count`));
    this.unreadCount.set(result.unreadCount);
  }

  receiveRealtime(item: NotificationRealtimeMessage): void {
    const notification: NotificationItem = { ...item, isRead: false, readAt: null };
    const alreadyKnown = this.latest().some(existing => existing.id === notification.id);
    this.latest.update(items => [notification, ...items.filter(x => x.id !== notification.id)].slice(0, 20));
    if (!alreadyKnown) this.unreadCount.update(count => count + 1);
  }

  async markRead(id: number): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${apiV2Url}/notifications/${id}/read`, {}));
    this.latest.update(items => items.map(x => x.id === id ? { ...x, isRead: true, readAt: new Date().toISOString() } : x));
    await this.refreshUnreadCount();
  }

  async markAllRead(): Promise<void> {
    await firstValueFrom(this.http.put(`${apiV2Url}/notifications/read-all`, {}));
    this.latest.update(items => items.map(x => ({ ...x, isRead: true, readAt: new Date().toISOString() })));
    this.unreadCount.set(0);
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${apiV2Url}/notifications/${id}`));
    this.latest.update(items => items.filter(x => x.id !== id));
    await this.refreshUnreadCount();
  }

  getPreferences(): Promise<NotificationPreference[]> {
    return firstValueFrom(this.http.get<NotificationPreference[]>(`${apiV2Url}/notifications/preferences`));
  }

  updatePreference(preference: NotificationPreference): Promise<NotificationPreference> {
    return firstValueFrom(this.http.put<NotificationPreference>(`${apiV2Url}/notifications/preferences`, preference));
  }
}
