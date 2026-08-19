import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionTableViewComponent } from './sanction-table-view.component';

describe('SanctionTableViewComponent', () => {
  let component: SanctionTableViewComponent;
  let fixture: ComponentFixture<SanctionTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionTableViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
