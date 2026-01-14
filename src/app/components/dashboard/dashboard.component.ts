import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  /* -------------------- UI State -------------------- */
  isSidebarOpen = false;
  showIndividualModal = false;
  isPricingModalOpen = false;
  isPaymentModalOpen = false;

  selectedPlanForPayment: string | null = null;

  /* -------------------- Tabs -------------------- */
  tables = {
    individual_credit: { selected: false },
    business_credit: { selected: false }
  };
  currentTable!: keyof typeof this.tables;

  /* -------------------- Chart Data -------------------- */
  thisYearData: number[] = [15000, 22000, 18000, 26000, 20000, 28000, 23000];
  lastYearData: number[] = [12000, 16000, 14000, 19000, 17000, 21000, 18000];

  svgWidth = 300;
  svgHeight = 100;
  padding = 10;

  last_year = 2024;
  this_year = 2025;
  yAxisTicks = 4;

  /* -------------------- Donut Chart -------------------- */
  radius = 30;
  circumference = 2 * Math.PI * this.radius;
  growthPercent = 40;
  staticPercent = 60;
  progressValue = 40;

  ngOnInit(): void {
    this.currentTable = 'individual_credit';
    this.tables[this.currentTable].selected = true;
  }

  /* -------------------- Sidebar -------------------- */
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  /* -------------------- Tabs -------------------- */
  changeTable(table: keyof typeof this.tables) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = table;
    this.tables[this.currentTable].selected = true;
  }

  /* -------------------- Donut Helpers -------------------- */
  get growthDashArray(): string {
    return `${(this.growthPercent / 100) * this.circumference} ${this.circumference}`;
  }

  get staticDashArray(): string {
    return `${(this.staticPercent / 100) * this.circumference} ${this.circumference}`;
  }

  get growthOffset(): number {
    return -((this.staticPercent / 100) * this.circumference);
  }

  /* -------------------- Line Chart -------------------- */
  get maxValue(): number {
    return Math.max(...this.thisYearData, ...this.lastYearData);
  }

  getPoints(data: number[]) {
    const stepX = this.svgWidth / (data.length - 1);
    return data.map((value, index) => ({
      x: index * stepX,
      y: this.svgHeight - (value / this.maxValue) * (this.svgHeight - this.padding)
    }));
  }

  generateCurvePath(data: number[]): string {
    const points = this.getPoints(data);
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }

  get yAxisLabels() {
    const labels = [];
    const step = this.maxValue / this.yAxisTicks;
    for (let i = 0; i <= this.yAxisTicks; i++) {
      labels.push({
        value: Math.round(step * i),
        y: this.svgHeight - (step * i / this.maxValue) * (this.svgHeight - this.padding)
      });
    }
    return labels.reverse();
  }

  /* -------------------- Modals -------------------- */
  openIndividualCreditScoringModal() {
    this.showIndividualModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeIndividualModal() {
    this.showIndividualModal = false;
    document.body.style.overflow = 'auto';
  }

  openPricingModal() {
    this.isPricingModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePricingModal() {
    this.isPricingModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  onPlanSelected(planName: string) {
    this.selectedPlanForPayment = planName;
    this.isPricingModalOpen = false;

    setTimeout(() => {
      this.isPaymentModalOpen = true;
      document.body.style.overflow = 'hidden';
    }, 200);
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  onPaymentComplete(paymentData: any) {
    console.log('Payment completed:', paymentData);
  }
}
