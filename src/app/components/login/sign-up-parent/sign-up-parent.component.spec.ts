import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpParentComponent } from './sign-up-parent.component';

describe('SignUpParentComponent', () => {
  let component: SignUpParentComponent;
  let fixture: ComponentFixture<SignUpParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpParentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
