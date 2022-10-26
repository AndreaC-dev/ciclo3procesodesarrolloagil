/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioSignupComponent } from './usuario-signup.component';
import { FormBuilder } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

describe('UsuarioSignupComponent', () => {
  let component: UsuarioSignupComponent;
  let fixture: ComponentFixture<UsuarioSignupComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioSignupComponent ],
      imports:[        HttpClientTestingModule,
        HttpClientModule,ToastrModule.forRoot(), RouterTestingModule,
        RouterModule.forRoot([])],
        providers:[FormBuilder, {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: {get:(id:number)=>{id:1}}}}}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
