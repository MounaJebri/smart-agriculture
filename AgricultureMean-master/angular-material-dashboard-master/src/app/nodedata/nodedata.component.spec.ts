import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodedataComponent } from './nodedata.component';

describe('NodedataComponent', () => {
  let component: NodedataComponent;
  let fixture: ComponentFixture<NodedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
