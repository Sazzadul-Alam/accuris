import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-card.component.html',
  styleUrls: ['./customer-card.component.css']
})
export class CustomerCardComponent {
  // Inputs for the component
  @Input() name: string = '';
  @Input() position: string = '';
  @Input() review: string = '';
  @Input() avatar_image_src: string = '';
  @Input() theme: 'light' | 'dark' = 'light'; // Default to 'light'
}
