import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  showIndividualModal = false;
  openIndividualCreditScoringModal() {
    console.log('Opening individual credit scoring modal');
    this.showIndividualModal = true;
  }

  logout() {

  }
}
