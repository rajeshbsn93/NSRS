import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpDashboardComponent } from './yp-dashboard.component';

describe('YpDashboardComponent', () => {
  let component: YpDashboardComponent;
  let fixture: ComponentFixture<YpDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
