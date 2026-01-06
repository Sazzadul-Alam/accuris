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

  ngOnInit() {
    this.currentTable ='individual_credit';
    this.tables[this.currentTable].selected = true;
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
