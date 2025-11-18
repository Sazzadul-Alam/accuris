import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-field-to-verify',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-field-to-verify.component.html',
  styleUrls: ['./contact-field-to-verify.component.scss']
})
export class ContactFieldToVerifyComponent {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl; // Change this from formControlName to control
}