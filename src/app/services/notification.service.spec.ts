import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { NotificationRealtimeMessage } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationService);
  });

  it('increments unread count only once for a repeated realtime notification', () => {
    const event: NotificationRealtimeMessage = {
      id: 123,
      title: 'Enrollment approved',
      message: 'Your enrollment was approved.',
      type: 'Success',
      category: 'Enrollment',
      actionUrl: '/dashboard',
      createdAt: new Date().toISOString(),
    };

    service.receiveRealtime(event);
    service.receiveRealtime(event);

    expect(service.unreadCount()).toBe(1);
    expect(service.latest().length).toBe(1);
  });
});
