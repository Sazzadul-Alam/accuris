import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupTwoTierAuthFormComponent } from './signup-two-tier-auth-form.component';

describe('SignupTwoTierAuthFormComponent', () => {
  let component: SignupTwoTierAuthFormComponent;
  let fixture: ComponentFixture<SignupTwoTierAuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupTwoTierAuthFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupTwoTierAuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
