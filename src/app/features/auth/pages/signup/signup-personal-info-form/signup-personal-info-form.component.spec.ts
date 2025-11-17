import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPersonalInfoFormComponent } from './signup-personal-info-form.component';

describe('SignupPersonalInfoFormComponent', () => {
  let component: SignupPersonalInfoFormComponent;
  let fixture: ComponentFixture<SignupPersonalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPersonalInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupPersonalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
