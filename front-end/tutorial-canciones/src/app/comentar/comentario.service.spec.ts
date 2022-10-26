/* tslint:disable:no-unused-variable */
import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { ComentarioService } from './comentario.service';
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";

describe('Service: Comentario', () => {
  let injector: TestBed;
  let service: ComentarioService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComentarioService]
    });
    injector = getTestBed();
    service = injector.get(ComentarioService);
    httpMock = injector.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should ...', inject([ComentarioService], (service: ComentarioService) => {
    expect(service).toBeTruthy();
  }));
});
