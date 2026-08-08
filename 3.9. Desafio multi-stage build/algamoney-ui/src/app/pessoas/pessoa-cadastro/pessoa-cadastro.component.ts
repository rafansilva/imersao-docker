import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PessoaService } from './../pessoa.service';
import { NgForm, FormControl } from '@angular/forms';
import { Pessoa, Contato, Estado, Cidade } from './../../core/model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();
  estados: any[] = [];
  cidades: any[] = [];
  estadoSelecionado: number;


  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle("Nova Pessoa");
    const codigo: number = this.activatedRoute.snapshot.params["codigo"];

    this.carregaEstados();

    if (codigo) {
      this.carregaPessoa(codigo);
    }
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregaPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
    .then(response => {
      this.pessoa = response;

      this.estadoSelecionado = this.pessoa.endereco.cidade ? this.pessoa.endereco.cidade.estado.codigo : null;
      if (this.estadoSelecionado) {
        this.carregarCidades();
      }

      this.atualizarTituloEdicao();
    })
  }

  salvar(pessoaForm: NgForm) {
    if (this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }
  }

  adicionarPessoa() {
    this.pessoaService.adicionar(this.pessoa)
    .then((pessoaAdicionado: any) => {
      this.messageService.add({severity:'success', detail: "Pessoa cadastrada com sucesso!"});

      this.router.navigate(["/pessoas", pessoaAdicionado.codigo ])
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  atualizarPessoa() {
    this.pessoaService.atualizar(this.pessoa)
    .then((pessoaAlterada: any) => {
      this.pessoa = pessoaAlterada;

      this.messageService.add({severity:'success', detail: "Pessoa alterada com sucesso!"});
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  novo(pessoaForm: NgForm) {
    pessoaForm.reset()

    setTimeout(() => {
      this.pessoa = new Pessoa();
    }, 1);

    this.router.navigate(["/pessoas/nova"])
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição da pessoa: ${this.pessoa.nome}`);
  }

  carregaEstados() {
    this.pessoaService.listarEstados()
    .then((response: any) => {
      this.estados = response.map((estado: Estado) => {
        return { label: estado.nome, value: estado.codigo }
      });
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado)
      .then((response: any) => {
        this.cidades = response.map((cidade: Cidade) => {
          return { label: cidade.nome, value: cidade.codigo }
        });
        if (this.estadoSelecionado !== this.pessoa.endereco.cidade.estado.codigo)
          this.pessoa.endereco.cidade.codigo = undefined;
      })
      .catch(error => this.errorHandlerService.handle(error));   
  }

}
