/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CancionCreateComponent } from './cancion-create.component';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Cancion } from '../cancion';
import { Album } from 'src/app/album/album';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Usuario } from 'src/app/usuario/usuario';

describe('CancionCreateComponent', () => {
  let component: CancionCreateComponent;
  let fixture: ComponentFixture<CancionCreateComponent>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
let userId=1;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancionCreateComponent ],
      imports:[HttpClientTestingModule,
        HttpClientModule,RouterTestingModule,ToastrModule.forRoot(),RouterTestingModule,
        RouterModule.forRoot([])],
        providers: [ FormBuilder,{
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: {get:(id:number)=>{id:1}}}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(()=>{
    httpMock.verify();
  });

/*   it('should create', inject([CancionCreateComponent],(userId) => {
    let user=new Usuario (1,"hola",[])
    let newAlbum = [1,2,3];
    let newCancion = new Cancion (1,"Hola",2,2,"otro",newAlbum);
    component.createCancion(newCancion);

    const req = httpMock.expectOne(() => true);
    expect(req.request.method).toBe('POST');
    req.flush(newCancion);

    expect(component).toBeTruthy();
  })); */
});
