import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KisceCommentHistoryComponent } from './kisce-comment-history.component';

describe('KisceCommentHistoryComponent', () => {
  let component: KisceCommentHistoryComponent;
  let fixture: ComponentFixture<KisceCommentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KisceCommentHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KisceCommentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
