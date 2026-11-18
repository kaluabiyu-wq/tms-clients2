import { Component, computed, effect, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SignalRService } from './services/signalr.service';
import { NotificationService } from './services/notification.service';
import { NotificationBellComponent } from './ui/notification-bell/notification-bell.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBellComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private signalR = inject(SignalRService);
  private notifications = inject(NotificationService);
  private notificationSubscription?: Subscription;
  private readonly authSignalREffect = effect(() => {
    const user = this.auth.currentUser();
    if (user) {
      void this.signalR.startAuthenticated().catch(error => console.warn('Notification live connection unavailable', error));
      void this.notifications.refreshUnreadCount().catch(() => undefined);
    } else {
      void this.signalR.stop();
      this.notifications.unreadCount.set(0);
      this.notifications.latest.set([]);
    }
  });
  constructor(private router: Router) {}
  protected readonly title = signal('tms-clients');

  ngOnInit(): void {
    this.notificationSubscription = this.signalR.notification$.subscribe(item => this.notifications.receiveRealtime(item));
  }

  ngOnDestroy(): void { this.notificationSubscription?.unsubscribe(); void this.signalR.stop(); }

  isLoggedIn = computed(() => !!this.auth.currentUser());
  isAdmin = computed(() => this.auth.currentUser()?.role === 'Admin');
  isStudent = computed(() => this.auth.currentUser()?.role === 'Student');
  canViewReports = computed(() => ['Admin', 'SuperAdmin', 'Registrar', 'Auditor'].includes(this.auth.currentUser()?.role ?? '')); 
  canTakeAttendance = computed(() => {
    const role = this.auth.currentUser()?.role;
    return role === 'Admin' || role === 'Instructor';
  });

  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}