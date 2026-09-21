import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface TranscriptReadyEvent {
  reportId: string;
  downloadUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private connection?: HubConnection;

  private transcriptReadySubject =
    new Subject<TranscriptReadyEvent>();

  readonly transcriptReady$ =
    this.transcriptReadySubject.asObservable();

  async start(studentId: number): Promise<void> {

    if (
      this.connection?.state === HubConnectionState.Connected ||
      this.connection?.state === HubConnectionState.Connecting
    ) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`/hubs/tms?studentId=${studentId}`)
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
      `Connected to TMS SignalR for student ${studentId}`
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