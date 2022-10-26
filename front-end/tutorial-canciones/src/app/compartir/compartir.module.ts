import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartirComponent } from './compartir.component';
import { CompartirAlbumComponent } from "./compartir-album/compartir-album.component";
import { ReactiveFormsModule } from '@angular/forms';
import { AppHeaderModule } from '../app-header/app-header.module';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, AppHeaderModule
  ],
  declarations: [CompartirComponent, CompartirAlbumComponent]
})
export class CompartirModule { }
