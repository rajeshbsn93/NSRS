import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateMapDetailComponent } from './state-map-detail.component';

describe('StateMapDetailComponent', () => {
  let component: StateMapDetailComponent;
  let fixture: ComponentFixture<StateMapDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateMapDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateMapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
