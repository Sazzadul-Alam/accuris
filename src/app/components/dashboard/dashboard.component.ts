import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard_service/dashboard.service";
import { UserName } from "../../services/dashboard_service/dashboard.service";

enum Status {
  draft = "Draft",
  in_progress = "In Progress",
  completed = "Completed",
  nothing = "Nothing"
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  selectedTab = 0;


  showBusinessCreditModal = false;

  openBusinessCreditModal() {
    this.showBusinessCreditModal = true;
  }

  closeBusinessCreditModal() {
    this.showBusinessCreditModal = false;
  }

  currentUserId: number = null;
  currentUserName: UserName;
  fullName = '';
  selectedPlan = "";

  Status = Status;

  stepStatus: Record<string, Status> = {
    'Individual Information': Status.nothing,
    'Request Verification': Status.nothing,
    'Payment Information': Status.nothing,
    'AI Engine Process': Status.nothing,
    'Credit Certificate': Status.nothing
  }

  runningProcesses: Record<string, boolean> = {
    'Individual Information': false,
    'Request Verification': false,
    'Payment Information': false,
    'AI Engine Process': false,
    'Credit Certificate': false,
  };
  showIndividualModal = false;
  isPricingModalOpen = false;
  isPaymentModalOpen = false;

  selectedPlanForPayment: string | null = null;

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


  skipVerification() {
    this.runningProcesses['Payment Information'] = true;
    this.stepStatus['Request Verification'] = Status.completed;
  }

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
    const token = localStorage.getItem('access_token');

    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      console.log('JWT sub:', decodedPayload.sub);

      // Step 1: Get userId from email
      this.dashboardService.getUserIdFromEmail(decodedPayload.sub)
        .subscribe(currentUserId => {
          console.log('Fetched userId:', currentUserId);
          this.currentUserId = currentUserId;

          if (currentUserId) {
            // Step 2: Get username from userId
            this.dashboardService.getUserNameFromId(currentUserId)
              .subscribe(userName => {
                if (userName) {
                  console.log('Fetched userName:', userName);
                  this.currentUserName = userName; // <-- store in class variable
                  this.fullName = `${userName.firstName} ${userName.lastName}`;
                } else {
                  console.log('User name not found');
                }
              });
          }
        });
    }

    // Dashboard setup
    this.currentTable = 'individual_credit';
    this.tables[this.currentTable].selected = true;
    this.dashOffset = this.circumference - (this.progressValue / 100) * this.circumference;
    // this.getData();
  }


  // getData() {
  //   this.dashboardService.getdashboardInfo({
  //     page: 1,
  //     limit: 10
  //   })
  //     .subscribe(res => {
  //
  //       }, error => {
  //      }
  //     );
  //
  // }

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
    if (this.runningProcesses['Individual Information']) {
    console.log('Opening individual modal');
    this.showIndividualModal = true;
    }
  }

  openIndividualCreditScoringModal(selectedPlan: string) {
    if (this.runningProcesses['Individual Information']) {
    console.log('Opening individual credit scoring modal');
    this.showIndividualModal = true;
    }
  }

  closeIndividualModal() {
    console.log('Closing individual modal');
    this.showIndividualModal = false;
  }
  openPricingModal() {
    this.isPricingModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePricingModal() {
    this.isPricingModalOpen = false;
    document.body.style.overflow = 'auto';
  }
  handleFormSubmit(formData: any) {
    console.log('Form submitted:', formData);
    this.runningProcesses["Request Verification"] = true;

    this.stepStatus['Individual Information'] = Status.completed;
    this.stepStatus['Request Verification'] = Status.in_progress;
    // You can add API call here to save the data
    // alert('Form submitted successfully!');
    this.closeIndividualModal();
  }
  isSidebarOpen = false;


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  changeTab(tab: string) {
    if (tab === 'individual_credit') {
      this.selectedTab = 0;
    }
    else {
      this.selectedTab = 1;
    }
    this.tables[this.currentTable].selected = false;
    this.currentTable = tab;
    this.tables[this.currentTable].selected = true;
  }
  onPlanSelected(planName: string) {
    // this.selectedPlanForPayment = planName;
    this.isPricingModalOpen = false;
    this.runningProcesses['Individual Information'] = true;
    this.openIndividualModal();
    this.selectedPlan = planName;
    // setTimeout(() => {
    //   this.isPaymentModalOpen = true;
    //   document.body.style.overflow = 'hidden';
    // }, 200);
  }

  closePaymentModal() {
    this.isPaymentModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  openPaymentModal() {
    this.isPaymentModalOpen = true;
    // document.body.style.overflow = 'auto';
  }

  onPaymentComplete(paymentData: any) {
    console.log('Payment completed:', paymentData);
    this.selectedPlan = paymentData.plan;
    this.runningProcesses['AI Engine Process'] = true;
    this.stepStatus['Payment Information'] = Status.completed;
    this.stepStatus['AI Engine Process'] = Status.in_progress;
  }

  clicked_ai_engine() {
    // this.
  }

}
