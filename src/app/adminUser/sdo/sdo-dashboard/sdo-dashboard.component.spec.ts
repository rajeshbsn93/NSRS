import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdoDashboardComponent } from './sdo-dashboard.component';

describe('SdoDashboardComponent', () => {
  let component: SdoDashboardComponent;
  let fixture: ComponentFixture<SdoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
