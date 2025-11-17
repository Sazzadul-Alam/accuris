import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupUserConsentFormComponent } from './signup-user-consent-form.component';

describe('SignupUserConsentFormComponent', () => {
  let component: SignupUserConsentFormComponent;
  let fixture: ComponentFixture<SignupUserConsentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupUserConsentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupUserConsentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
