import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../models/notification.model';

@Component({ selector: 'app-notification-center', standalone: true, imports: [CommonModule, DatePipe], templateUrl: './notification-center.component.html', styleUrl: './notification-center.component.scss' })
export class NotificationCenterComponent {
  readonly service = inject(NotificationService); private router = inject(Router);
  readonly items = signal<NotificationItem[]>([]); readonly page = signal(1); readonly total = signal(0); readonly loading = signal(false); readonly unreadOnly = signal(false); readonly error = signal('');
  constructor() { void this.load(); }
  categoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'enrollment': return '📝';
      case 'grades': case 'assessments': return '📊';
      case 'certificates': return '🎓';
      case 'timetable': case 'schedule': return '🗓️';
      case 'users': return '👤';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }
  async load(): Promise<void> { this.loading.set(true); this.error.set(''); try { const result = await this.service.load(this.page(), 20, this.unreadOnly()); this.items.set(result.items); this.total.set(result.totalCount); } catch { this.error.set('Unable to load notifications.'); } finally { this.loading.set(false); } }
  async filter(unread: boolean): Promise<void> { this.unreadOnly.set(unread); this.page.set(1); await this.load(); }
  async markRead(item: NotificationItem): Promise<void> { if (!item.isRead) { await this.service.markRead(item.id); this.items.update(xs => xs.map(x => x.id === item.id ? {...x, isRead:true, readAt:new Date().toISOString()} : x)); } if(item.actionUrl) await this.router.navigateByUrl(item.actionUrl); }
  async markAll(): Promise<void> { await this.service.markAllRead(); this.items.update(xs => xs.map(x => ({...x,isRead:true,readAt:new Date().toISOString()}))); }
  async remove(item: NotificationItem): Promise<void> { await this.service.delete(item.id); this.items.update(xs => xs.filter(x => x.id !== item.id)); this.total.update(x => Math.max(0,x-1)); }
  async previous(): Promise<void> { if(this.page()>1){this.page.update(x=>x-1);await this.load();} }
  async next(): Promise<void> { if(this.page()*20<this.total()){this.page.update(x=>x+1);await this.load();} }
}
