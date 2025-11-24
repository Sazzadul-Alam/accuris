import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTestComponent } from './login-test.component';

describe('LoginTestComponent', () => {
  let component: LoginTestComponent;
  let fixture: ComponentFixture<LoginTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
