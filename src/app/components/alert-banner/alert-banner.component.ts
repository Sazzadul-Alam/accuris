import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  templateUrl: './alert-banner.component.html',
  styleUrls: ['./alert-banner.component.css']
})
export class AlertBannerComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() dismissible: boolean = true;
  @Input() autoDismiss: boolean = true;
  @Input() duration: number = 3000; // milliseconds

  @Output() dismissed = new EventEmitter<void>();

  private timeoutId: any;

  ngOnChanges(): void {
    if (this.show && this.autoDismiss) {
      this.startAutoDismiss();
    }
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  private startAutoDismiss(): void {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  dismiss(): void {
    this.show = false;
    this.dismissed.emit();
    this.clearTimeout();
  }

  getIconPath(): string {
    switch (this.type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return '';
    }
  }
}
