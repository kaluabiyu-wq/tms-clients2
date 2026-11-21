import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service'; // adjust the path to where your AuthService is

export interface EnrollmentStatusEvent {
    id: number;
    status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({ providedIn: 'root' })
export class LiveSyncService {
    private platformId = inject(PLATFORM_ID);
    private auth = inject(AuthService);
    private connection: HubConnection | null = null;
    private eventsSubject = new Subject<EnrollmentStatusEvent>();

    events$ = this.eventsSubject.asObservable();

    connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

    connect() {
        if (this.connection) return;

        if (!isPlatformBrowser(this.platformId)) return;

        const connection = new HubConnectionBuilder()
            .withUrl(environment.hubUrl, {
                accessTokenFactory: async () => {
                    // If the page was just reloaded, the in-memory token may not be
                    // restored yet, so try one refresh before giving up.
                    let token = this.auth.getAccessToken();
                    if (!token) {
                        await this.auth.refresh();
                        token = this.auth.getAccessToken();
                    }
                    return token ?? '';
                },
                withCredentials: false
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        this.connection = connection;

        connection.on(
            'ReceiveEnrollmentStatusUpdated',
            (enrollmentId: number, status: 'Pending' | 'Approved' | 'Rejected') => {
                this.eventsSubject.next({ id: enrollmentId, status });
            }
        );

        connection.onreconnecting(() => this.connectionState.set('reconnecting'));
        connection.onreconnected(() => this.connectionState.set('connected'));
        connection.onclose(() => {
            this.connectionState.set('disconnected');
            this.connection = null; // allow a later connect() to start fresh
        });

        connection
            .start()
            .then(() => this.connectionState.set('connected'))
            .catch(err => {
                console.error('SignalR connection error:', err);
                this.connectionState.set('disconnected');
                this.connection = null; // allow a later connect() to retry
            });
    }

    async disconnect() {
        const connection = this.connection;
        this.connection = null;
        if (connection) {
            await connection.stop();
        }
        this.connectionState.set('disconnected');
    }
}