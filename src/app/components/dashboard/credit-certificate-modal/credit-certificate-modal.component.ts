import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-credit-certificate-modal',
  templateUrl: './credit-certificate-modal.component.html',
  styleUrls: ['./credit-certificate-modal.component.css']
})
export class CreditCertificateModalComponent {
  @Input() isOpen: boolean = false;
  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
  onClose() {
    // this.closeModal.emit();
    // this.resetModal();
  }

}
