import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showIndividualModal = false;
  isPricingModalOpen = false;
  isPaymentModalOpen = false; // ADD THIS - for payment modal
  selectedPlanForPayment: string = 'Advanced'; // ADD THIS - store selected plan
  
  tables = {
    individual_credit: {selected:false},
    business_credit: {selected:false}
  };
  currentTable: string;
  progressValue = 40;

  radius = 30;
  circumference = 2 * Math.PI * this.radius;

  dashOffset = this.circumference;

  ngOnInit() {
    this.currentTable = 'individual_credit';
    this.tables[this.currentTable].selected = true;
    this.dashOffset = this.circumference - (this.progressValue / 100) * this.circumference;
  }
  
  get progressColor() {
    if (this.progressValue < 40) return '#ef4444';
    if (this.progressValue < 70) return '#f59e0b';
    return '#22c55e';
  }
  
  openIndividualModal() {
    console.log('Opening individual modal');
    this.showIndividualModal = true;
    document.body.style.overflow = 'hidden';
  }

  openIndividualCreditScoringModal() {
    console.log('Opening individual credit scoring modal');
    this.showIndividualModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeIndividualModal() {
    console.log('Closing individual modal');
    this.showIndividualModal = false;
    document.body.style.overflow = 'auto';
  }

  handleFormSubmit(formData: any) {
    console.log('Form submitted:', formData);
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

  // Pricing Modal Methods
  openPricingModal(): void {
    console.log('Opening pricing modal');
    this.isPricingModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePricingModal(): void {
    console.log('Closing pricing modal');
    this.isPricingModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  // UPDATED - This now opens payment modal instead of alert
  onPlanSelected(planName: string): void {
    console.log('User selected plan:', planName);
    
    // Store the selected plan
    this.selectedPlanForPayment = planName;
    
    // Close pricing modal
    this.isPricingModalOpen = false;
    
    // Open payment modal after short delay
    setTimeout(() => {
      console.log('Opening payment modal for plan:', this.selectedPlanForPayment);
      this.isPaymentModalOpen = true;
      document.body.style.overflow = 'hidden';
    }, 200);
  }

  // ADD THIS - Close payment modal
  closePaymentModal(): void {
    console.log('Closing payment modal');
    this.isPaymentModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  // ADD THIS - Handle payment completion
  onPaymentComplete(paymentData: any): void {
    console.log('Payment completed:', paymentData);
    // You can add logic here to:
    // - Save payment to database
    // - Update user subscription
    // - Navigate to confirmation page
    // - etc.
  }
}