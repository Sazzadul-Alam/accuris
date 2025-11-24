import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpFieldToVerifyComponent } from './otp-field-to-verify.component';

describe('OtpFieldToVerifyComponent', () => {
  let component: OtpFieldToVerifyComponent;
  let fixture: ComponentFixture<OtpFieldToVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpFieldToVerifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtpFieldToVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
