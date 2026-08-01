import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Lancamento } from './../core/model';
import { environment } from './../../environments/environment';


export class LancamentoFiltro {

  descricao?: string;
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private lancamentoEndpoint = environment.apiUrl + "/lancamentos";

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set("page", filtro.pagina);
    params = params.set("size", filtro.itensPorPagina);

    if (filtro.descricao) {
      params = params.set("descricao", filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set("dataVencimentoDe", this.datePipe.transform(filtro.dataVencimentoInicio, "yyyy-MM-dd")!);
    }

    if (filtro.dataVencimentoFim) {
      params = params.set("dataVencimentoAte", this.datePipe.transform(filtro.dataVencimentoFim, "yyyy-MM-dd")!);
    }

    return lastValueFrom(this.http.get(`${this.lancamentoEndpoint}?resumo`, { params }))
    .then((response : any) => {
      const lancamentos = response.content;
      const resultado = {
        lancamentos,
        total: response.totalElements
      }

      return resultado;
    })
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    return lastValueFrom(this.http.post<Lancamento>(`${this.lancamentoEndpoint}`, lancamento))
    .then((response: any) => {
      return response;
    });
  }

  excluir(codigo: number): Promise<any> {
    return lastValueFrom(this.http.delete(`${this.lancamentoEndpoint}/${codigo}`))
    .then(() => null);
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return lastValueFrom(this.http.put<Lancamento>(`${this.lancamentoEndpoint}/atualizar/${lancamento.codigo}`, lancamento))
    .then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return lastValueFrom(this.http.get(`${this.lancamentoEndpoint}/${codigo}`))
    .then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (let lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento!).getTime() + offset);
      }
    }
  }

}
