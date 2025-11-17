import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupNavComponent } from './signup-nav.component';

describe('SignupNavComponent', () => {
  let component: SignupNavComponent;
  let fixture: ComponentFixture<SignupNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
