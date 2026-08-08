import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import {InputMaskModule} from 'primeng/inputmask';

import { SharedModule } from '../shared/shared.module';

import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasRoutingModule } from './pessoas-routing.module';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { PessoaCadastroContatoComponent } from './pessoa-cadastro-contato/pessoa-cadastro-contato.component';



@NgModule({
  declarations: [
    PessoasPesquisaComponent,
    PessoaCadastroComponent,
    PessoaCadastroContatoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    InputMaskModule,
    PanelModule,
    TooltipModule,
    DialogModule,
    PessoasRoutingModule,
],
  exports: []
})
export class PessoasModule { }
