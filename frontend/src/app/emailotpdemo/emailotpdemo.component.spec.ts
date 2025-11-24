import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailOtpDemoComponent } from './emailotpdemo.component';

describe('EmailOtpDemoComponent', () => {
  let component: EmailOtpDemoComponent;
  let fixture: ComponentFixture<EmailOtpDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailOtpDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailOtpDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
