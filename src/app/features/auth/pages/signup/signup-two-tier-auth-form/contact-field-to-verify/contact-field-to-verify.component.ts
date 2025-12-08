import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-field-to-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-field-to-verify.component.html',
  styleUrls: ['./contact-field-to-verify.component.css']
})
export class ContactFieldToVerifyComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;

  // Use the FormControl's validity instead of custom logic
  get isValidInput(): boolean {
    return this.control.valid && !!this.control.value;
  }

  onSendClick(): void {
    if (this.isValidInput) {
      console.log('Sending verification to:', this.control.value);
      // Add your send logic here
    }
  }
}