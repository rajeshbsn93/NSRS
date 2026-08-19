import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMenuRoleMappingComponent } from './manage-menu-role-mapping.component';

describe('ManageMenuRoleMappingComponent', () => {
  let component: ManageMenuRoleMappingComponent;
  let fixture: ComponentFixture<ManageMenuRoleMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMenuRoleMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMenuRoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
