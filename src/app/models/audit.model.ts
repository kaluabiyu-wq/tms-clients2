export interface AuditLog {
  id: number; userId: string; action: string; entityName: string; entityId: string;
  oldValues?: string | null; newValues?: string | null; ipAddress?: string | null;
  timestamp: string; correlationId?: string | null;
}
export interface AuditPage { items: AuditLog[]; total: number; page: number; pageSize: number; totalPages: number; }
export interface AuditFilter { userId?: string; action?: string; entityName?: string; from?: string; to?: string; page?: number; pageSize?: number; }
