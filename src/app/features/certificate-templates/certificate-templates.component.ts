import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificateService } from '../../services/certificate.service';
import { CertificateTemplate, SaveCertificateTemplate } from '../../models/certificate.model';

@Component({
  selector: 'app-certificate-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-templates.component.html',
  styleUrl: './certificate-templates.component.scss'
})
export class CertificateTemplatesComponent {
  private readonly api = inject(CertificateService);
  readonly templates = signal<CertificateTemplate[]>([]);
  readonly message = signal('');
  editingId: number | null = null;
  form: SaveCertificateTemplate = this.emptyForm();

  ngOnInit(): void { this.load(); }
  load(): void {
    this.api.getTemplates().subscribe({
      next: rows => this.templates.set(rows),
      error: () => this.message.set('Could not load templates.')
    });
  }
  save(): void {
    if (!this.form.name.trim() || !this.form.institutionName.trim()) {
      this.message.set('Template name and institution name are required.'); return;
    }
    const request = this.editingId
      ? this.api.updateTemplate(this.editingId, this.form)
      : this.api.createTemplate(this.form);
    request.subscribe({
      next: () => { this.message.set('Template saved.'); this.reset(); this.load(); },
      error: err => this.message.set(err?.error?.message ?? 'Unable to save template.')
    });
  }
  edit(t: CertificateTemplate): void {
    this.editingId = t.id;
    const { id, ...rest } = t;
    this.form = { ...rest };
    this.message.set('');
  }
  reset(): void { this.editingId = null; this.form = this.emptyForm(); }
  private emptyForm(): SaveCertificateTemplate {
    return {
      name: '', institutionName: '', logoPath: null, signatureName: '',
      signatureTitle: '', certificateTitle: 'CERTIFICATE OF COMPLETION',
      bodyText: 'This is to certify that', minimumFinalGrade: 50,
      minimumAttendancePercent: 0, requireCompletedEnrollment: false,
      requireAllPublishedAssessments: true, isActive: true
    };
  }
}
