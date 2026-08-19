import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateStatusComponent } from './state-status.component';

describe('StateStatusComponent', () => {
  let component: StateStatusComponent;
  let fixture: ComponentFixture<StateStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
