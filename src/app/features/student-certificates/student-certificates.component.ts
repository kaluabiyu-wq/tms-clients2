import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../services/certificate.service';
import { CertificateDetails } from '../../models/certificate.model';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-certificates.component.html',
  styleUrl: './student-certificates.component.scss'
})
export class StudentCertificatesComponent {
  private readonly api = inject(CertificateService);
  readonly certificates = signal<CertificateDetails[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    // The API resolves the linked student using the authenticated NameIdentifier and Student.UserId.
    // Never take the current student's identity from a query parameter.
    this.api.getMyCertificates().subscribe({
      next: data => { this.certificates.set(data); this.loading.set(false); },
      error: () => { this.error.set('Could not load your certificates.'); this.loading.set(false); }
    });
  }

  download(cert: CertificateDetails): void {
    this.api.download(cert.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `${cert.serialNumber}.pdf`; a.click(); URL.revokeObjectURL(url);
      },
      error: () => this.error.set('Certificate download failed.')
    });
  }
}
