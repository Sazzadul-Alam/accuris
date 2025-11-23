import { Component } from '@angular/core';
import { CustomerCardComponent } from './customer-card/customer-card.component';
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CustomerCardComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

}
