import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CertificateService } from '../../services/certificate.service';
import { PublicCertificateVerification } from '../../models/certificate.model';

@Component({
  selector: 'app-certificate-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-verification.component.html',
  styleUrl: './certificate-verification.component.scss'
})
export class CertificateVerificationComponent {
  private readonly api = inject(CertificateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  code = '';
  readonly loading = signal(false);
  readonly result = signal<PublicCertificateVerification | null>(null);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) { this.code = code; this.verify(); }
  }

  verify(): void {
    if (!this.code.trim()) return;
    this.loading.set(true);
    this.result.set(null);
    this.api.verify(this.code.trim()).subscribe({
      next: data => { this.result.set(data); this.loading.set(false); },
      error: () => {
        this.result.set({
          isValid: false, status: 'NotFound',
          message: 'Verification could not be completed. Please check the code and try again.'
        });
        this.loading.set(false);
      }
    });
  }
}
