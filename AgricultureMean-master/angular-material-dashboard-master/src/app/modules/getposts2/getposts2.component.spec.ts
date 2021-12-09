import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Getposts2Component } from './getposts2.component';

describe('Getposts2Component', () => {
  let component: Getposts2Component;
  let fixture: ComponentFixture<Getposts2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Getposts2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Getposts2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
