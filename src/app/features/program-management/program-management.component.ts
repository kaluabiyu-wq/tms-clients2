import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProgramService } from '../../services/program.service';
import { TrainingProgram } from '../../models/program.model';

@Component({ selector: 'app-program-management', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './program-management.component.html', styleUrl: './program-management.component.scss' })
export class ProgramManagementComponent {
  private readonly service = inject(ProgramService);
  readonly programs = signal<TrainingProgram[]>([]);
  readonly loading = signal(false); readonly saving = signal(false); readonly error = signal(''); readonly success = signal('');
  code = ''; name = ''; description = ''; durationMonths: number | null = null;
  constructor() { this.load(); }
  load(): void { this.loading.set(true); this.service.getPrograms().pipe(finalize(() => this.loading.set(false))).subscribe({ next: x => this.programs.set(x), error: e => this.error.set(e?.error?.message ?? 'Unable to load programs.') }); }
  create(): void {
    this.error.set(''); this.success.set('');
    if (!this.code.trim() || !this.name.trim()) { this.error.set('Program code and name are required.'); return; }
    this.saving.set(true);
    this.service.createProgram({ code: this.code.trim(), name: this.name.trim(), description: this.description.trim(), durationMonths: this.durationMonths })
      .pipe(finalize(() => this.saving.set(false))).subscribe({ next: p => { this.programs.update(list => [...list, p]); this.code = ''; this.name = ''; this.description = ''; this.durationMonths = null; this.success.set('Training program created.'); }, error: e => this.error.set(e?.error?.message ?? 'Could not create program.') });
  }
}
