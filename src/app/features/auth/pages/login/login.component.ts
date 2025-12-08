import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Needed for things like *ngIf

@Component({
  selector: 'app-login',
  standalone: true, // Component is now standalone
  imports: [
    CommonModule,
    ReactiveFormsModule // Import required module for forms
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  // loading removed as authentication is removed

  // Removed private http: HttpClient from the constructor
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      // Renamed for clarity, keeping email validator for now
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Marks all fields as touched to display validation errors
      this.form.markAllAsTouched();
      console.log('Form is invalid. Cannot submit.');
      return;
    }

    // Authentication logic removed
    console.log('Form is valid and ready to submit (Authentication currently skipped):', this.form.value);

    // You can add your non-auth submission logic here if needed
  }
}