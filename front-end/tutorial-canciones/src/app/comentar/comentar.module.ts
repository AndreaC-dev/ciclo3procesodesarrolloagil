import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComentarComponent } from './comentar.component';
import { ComentarAlbumComponent } from './comentar-album/comentar-album.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConsultarComentarioAlbumComponent } from './consultar-comentario-album/consultar-comentario-album.component';

@NgModule({
  imports: [
    CommonModule,ReactiveFormsModule
  ],
  declarations: [ComentarComponent, ComentarAlbumComponent,ConsultarComentarioAlbumComponent],
  exports: [ComentarComponent, ComentarAlbumComponent,ConsultarComentarioAlbumComponent]
})
export class ComentarModule { }
