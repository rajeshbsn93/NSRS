import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionUcTableViewComponent } from './sanction-uc-table-view.component';

describe('SanctionUcTableViewComponent', () => {
  let component: SanctionUcTableViewComponent;
  let fixture: ComponentFixture<SanctionUcTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionUcTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionUcTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
