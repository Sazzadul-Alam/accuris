import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCreditScoringModalComponent } from './business-credit-scoring-modal.component';

describe('BusinessCreditScoringModalComponent', () => {
  let component: BusinessCreditScoringModalComponent;
  let fixture: ComponentFixture<BusinessCreditScoringModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCreditScoringModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCreditScoringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
