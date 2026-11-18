import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { NotificationItem } from '../../models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss'
})
export class NotificationBellComponent {
  readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  readonly open = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');

  async toggle(): Promise<void> {
    this.open.update(value => !value);
    if (this.open()) await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true); this.error.set('');
    try { await this.notifications.load(1, 8); }
    catch { this.error.set('Could not load notifications. Please try again.'); }
    finally { this.loading.set(false); }
  }

  async markRead(item: NotificationItem): Promise<void> {
    if (!item.isRead) await this.notifications.markRead(item.id);
    if (item.actionUrl) { this.open.set(false); await this.router.navigateByUrl(item.actionUrl); }
  }

  async markAllRead(): Promise<void> { await this.notifications.markAllRead(); }
  async remove(item: NotificationItem, event: Event): Promise<void> { event.stopPropagation(); await this.notifications.delete(item.id); }
  goToAll(): void { this.open.set(false); this.router.navigate(['/notifications']); }
  goToPreferences(): void { this.open.set(false); this.router.navigate(['/notifications/preferences']); }
}
