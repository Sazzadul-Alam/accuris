import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showIndividualModal = false;
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
    this.currentTable ='individual_credit';
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
