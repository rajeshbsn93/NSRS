import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsAthleteCssComponent } from './ops-athlete-css.component';

describe('OpsAthleteCssComponent', () => {
  let component: OpsAthleteCssComponent;
  let fixture: ComponentFixture<OpsAthleteCssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsAthleteCssComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpsAthleteCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
