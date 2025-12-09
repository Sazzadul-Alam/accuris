import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualCreditScoringModalComponent } from './individual-credit-scoring-modal/individual-credit-scoring-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IndividualCreditScoringModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showIndividualModal = false;

  openIndividualModal() {
    this.showIndividualModal = true;
  }

  closeIndividualModal() {
    this.showIndividualModal = false;
  }

  handleFormSubmit(formData: any) {
    console.log('Form submitted:', formData);
    this.closeIndividualModal();
  }
}


//old code:
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { IndividualCreditScoringModalComponent } from './individual-credit-scoring-modal/individual-credit-scoring-modal.component';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
//   IndividualCreditScoringModalComponent
// })
// export class DashboardComponent implements OnInit {
//   showModal = false;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     // Initialize dashboard data
//     this.loadDashboardData();
//   }

//   loadDashboardData(): void {
//     // TODO: Load user data, credit score, processes, etc.
//     console.log('Loading dashboard data...');
//   }

//   // Modal Control
//   openIndividualCreditScoringModal(): void {
//     this.showModal = true;
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
//   }

//   closeModal(): void {
//     this.showModal = false;
//     document.body.style.overflow = 'auto'; // Re-enable scrolling
//   }

//   // Navigation Methods
//   navigateToProfile(): void {
//     console.log('Navigate to profile');
//     // TODO: Navigate to profile page
//   }

//   navigateToCreditHistory(): void {
//     console.log('Navigate to credit history');
//     // TODO: Navigate to credit history page
//   }

//   navigateToBusinessProfile(): void {
//     console.log('Navigate to business profile');
//     // TODO: Navigate to business profile page
//   }

//   navigateToIndividualProfile(): void {
//     console.log('Navigate to individual profile');
//     // TODO: Navigate to individual profile page
//   }

//   navigateToSettings(): void {
//     console.log('Navigate to settings');
//     // TODO: Navigate to settings page
//   }

//   navigateToHelpCenter(): void {
//     console.log('Navigate to help center');
//     // TODO: Navigate to help center page
//   }

//   // Plan Selection
//   selectPlan(planType: string): void {
//     console.log('Selected plan:', planType);
//     // TODO: Handle plan selection logic
//     this.openIndividualCreditScoringModal();
//   }

//   // Process Actions
//   viewProcess(processId: number): void {
//     console.log('View process:', processId);
//     // TODO: Handle process viewing logic
//   }

//   continueProcess(processId: number): void {
//     console.log('Continue process:', processId);
//     // TODO: Handle process continuation logic
//   }
// }