import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSubmit = new EventEmitter<any>();

  paymentForm!: FormGroup;
  paymentMethod: string = 'card';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{13,19}$/),
        this.cardNumberValidator
      ]],
      cardholderName: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      cvv: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{3,4}$/)
      ]],
      expiryDate: ['', [
        Validators.required,
        this.expiryDateValidator
      ]]
    });

    // Auto-format card number
    this.paymentForm.get('cardNumber')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedValue = this.formatCardNumber(value);
        if (formattedValue !== value) {
          this.paymentForm.get('cardNumber')?.setValue(formattedValue, { emitEvent: false });
        }
      }
    });

    // Auto-format expiry date
    this.paymentForm.get('expiryDate')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedValue = this.formatExpiryDate(value);
        if (formattedValue !== value) {
          this.paymentForm.get('expiryDate')?.setValue(formattedValue, { emitEvent: false });
        }
      }
    });
  }

  formatCardNumber(value: string): string {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  }

  formatExpiryDate(value: string): string {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    
    return cleaned;
  }

  cardNumberValidator(control: any) {
    if (!control.value) return null;
    
    // Remove spaces
    const value = control.value.replace(/\s/g, '');
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return (sum % 10) === 0 ? null : { invalidCard: true };
  }

  expiryDateValidator(control: any) {
    if (!control.value) return null;
    
    const value = control.value.replace(/\D/g, '');
    
    if (value.length !== 4) {
      return { invalidExpiry: true };
    }
    
    const month = parseInt(value.substring(0, 2), 10);
    const year = parseInt(value.substring(2, 4), 10);
    
    if (month < 1 || month > 12) {
      return { invalidExpiry: true };
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiredCard: true };
    }
    
    return null;
  }

  close(): void {
    if (this.paymentForm.dirty) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
      if (confirmClose) {
        this.closeModal.emit();
      }
    } else {
      this.closeModal.emit();
    }
  }

  onCancel(): void {
    this.close();
  }

  onProceed(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        ...this.paymentForm.value,
        paymentMethod: this.paymentMethod,
        transactionId: '21N03L2025',
        amount: 1980,
        timestamp: new Date().toISOString()
      };

      console.log('Processing payment:', paymentData);
      
      // Emit payment data
      this.paymentSubmit.emit(paymentData);
      
      // Show success message
      alert('✓ Payment processed successfully!');
      
      // Close modal after successful payment
      setTimeout(() => {
        this.closeModal.emit();
      }, 1000);
    } else {
      this.markFormGroupTouched(this.paymentForm);
      alert('✗ Please fill in all payment details correctly.');
    }
  }

  returnHome(): void {
    this.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      control?.markAsDirty();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for form validation display
  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get cardholderName() {
    return this.paymentForm.get('cardholderName');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  get expiryDate() {
    return this.paymentForm.get('expiryDate');
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field?.touched || field?.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return 'This field is required';
    }
    
    if (field.hasError('pattern')) {
      if (fieldName === 'cardNumber') {
        return 'Invalid card number format';
      }
      if (fieldName === 'cvv') {
        return 'CVV must be 3 or 4 digits';
      }
      if (fieldName === 'cardholderName') {
        return 'Only letters are allowed';
      }
    }
    
    if (field.hasError('invalidCard')) {
      return 'Invalid card number';
    }
    
    if (field.hasError('invalidExpiry')) {
      return 'Invalid expiry date';
    }
    
    if (field.hasError('expiredCard')) {
      return 'Card has expired';
    }
    
    if (field.hasError('minlength')) {
      return 'Name is too short';
    }

    return 'Invalid value';
  }
}