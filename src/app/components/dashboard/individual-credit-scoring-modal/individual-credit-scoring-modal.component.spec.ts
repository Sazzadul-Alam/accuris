import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCreditScoringModalComponent } from './individual-credit-scoring-modal.component';

describe('IndividualCreditScoringModalComponent', () => {
  let component: IndividualCreditScoringModalComponent;
  let fixture: ComponentFixture<IndividualCreditScoringModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCreditScoringModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualCreditScoringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
