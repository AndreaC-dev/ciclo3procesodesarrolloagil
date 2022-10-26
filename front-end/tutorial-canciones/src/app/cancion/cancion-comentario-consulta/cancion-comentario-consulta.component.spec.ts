import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionComentarioConsultaComponent } from './cancion-comentario-consulta.component';

describe('CancionComentarioConsultaComponent', () => {
  let component: CancionComentarioConsultaComponent;
  let fixture: ComponentFixture<CancionComentarioConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancionComentarioConsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionComentarioConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
