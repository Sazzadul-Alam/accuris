import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMainFormComponent } from './login-main-form.component';

describe('LoginMainFormComponent', () => {
  let component: LoginMainFormComponent;
  let fixture: ComponentFixture<LoginMainFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginMainFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginMainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
