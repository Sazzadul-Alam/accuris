import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualStatisticsComponent } from './individual-statistics.component';

describe('IndividualStatisticsComponent', () => {
  let component: IndividualStatisticsComponent;
  let fixture: ComponentFixture<IndividualStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
