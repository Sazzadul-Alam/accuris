import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IndividualCreditScoringModalComponent } from './individual-credit-scoring-modal/individual-credit-scoring-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IndividualCreditScoringModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showIndividualModal = false;

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
}
