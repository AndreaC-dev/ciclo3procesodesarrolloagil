import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionListComponent } from './cancion-list/cancion-list.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CancionDetailComponent } from './cancion-detail/cancion-detail.component';
import { CancionCreateComponent } from './cancion-create/cancion-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CancionEditComponent } from './cancion-edit/cancion-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CancionComentariosCrearComponent } from './cancion-comentarios-crear/cancion-comentarios-crear.component';
import { CancionComentarioConsultaComponent } from './cancion-comentario-consulta/cancion-comentario-consulta.component';



@NgModule({
  declarations: [CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent, CancionComentariosCrearComponent, CancionComentarioConsultaComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule, NgbModule  ],
  exports:[CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent]
})
export class CancionModule { }
