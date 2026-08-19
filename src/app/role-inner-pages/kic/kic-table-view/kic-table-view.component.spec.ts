import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicTableViewComponent } from './kic-table-view.component';

describe('KicTableViewComponent', () => {
  let component: KicTableViewComponent;
  let fixture: ComponentFixture<KicTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
