import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CreditCertificateModalComponent} from "../credit-certificate-modal/credit-certificate-modal.component";


enum Status {
  draft = "Draft",
  in_progress = "In Progress",
  completed = "Completed",
  nothing = "Nothing"
}
@Component({
  selector: 'app-individual-statistics',
  templateUrl: './individual-statistics.component.html',
  styleUrls: ['./individual-statistics.component.css']
})
export class IndividualStatisticsComponent implements OnInit {
  Status = Status;
  isPaymentModalOpen = false;
  runningProcesses: Record<string, boolean> = {
    'Individual Information': false,
    'Request Verification': false,
    'Payment Information': false,
    'AI Engine Process': false,
    'Credit Certificate': false,
  };
  stepStatus: Record<string, Status> = {
    'Individual Information': Status.nothing,
    'Request Verification': Status.nothing,
    'Payment Information': Status.nothing,
    'AI Engine Process': Status.nothing,
    'Credit Certificate': Status.nothing
  }
  skipVerification() {
    this.runningProcesses['Payment Information'] = true;
    this.stepStatus['Request Verification'] = Status.completed;
  }
  radius = 30;
  circumference = 2 * Math.PI * this.radius;
  growthPercent = 40;
  staticPercent = 60;
  progressValue = 40;
  last_year: any = 2024;
  this_year: any = 2025;
  yAxisTicks = 4;
  profiles: any=[];
  svgWidth = 300;
  svgHeight = 100;
  thisYearData: number[] = [15000, 22000, 18000, 26000, 20000, 28000, 23000];
  lastYearData: number[] = [12000, 16000, 14000, 19000, 17000, 21000, 18000];
  showBusinessCreditModal = false;
  selectedTab = 0;
  showIndividualModal = false;
  showCreditCerModal = false;
  padding = 10;
  selectedPlan = "";
  isPricingModalOpen = false;
  userImage: any;
  currentUserId: any = null;
  fullName = '';
  bsModalRef: BsModalRef;

  constructor(
    private modalService: BsModalService) {
  }

  ngOnInit() {
    this.fullName = localStorage.getItem('userName');
  }

  get growthDashArray(): string {
    return `${(this.growthPercent / 100) * this.circumference} ${this.circumference}`;
  }
  get maxValue(): number {
    return Math.max(...this.thisYearData, ...this.lastYearData);
  }
  get staticDashArray(): string {
    return `${(this.staticPercent / 100) * this.circumference} ${this.circumference}`;
  }

  get growthOffset(): number {
    return -((this.staticPercent / 100) * this.circumference);
  }
  dashOffset = this.circumference;


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
  clicked_ai_engine(){

  }
  openPaymentModal() {
    this.isPaymentModalOpen = true;
    // document.body.style.overflow = 'auto';
  }
  openBusinessCreditModal() {
    this.showBusinessCreditModal = true;
  }
  openIndividualCreditScoringModal(selectedPlan: string) {
    if (this.runningProcesses['Individual Information']) {
      console.log('Opening individual credit scoring modal');
      this.showIndividualModal = true;
    }
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
  openIndividualModal() {
    if (this.runningProcesses['Individual Information']) {
      console.log('Opening individual modal');
      this.showIndividualModal = true;
    }
  }
  closeIndividualModal() {
    console.log('Closing individual modal');
    this.showIndividualModal = false;
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
  closePaymentModal() {
    this.isPaymentModalOpen = false;
    document.body.style.overflow = 'auto';
  }
  onPaymentComplete(paymentData: any) {
    console.log('Payment completed:', paymentData);
    this.selectedPlan = paymentData.plan;
    this.runningProcesses['AI Engine Process'] = true;
    this.stepStatus['Payment Information'] = Status.completed;
    this.stepStatus['AI Engine Process'] = Status.in_progress;
  }

  openCreditModal() {
    this.bsModalRef = this.modalService.show(CreditCertificateModalComponent, {
      class: 'modal-dialog modal-dialog-centered modal-sm',
      backdrop: 'static',
      keyboard: false,
    });
  }
}
