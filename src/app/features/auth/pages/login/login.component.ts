import { Component, OnInit } from '@angular/core';
import { LoginMainFormComponent } from './login-main-form/login-main-form.component';
import { CommonModule } from '@angular/common'; // Required for *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginMainFormComponent, CommonModule], // Added CommonModule for *ngIf
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // 1. Define the property used in the template
  activeStep: string = '1';

  constructor() { }

  ngOnInit(): void {
    // If you had dynamic multi-step logic, you would handle it here.
    // For a simple login page, setting it to '1' is sufficient.
  }
}