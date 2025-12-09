import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-individual-credit-scoring-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './individual-credit-scoring-modal.component.html',
  styleUrls: ['./individual-credit-scoring-modal.component.css']
})
export class IndividualCreditScoringModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  currentStep = 1;
  totalSteps = 5;
  personalInfoForm!: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  steps = [
    { id: 1, name: "Person's Info", icon: 'user' },
    { id: 2, name: "Location", icon: 'location' },
    { id: 3, name: "Financial Info", icon: 'finance' },
    { id: 4, name: "Upload Info", icon: 'upload' },
    { id: 5, name: "User Consent", icon: 'consent' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      idNumber: ['', Validators.required],
      uploadId: ['']
    });
  }

  onStepClick(stepId: number) {
    this.currentStep = stepId;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.personalInfoForm.patchValue({ uploadId: file.name });
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLElement;
    fileInput?.click();
  }

  onSave() {
    if (this.personalInfoForm.valid) {
      console.log('Form saved:', this.personalInfoForm.value);
      // Save logic here
    }
  }

  onNext() {
    if (this.personalInfoForm.valid) {
      console.log('Moving to next step:', this.personalInfoForm.value);
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  close() {
    this.closeModal.emit();
  }

  returnHome() {
    console.log('Return home clicked');
    this.close();
  }
}