/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OuterPageLayoutFooterComponent } from './outer-page-layout-footer.component';

describe('OuterPageLayoutFooterComponent', () => {
  let component: OuterPageLayoutFooterComponent;
  let fixture: ComponentFixture<OuterPageLayoutFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuterPageLayoutFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterPageLayoutFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
