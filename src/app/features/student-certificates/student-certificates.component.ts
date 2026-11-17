import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../services/certificate.service';
import { CertificateDetails } from '../../models/certificate.model';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule],
  template: `
  <main class="page">
    <h1>My certificates</h1>
    <p>Certificates issued for your completed training courses.</p>
    @if (error()) { <p class="error">{{ error() }}</p> }
    @if (loading()) { <p>Loading certificates…</p> }
    @if (!loading() && certificates().length === 0) { <section class="empty">No certificates have been issued yet.</section> }
    <section class="grid">
      @for (cert of certificates(); track cert.id) {
        <article class="card">
          <div class="top"><span class="seal">✓</span><span [class.revoked]="cert.status === 'Revoked'">{{ cert.status }}</span></div>
          <h2>{{ cert.courseName }}</h2>
          <p>Certificate No. {{ cert.serialNumber }}</p>
          <small>Issued {{ cert.issuedAt | date:'longDate' }}</small>
          <div class="actions">
            <button (click)="download(cert)" [disabled]="cert.status !== 'Issued'">Download PDF</button>
            <a [href]="'/certificate-verification/' + cert.verificationCode">Verify</a>
          </div>
        </article>
      }
    </section>
  </main>`,
  styles: [`
    .page{max-width:1100px;margin:35px auto;padding:0 20px;color:#172033}h1{font-size:28px;margin-bottom:6px}
    p{color:#667085}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:24px}
    .card,.empty{border:1px solid #e4e7ec;border-radius:14px;padding:22px;background:white}
    .top{display:flex;justify-content:space-between;align-items:center}.seal{background:#ecfdf3;color:#027a48;border-radius:50%;padding:9px}
    h2{font-size:19px;margin:20px 0 8px}.actions{display:flex;align-items:center;gap:15px;margin-top:20px}
    button{background:#2457c5;color:white;border:0;border-radius:8px;padding:10px 14px;cursor:pointer}
    a{color:#2457c5}.revoked,.error{color:#b42318}.empty{margin-top:20px}
  `]
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
