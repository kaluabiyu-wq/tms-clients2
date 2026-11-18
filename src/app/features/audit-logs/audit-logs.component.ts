import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuditFilter, AuditLog, AuditPage } from '../../models/audit.model';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-audit-logs', standalone: true, imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './audit-logs.component.html', styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent {
  private api = inject(AuditService);
  filter: AuditFilter = { page: 1, pageSize: 25 };
  result: AuditPage | null = null;
  selected: AuditLog | null = null;
  loading = false; error = '';
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true; this.error = '';
    this.api.get(this.filter).pipe(finalize(() => this.loading = false)).subscribe({
      next: value => this.result = value,
      error: err => this.error = err?.error?.detail || err?.error?.message || 'Unable to load audit history.'
    });
  }
  search(): void { this.filter.page = 1; this.load(); }
  clear(): void { this.filter = { page: 1, pageSize: 25 }; this.selected = null; this.load(); }
  previous(): void { if ((this.filter.page ?? 1) > 1) { this.filter.page = (this.filter.page ?? 1) - 1; this.load(); } }
  next(): void { if (this.result && (this.filter.page ?? 1) < this.result.totalPages) { this.filter.page = (this.filter.page ?? 1) + 1; this.load(); } }
  exportCsv(): void {
    this.api.export(this.filter).subscribe(blob => {
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = 'tms-audit-logs.csv'; a.click(); URL.revokeObjectURL(url);
    }, () => this.error = 'Unable to export audit history.');
  }
  pretty(value?: string | null): string {
    if (!value) return '—';
    try { return JSON.stringify(JSON.parse(value), null, 2); } catch { return value; }
  }
}
