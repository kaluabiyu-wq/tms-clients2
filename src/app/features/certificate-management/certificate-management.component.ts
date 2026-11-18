import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificateService } from '../../services/certificate.service';
import { CertificateDetails } from '../../models/certificate.model';

@Component({
  selector: 'app-certificate-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template:'./certificate-management.component.html',
  styleUrl:'./certificate-management.component.scss',
})
export class CertificateManagementComponent {
  private readonly api = inject(CertificateService);
  studentId: number | null = null;
  courseId: number | null = null;
  templateId: number | null = null;
  readonly items = signal<CertificateDetails[]>([]);
  readonly message = signal('');
  readonly busy = signal(false);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getAll().subscribe({
      next: rows => this.items.set(rows),
      error: () => this.message.set('Could not load certificates.')
    });
  }

  issue(): void {
    if (!this.studentId || !this.courseId) {
      this.message.set('Enter a valid student ID and course ID.');
      return;
    }
    this.busy.set(true);
    this.message.set('');
    this.api.issue({
      studentId: this.studentId,
      courseId: this.courseId,
      templateId: this.templateId || null
    }).subscribe({
      next: cert => {
        this.items.update(current => [cert, ...current]);
        this.message.set(`Certificate ${cert.serialNumber} issued successfully.`);
        this.busy.set(false);
      },
      error: err => {
        this.message.set(err?.error?.message ?? 'Certificate could not be issued. Check eligibility.');
        this.busy.set(false);
      }
    });
  }

  download(cert: CertificateDetails): void {
    this.api.download(cert.id).subscribe({
      next: blob => this.saveBlob(blob, `${cert.serialNumber}.pdf`),
      error: () => this.message.set('Unable to download this certificate.')
    });
  }

  revoke(cert: CertificateDetails): void {
    const reason = window.prompt('Enter the reason for revoking this certificate:');
    if (!reason?.trim()) return;
    this.api.revoke(cert.id, reason.trim()).subscribe({
      next: () => {
        this.items.update(list => list.map(x =>
          x.id === cert.id ? { ...x, status: 'Revoked', revocationReason: reason } : x));
        this.message.set(`Certificate ${cert.serialNumber} has been revoked.`);
      },
      error: () => this.message.set('Unable to revoke this certificate.')
    });
  }

  private saveBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
