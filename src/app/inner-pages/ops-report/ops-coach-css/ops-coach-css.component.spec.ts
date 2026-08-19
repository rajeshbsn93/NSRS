import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsCoachCssComponent } from './ops-coach-css.component';

describe('OpsCoachCssComponent', () => {
  let component: OpsCoachCssComponent;
  let fixture: ComponentFixture<OpsCoachCssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsCoachCssComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpsCoachCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
