import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { LiveSyncService } from './live-sync.service';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { vi } from 'vitest';

describe('LiveSyncService', () => {
  let service: LiveSyncService;

  const mockConnection = {
    on: vi.fn(),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.spyOn(HubConnectionBuilder.prototype, 'withUrl').mockReturnThis();
    vi.spyOn(HubConnectionBuilder.prototype, 'withAutomaticReconnect').mockReturnThis();
    vi.spyOn(HubConnectionBuilder.prototype, 'build').mockReturnValue(mockConnection as any);

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(LiveSyncService);
  });

  afterEach(() => {
  vi.restoreAllMocks();
  mockConnection.start.mockClear();
  mockConnection.on.mockClear();
  mockConnection.onreconnecting.mockClear();
  mockConnection.onreconnected.mockClear();
  mockConnection.onclose.mockClear();
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('connect() builds and starts a hub connection when running in the browser', () => {
    service.connect();
    expect(mockConnection.start).toHaveBeenCalled();
  });

  it('connect() does nothing on the server', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const serverService = TestBed.inject(LiveSyncService);
    serverService.connect();
    expect(mockConnection.start).not.toHaveBeenCalled();
  });
});