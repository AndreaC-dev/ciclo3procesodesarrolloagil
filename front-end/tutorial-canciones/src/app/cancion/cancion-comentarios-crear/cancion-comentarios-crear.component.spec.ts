import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionComentariosCrearComponent } from './cancion-comentarios-crear.component';

describe('CancionComentariosComponent', () => {
  let component: CancionComentariosCrearComponent;
  let fixture: ComponentFixture<CancionComentariosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancionComentariosCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionComentariosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
