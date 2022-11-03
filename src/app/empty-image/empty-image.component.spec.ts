import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyImageComponent } from './empty-image.component';

describe('EmptyImageComponent', () => {
  let component: EmptyImageComponent;
  let fixture: ComponentFixture<EmptyImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
