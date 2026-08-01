import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { LancamentoService } from './../lancamento.service';
import { Lancamento } from './../../core/model';
import { PessoaService } from './../../pessoas/pessoa.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from './../../categorias/categoria.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: "Receita", value: "RECEITA" },
    { label: "Despesa", value: "DESPESA" }
  ];

  categorias = [];
  pessoas = [];
  lancamentoForm!: FormGroup;

  constructor(
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
    this.configurarLancamentoForm();
  }

  ngOnInit(): void {
    this.title.setTitle("Novo Lançamento")
    const codigoLancamento: number = this.activatedRoute.snapshot.params["codigo"]

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  configurarLancamentoForm() {
    this.lancamentoForm = this.formBuilder.group({
      codigo: [],
      tipoLancamento: ["RECEITA", Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMaximo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatorio: true });
  }

  validarTamanhoMaximo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }


  get getCodigo() {
    return this.lancamentoForm.get("codigo")?.value;
  }

  get getTipo() {
    return this.lancamentoForm.get("tipo")?.value;
  }

  get getDescricao() {
    return this.lancamentoForm.get("descricao")?.value;
  }

  get editando() {
    return Boolean(this.getCodigo);
  }

  carregarCategorias() {
    this.categoriaService.listarTodos()
    .then((categorias: any) => {
      this.categorias = categorias.map(c => {
        return { label: c.nome, value: c.codigo };
      });
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
    .then((pessoas: any) => {
      this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
    .then((response: any) => {

      this.lancamentoForm.patchValue(response);
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.lancamentoForm.value)
    .then(lancamentoAdicionado => {
      this.messageService.add({severity:'success', detail: "Lançamento cadastrado com sucesso!"});

      this.router.navigate(["/lancamentos", lancamentoAdicionado.codigo])
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.lancamentoForm.value)
    .then(lancamento => {
      this.lancamentoForm.patchValue(lancamento);

      this.messageService.add({severity:'success', detail: "Lançamento alterado com sucesso!"});
      this.atualizarTituloEdicao();
    })
    .catch(error => this.errorHandlerService.handle(error));
  }

  novo() {
    this.lancamentoForm.reset();
    this.lancamentoForm.patchValue(new Lancamento());

    this.router.navigate(["/lancamentos/novo"]);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.getDescricao}`);
  }
}
