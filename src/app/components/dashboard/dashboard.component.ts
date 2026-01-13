import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard_service/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showIndividualModal = false;

  thisYearData: number[] = [15000, 22000, 18000, 26000, 20000, 28000, 23000];
  lastYearData: number[] = [12000, 16000, 14000, 19000, 17000, 21000, 18000];

  svgWidth = 300;
  svgHeight = 100;
  padding = 10;

  tables = {
    individual_credit: {selected:false},
    business_credit: {selected:false}
  };
  currentTable: string;
  progressValue = 40;

  radius = 30;
  circumference = 2 * Math.PI * this.radius;
  growthPercent = 40;
  staticPercent = 60;

  last_year: any = 2024;
  this_year: any = 2025;
  yAxisTicks = 4;


  get growthDashArray(): string {
    return `${(this.growthPercent / 100) * this.circumference} ${this.circumference}`;
  }

  get staticDashArray(): string {
    return `${(this.staticPercent / 100) * this.circumference} ${this.circumference}`;
  }

  get growthOffset(): number {
    return -((this.staticPercent / 100) * this.circumference);
  }
  dashOffset = this.circumference;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private dashboardService: DashboardService,
    ) {
  }
  ngOnInit() {
    this.currentTable ='individual_credit';
    this.tables[this.currentTable].selected = true;
    this.dashOffset = this.circumference - (this.progressValue / 100) * this.circumference;
    this.getData();
  }
  getData() {
    this.dashboardService.getdashboardInfo({
      page: 1,
      limit: 10
    })
      .subscribe(res => {

        }, error => {
       }
      );

  }

  get progressColor() {
    if (this.progressValue < 40) return '#ef4444';
    if (this.progressValue < 70) return '#f59e0b';
    return '#22c55e';
  }


  get maxValue(): number {
    return Math.max(...this.thisYearData, ...this.lastYearData);
  }

  getPoints(data: number[]) {
    const stepX = this.svgWidth / (data.length - 1);

    return data.map((value, index) => {
      const x = index * stepX;
      const y =
        this.svgHeight -
        (value / this.maxValue) * (this.svgHeight - this.padding);
      return { x, y };
    });
  }

  /** Smooth curve using cubic Bezier */
  generateCurvePath(data: number[]): string {
    const points = this.getPoints(data);
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const controlX = (prev.x + curr.x) / 2;

      d += ` C ${controlX} ${prev.y}, ${controlX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }
  get yAxisLabels() {
    const labels = [];
    const step = this.maxValue / this.yAxisTicks;

    for (let i = 0; i <= this.yAxisTicks; i++) {
      labels.push({
        value: Math.round(step * i),
        y:
          this.svgHeight -
          (step * i / this.maxValue) * (this.svgHeight - this.padding)
      });
    }

    return labels.reverse(); // top to bottom
  }
  openIndividualModal() {
    console.log('Opening individual modal');
    this.showIndividualModal = true;
  }

  openIndividualCreditScoringModal() {
    console.log('Opening individual credit scoring modal');
    this.showIndividualModal = true;
  }

  closeIndividualModal() {
    console.log('Closing individual modal');
    this.showIndividualModal = false;
  }

  handleFormSubmit(formData: any) {
    console.log('Form submitted:', formData);
    // You can add API call here to save the data
    alert('Form submitted successfully!');
    this.closeIndividualModal();
  }
  isSidebarOpen = false;


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  changeTable(table: string) {
    this.tables[this.currentTable].selected = false;
    this.currentTable = table;
    this.tables[this.currentTable].selected = true;
  }


}
