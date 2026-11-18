import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationRealtimeMessage } from '../models/notification.model';

export interface TranscriptReadyEvent {
  reportId: string;
  downloadUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private readonly auth = inject(AuthService);

  private connection?: HubConnection;

  private transcriptReadySubject =
    new Subject<TranscriptReadyEvent>();

  private notificationSubject = new Subject<NotificationRealtimeMessage>();
  readonly notification$ = this.notificationSubject.asObservable();

  readonly transcriptReady$ =
    this.transcriptReadySubject.asObservable();

  async start(studentId: number): Promise<void> {
    await this.connect(`${environment.hubUrl}?studentId=${studentId}`);
  }

  async startAuthenticated(): Promise<void> {
    await this.connect(environment.hubUrl);
  }

  private async connect(url: string): Promise<void> {

    if (
      this.connection?.state === HubConnectionState.Connected ||
      this.connection?.state === HubConnectionState.Connecting
    ) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => this.auth.getAccessToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.onreconnecting(error => {
      console.warn(
        'SignalR reconnecting...',
        error?.message
      );
    });

    this.connection.onreconnected(connectionId => {
      console.info(
        'SignalR reconnected:',
        connectionId
      );
    });

    this.connection.onclose(error => {
      console.warn(
        'SignalR connection closed.',
        error?.message
      );
    });

    this.connection.on('ReceiveNotification', (notification: NotificationRealtimeMessage) => {
      this.notificationSubject.next(notification);
    });

    this.connection.on(
      'ReceiveTranscriptReady',
      (reportId: string, downloadUrl: string) => {

        console.info(
          'Transcript ready:',
          reportId,
          downloadUrl
        );

        this.transcriptReadySubject.next({
          reportId,
          downloadUrl
        });
      }
    );

    await this.connection.start();

    console.info(
      `Connected to TMS SignalR`
    );
  }

  async stop(): Promise<void> {

    if (!this.connection) {
      return;
    }

    await this.connection.stop();

    this.connection = undefined;
  }
}