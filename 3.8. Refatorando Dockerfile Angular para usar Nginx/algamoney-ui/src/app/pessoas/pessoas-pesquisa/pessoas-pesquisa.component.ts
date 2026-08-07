import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaFiltro } from './../pessoa.service';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit{

  totalRegistros: number = 0;
  filtro = new PessoaFiltro();
  pessoas = [];

  @ViewChild("tabela") grid;

  constructor(
    private pessoaService: PessoaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle("Pesquisa de Pessoas");
  }

  pesquisar(pagina: number = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
    .then((result: any) => {
      this.pessoas = result.pessoas;
      this.totalRegistros = result.total;
    })
  }

  alternaStatus(pessoa: any) {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
    .then(() => {
      const acao = novoStatus ? "Ativada" : "Desativada";

      pessoa.ativo = novoStatus;
      this.messageService.add({severity:'success', detail:`Pessoa ${acao} com sucesso!`});
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  confirmarExclusao(pessoa: any) {
     this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
    .then(() => {
      this.grid.reset();
      this.messageService.add({severity:'success', detail:'Pessoa excluida com sucesso!'});
    })
    .catch(error => this.errorHandlerService.handle(error))
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;

    this.pesquisar(pagina);
  }

}
