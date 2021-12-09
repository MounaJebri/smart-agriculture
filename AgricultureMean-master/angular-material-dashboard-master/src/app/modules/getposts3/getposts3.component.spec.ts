import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Getposts3Component } from './getposts3.component';

describe('Getposts3Component', () => {
  let component: Getposts3Component;
  let fixture: ComponentFixture<Getposts3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Getposts3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Getposts3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
