import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceManpowerDetailsComponent } from './kisce-manpower-details.component';

describe('KisceManpowerDetailsComponent', () => {
  let component: KisceManpowerDetailsComponent;
  let fixture: ComponentFixture<KisceManpowerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ KisceManpowerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceManpowerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
