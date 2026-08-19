import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpViewDocumentComponent } from './yp-view-document.component';

describe('YpViewDocumentComponent', () => {
  let component: YpViewDocumentComponent;
  let fixture: ComponentFixture<YpViewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpViewDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpViewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
