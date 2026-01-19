import { Component, EventEmitter, Output, HostListener } from '@angular/core';

interface Plan {
  price: number;
  name: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isHighlighted?: boolean;
}

@Component({
  selector: 'app-pricing-plans-modal',
  templateUrl: './pricing-plans-modal.component.html',
  styleUrls: ['./pricing-plans-modal.component.css']
})
export class PricingPlansModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() planSelected = new EventEmitter<string>();

  plans: Plan[] = [
    {
      price: 199,
      name: 'Basic',
      description: 'Unleash the power of automation.',
      features: [
        'Multi-step Zap',
        '3 Premium Apps',
        '2 Users Team'
      ],
      isPopular: false,
      isHighlighted: false
    },
    {
      price: 249,
      name: 'Advanced',
      description: 'Automation tools to take your work to the next level.',
      features: [
        'Multi-step Zap',
        'Unlimited Premium',
        '50 Users team',
        'Shared Workspace'
      ],
      isPopular: false,
      isHighlighted: true
    },
    {
      price: 459,
      name: 'Holistic',
      description: 'Automation plus enterprise-grade features.',
      features: [
        'Multi-step Zaps',
        'Unlimited Premium',
        'Unlimited user Team',
        'Advanced Admin',
        'Custom Data Retention'
      ],
      isPopular: true,
      isHighlighted: false
    }
  ];

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    this.onClose();
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSelectPlan(planName: string): void {
    this.planSelected.emit(planName);
    console.log('Selected plan:', planName);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}