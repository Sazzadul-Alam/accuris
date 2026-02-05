import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessStatisticsComponent } from './business-statistics.component';

describe('BusinessStatisticsComponent', () => {
  let component: BusinessStatisticsComponent;
  let fixture: ComponentFixture<BusinessStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
