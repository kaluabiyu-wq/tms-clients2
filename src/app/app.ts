import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private auth = inject(AuthService);
  constructor(private router: Router) {}
  protected readonly title = signal('tms-clients');

  isLoggedIn = computed(() => !!this.auth.currentUser());
  isAdmin = computed(() => this.auth.currentUser()?.role === 'Admin');

  goTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}