import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceTableViewComponent } from './kisce-table-view.component';

describe('KisceTableViewComponent', () => {
  let component: KisceTableViewComponent;
  let fixture: ComponentFixture<KisceTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
