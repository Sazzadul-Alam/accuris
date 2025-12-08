import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup-nav',
  standalone: true,
  imports: [],
  templateUrl: './signup-nav.component.html',
  styleUrls: ['./signup-nav.component.scss']
})

// possible activeSteps:
// personal-info = 1
// 2t-auth = 2
// user-consent = 3

export class SignupNavComponent {
  @Input() activeStep: string = '3';
}
