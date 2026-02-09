import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CreditScore {
  name: string;
  plan: string;
  isNew: boolean;
  creditRating: 'Good' | 'Bad' | 'Fair';
  creditRisk: 'Low' | 'High' | 'Medium';
  individualCreditScoring: string;
  ratingDetails: string[];
}

@Component({
  selector: 'app-credit-certificate-modal',
  templateUrl: './credit-certificate-modal.component.html',
  styleUrls: ['./credit-certificate-modal.component.css']
})
export class CreditCertificateModalComponent {
  @Input() isOpen: boolean = false;
  @Input() creditScores: CreditScore[] = [];
  @Output() closeModal = new EventEmitter<void>();

  // Default data if none provided
  defaultCreditScores: CreditScore[] = [
    {
      name: 'Sanjit Ara Kabir',
      plan: 'Advance',
      isNew: true,
      creditRating: 'Good',
      creditRisk: 'Low',
      individualCreditScoring: 'Individual Credit Scoring',
      ratingDetails: [
        'Credit Rating is Good',
        'Credit Risk is Low'
      ]
    },
    {
      name: 'Sanjit Ara Kabir',
      plan: 'Basic',
      isNew: true,
      creditRating: 'Bad',
      creditRisk: 'High',
      individualCreditScoring: 'Individual Credit Scoring',
      ratingDetails: [
        'Credit Rating is Bad',
        'Credit Risk is High'
      ]
    },
    {
      name: 'Rahul Kabir',
      plan: 'Enterprise',
      isNew: false,
      creditRating: 'Fair',
      creditRisk: 'Medium',
      individualCreditScoring: 'Individual Credit Scoring',
      ratingDetails: [
        'Credit Rating is Fair',
        'Credit Risk is Medium'
      ]
    }
  ];

  ngOnInit() {
    // Use provided scores or default ones
    if (!this.creditScores || this.creditScores.length === 0) {
      this.creditScores = this.defaultCreditScores;
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  // Get meter class based on credit rating
  getMeterClass(rating: string): string {
    switch (rating.toLowerCase()) {
      case 'good':
        return 'good';
      case 'bad':
        return 'bad';
      case 'fair':
        return 'fair';
      default:
        return 'fair';
    }
  }

  // Get rating text color class
  getRatingClass(rating: string): string {
    switch (rating.toLowerCase()) {
      case 'good':
        return 'good-text';
      case 'bad':
        return 'bad-text';
      case 'fair':
        return 'fair-text';
      default:
        return 'fair-text';
    }
  }

  // Get needle rotation based on rating
  getNeedleRotation(rating: string): string {
    switch (rating.toLowerCase()) {
      case 'good':
        return 'rotate(45deg)'; // Points to green (right side)
      case 'bad':
        return 'rotate(-45deg)'; // Points to red (left side)
      case 'fair':
        return 'rotate(0deg)'; // Points to yellow (middle)
      default:
        return 'rotate(0deg)';
    }
  }

  onSeeMore(score: CreditScore) {
    console.log('See more clicked for:', score.name);
    // Implement see more functionality
  }
}
