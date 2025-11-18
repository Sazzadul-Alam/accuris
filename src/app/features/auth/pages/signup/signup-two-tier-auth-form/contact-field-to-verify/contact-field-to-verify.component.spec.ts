import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFieldToVerifyComponent } from './contact-field-to-verify.component';

describe('ContactFieldToVerifyComponent', () => {
  let component: ContactFieldToVerifyComponent;
  let fixture: ComponentFixture<ContactFieldToVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFieldToVerifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactFieldToVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
