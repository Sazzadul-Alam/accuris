// payment-modal.component.ts - COMPLETE FIXED VERSION
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { jsPDF } from 'jspdf'; // Static import at the top

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() selectedPlan: string = 'Advanced'; // Default value
  @Input() userName: string = 'Sanjit Ara Kabir'; // Default value
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentComplete = new EventEmitter<any>();

  // Payment form fields
  paymentMethod: string = 'creditCard';
  cardNumber: string = '';
  cardholderName: string = '';
  cvv: string = '';
  expiryDate: string = '';

  // Form validation
  isFormValid: boolean = false;

  // Payment state
  isPaymentSuccessful: boolean = false;

  // Order details
  transactionId: string = '';
  balanceAmount: number = 2100;
  vatAmount: number = 440;
  discountAmount: number = 560;
  totalAmount: number = 1980;
  planDescription: string = 'Provides essential credit scoring based on key financial inputs and business profile data. Ideal for startups and small businesses';

  // Date and time
  currentDay: string = '';
  currentDateTime: string = '';

  ngOnInit() {
    console.log('Payment modal initialized with plan:', this.selectedPlan);
    console.log('Payment modal initialized with userName:', this.userName);
    
    this.generateTransactionId();
    this.updateDateTime();
    this.setPlanDetails();
  }

  generateTransactionId() {
    const prefix = '21N03L';
    const year = new Date().getFullYear();
    this.transactionId = `${prefix}${year}`;
  }

  updateDateTime() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    this.currentDay = days[now.getDay()];
    
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    this.currentDateTime = `${month} ${day}, ${year} | ${displayHours}:${minutes} ${ampm}`;
  }

  setPlanDetails() {
    const planData: any = {
      'Basic': {
        amount: 75,
        description: 'Unleash the power of automation.'
      },
      'Advanced': {
        amount: 2100,
        description: 'Provides essential credit scoring based on key financial inputs and business profile data. Ideal for startups and small businesses'
      },
      'Holistic': {
        amount: 245,
        description: 'Automation plus enterprise-grade features.'
      }
    };

    if (planData[this.selectedPlan]) {
      this.balanceAmount = planData[this.selectedPlan].amount;
      this.planDescription = planData[this.selectedPlan].description;
      
      this.vatAmount = Math.round(this.balanceAmount * 0.21);
      this.discountAmount = Math.round((this.balanceAmount + this.vatAmount) * 0.20);
      this.totalAmount = this.balanceAmount + this.vatAmount - this.discountAmount;
    }
  }

  onPaymentMethodChange() {
    if (this.paymentMethod === 'paypal') {
      this.isFormValid = true;
    } else {
      this.validateForm();
    }
  }

  formatCardNumber() {
    let value = this.cardNumber.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formatted;
    this.validateForm();
  }

  formatExpiryDate() {
    let value = this.expiryDate.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.expiryDate = value;
    this.validateForm();
  }

  validateForm() {
    if (this.paymentMethod === 'paypal') {
      this.isFormValid = true;
      return;
    }

    const cardNumberClean = this.cardNumber.replace(/\s/g, '');
    const isCardNumberValid = cardNumberClean.length >= 13 && cardNumberClean.length <= 19;
    const isCardholderValid = this.cardholderName.trim().length > 0;
    const isCvvValid = this.cvv.length >= 3 && this.cvv.length <= 4;
    const isExpiryValid = this.expiryDate.length === 5 && this.expiryDate.includes('/');
    
    this.isFormValid = isCardNumberValid && isCardholderValid && isCvvValid && isExpiryValid;
  }

  toggleMoreOptions() {
    console.log('More payment options clicked');
  }

  onProceed() {
    if (!this.isFormValid) {
      return;
    }

    setTimeout(() => {
      this.isPaymentSuccessful = true;
      this.paymentComplete.emit({
        transactionId: this.transactionId,
        amount: this.totalAmount,
        plan: this.selectedPlan
      });
    }, 500);
  }

  /**
   * Download receipt as PDF - FIXED VERSION WITH SAFETY CHECKS
   */
  downloadReceipt() {
    console.log('=== PDF Download Started ===');
    console.log('Selected Plan:', this.selectedPlan);
    console.log('User Name:', this.userName);
    console.log('Transaction ID:', this.transactionId);
    
    try {
      // Ensure all values are strings (not undefined)
      const planName = this.selectedPlan || 'Advanced';
      const userName = this.userName || 'Customer';
      const transactionId = this.transactionId || 'N/A';
      const planDesc = this.planDescription || 'Credit scoring service';
      
      console.log('Creating PDF with safe values...');
      
      const doc = new jsPDF();
      
      // Set font
      doc.setFont('helvetica');
      
      // Add logo/company name
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ACCURIS', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Trust Quantified', 105, 26, { align: 'center' });
      
      console.log('Header added');
      
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT RECEIPT', 105, 40, { align: 'center' });
      
      // Add horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // Add payment successful message
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text('Payment Successful', 105, 55, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      
      console.log('Title and success message added');
      
      // Add customer info
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('For:', 20, 70);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(32, 192, 160);
      doc.text(userName, 35, 70); // Using safe value
      doc.setTextColor(0, 0, 0);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Plan:', 20, 78);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(32, 192, 160);
      doc.text(planName, 35, 78); // Using safe value
      doc.setTextColor(0, 0, 0);
      
      console.log('Customer info added');
      
      // Add payment summary box
      doc.setLineWidth(0.3);
      doc.rect(20, 90, 170, 100);
      
      // Payment Summary title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Summary', 105, 100, { align: 'center' });
      
      // Add horizontal line under title
      doc.setLineWidth(0.2);
      doc.line(25, 103, 185, 103);
      
      // Plan details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(planName + ' Plan', 25, 112); // Using safe value
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      // Split long description
      const descLines = doc.splitTextToSize(planDesc, 160); // Using safe value
      doc.text(descLines, 25, 118);
      
      console.log('Plan details added');
      
      // Calculate current Y position
      let currentY = 118 + (descLines.length * 4) + 5;
      doc.line(25, currentY, 185, currentY);
      currentY += 8;
      
      // Transaction ID
      doc.setFontSize(9);
      doc.text('Transaction ID:', 25, currentY);
      doc.text(transactionId, 185, currentY, { align: 'right' }); // Using safe value
      currentY += 8;
      
      doc.line(25, currentY, 185, currentY);
      currentY += 8;
      
      // Amount
      doc.text('Amount:', 25, currentY);
      doc.text('$' + this.balanceAmount.toString(), 185, currentY, { align: 'right' });
      currentY += 6;
      
      // VAT
      doc.text('Vat (21%):', 25, currentY);
      doc.text('$' + this.vatAmount.toString(), 185, currentY, { align: 'right' });
      currentY += 6;
      
      // Discount
      doc.text('Discount:', 25, currentY);
      doc.setTextColor(239, 68, 68);
      doc.text('-$' + this.discountAmount.toString(), 185, currentY, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      currentY += 8;
      
      doc.line(25, currentY, 185, currentY);
      currentY += 8;
      
      // Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Total:', 25, currentY);
      doc.text('$' + this.totalAmount.toString(), 185, currentY, { align: 'right' });
      
      console.log('Financial details added');
      
      // Date and time
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(this.currentDay || 'Today', 105, 270, { align: 'center' });
      doc.text(this.currentDateTime || new Date().toLocaleString(), 105, 276, { align: 'center' });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your business!', 105, 285, { align: 'center' });
      
      console.log('Date and footer added');
      
      // Save the PDF
      const filename = 'Receipt_' + transactionId + '.pdf';
      doc.save(filename);
      
      console.log('=== PDF Saved Successfully:', filename, '===');
      
    } catch (error: any) {
      console.error('=== PDF Generation Error ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert('Error generating receipt: ' + (error.message || 'Unknown error'));
    }
  }

  backToDashboard() {
    this.closeModal.emit();
    this.resetModal();
  }

  returnHome() {
    this.closeModal.emit();
    this.resetModal();
  }

  resetModal() {
    this.isPaymentSuccessful = false;
    this.cardNumber = '';
    this.cardholderName = '';
    this.cvv = '';
    this.expiryDate = '';
    this.isFormValid = false;
    this.paymentMethod = 'creditCard';
  }

  onClose() {
    this.closeModal.emit();
    this.resetModal();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}