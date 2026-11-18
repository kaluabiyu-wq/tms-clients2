import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AnalyticsChartComponent } from '../../ui/analytics-chart/analytics-chart.componenet';
import { DashboardSummary, GeneratedReport, ReportFilter, ReportFormat, ReportPage, ReportType } from '../../models/report.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-institutional-reports', standalone: true,
  imports: [CommonModule, FormsModule, AnalyticsChartComponent],
  templateUrl: './institutional-reports.component.html', styleUrl: './institutional-reports.component.scss'
})
export class InstitutionalReportsComponent {
  private readonly reports = inject(ReportService);
  readonly types: { key: ReportType; label: string }[] = [
    {key:'students',label:'Students'}, {key:'enrollment',label:'Enrollments'}, {key:'courses',label:'Courses'},
    {key:'attendance',label:'Attendance'}, {key:'performance',label:'Performance'}, {key:'certificates',label:'Certificates'},
    {key:'instructors',label:'Instructors'}, {key:'completion',label:'Completion'}
  ];
  readonly selectedType = signal<ReportType>('enrollment');
  readonly summary = signal<DashboardSummary | null>(null);
  readonly result = signal<ReportPage | null>(null);
  readonly loading = signal(false);
  readonly exporting = signal(false);
  readonly error = signal('');
  readonly search = signal('');
  readonly from = signal('');
  readonly to = signal('');
  readonly passMark = signal(50);
  readonly page = signal(1);
  readonly pageSize = 20;
  readonly generated = signal<GeneratedReport | null>(null);
  readonly columns = computed(() => Object.keys(this.result()?.items[0] ?? {}));
  readonly pageNumbers = computed(() => {
    const total = this.result()?.totalPages ?? 0;
    return Array.from({length: Math.min(total, 7)}, (_, i) => i + 1);
  });

  constructor() { this.loadDashboard(); this.loadReport(); }
  select(type: ReportType): void { this.selectedType.set(type); this.page.set(1); this.loadReport(); }
  loadDashboard(): void {
    this.reports.dashboard({from:this.from() || undefined,to:this.to() || undefined,passMark:this.passMark()})
      .subscribe({next:value=>this.summary.set(value),error:()=>this.error.set('Could not load institutional dashboard data.')});
  }
  loadReport(): void {
    this.loading.set(true); this.error.set('');
    const filter: ReportFilter = {from:this.from()||undefined,to:this.to()||undefined,search:this.search()||undefined,page:this.page(),pageSize:this.pageSize,passMark:this.passMark()};
    this.reports.getReport(this.selectedType(),filter).pipe(finalize(()=>this.loading.set(false))).subscribe({
      next:value=>this.result.set(value), error:err=>{this.result.set(null);this.error.set(err?.error?.message ?? 'Unable to load this report. Please try again.');}
    });
  }
  applyFilters(): void { this.page.set(1); this.loadDashboard(); this.loadReport(); }
  changePage(value: number): void { if(value>=1 && value<=(this.result()?.totalPages??1)){this.page.set(value);this.loadReport();} }
  generate(format: ReportFormat): void {
    this.exporting.set(true); this.error.set(''); this.generated.set(null);
    this.reports.generate({reportType:this.selectedType(),format,from:this.from()||undefined,to:this.to()||undefined,search:this.search()||undefined,passMark:this.passMark()})
      .pipe(finalize(()=>this.exporting.set(false))).subscribe({
        next:report=>{this.generated.set(report);if(report.status==='Completed')this.download(report);else if(report.status==='Failed')this.error.set(report.errorMessage??'Report generation failed.');},
        error:err=>this.error.set(err?.error?.message??'Report generation failed.')
      });
  }
  download(report: GeneratedReport): void {
    this.reports.download(report.id).subscribe({next:blob=>{
      const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=report.fileName??`tms-${report.reportType}.${report.format}`;anchor.click();URL.revokeObjectURL(url);
    },error:()=>this.error.set('The report file could not be downloaded.')});
  }
  display(value: unknown): string {
    if(value===null||value===undefined||value==='')return '—';
    if(typeof value==='string' && /^\d{4}-\d{2}-\d{2}T/.test(value)){const date=new Date(value);return Number.isNaN(date.valueOf())?value:date.toLocaleString();}
    return String(value);
  }
  trackColumn(_: number, item: string): string { return item; }
  trackRow(index: number): number { return index; }
}
