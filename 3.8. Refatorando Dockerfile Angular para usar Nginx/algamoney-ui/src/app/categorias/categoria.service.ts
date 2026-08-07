import { lastValueFrom } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriasEndpoint: string = "http://localhost:8080/categorias"

  constructor(private http: HttpClient) { }

  listarTodos(): Promise<any> {
    return lastValueFrom(this.http.get(`${this.categoriasEndpoint}`))
    .then((response: any) => {
      return response;
    })
  }
}
