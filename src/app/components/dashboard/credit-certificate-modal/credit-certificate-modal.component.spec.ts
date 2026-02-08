import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCertificateModalComponent } from './credit-certificate-modal.component';

describe('CreditCertificateModalComponent', () => {
  let component: CreditCertificateModalComponent;
  let fixture: ComponentFixture<CreditCertificateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCertificateModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCertificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
