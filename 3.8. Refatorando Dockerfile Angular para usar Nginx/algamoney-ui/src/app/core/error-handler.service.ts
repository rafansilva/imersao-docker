import { AuthService } from 'src/app/seguranca/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotAuthenticatedError } from '../seguranca/money-http-interceptor';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) { }

  handle(errorResponse: any) {
    let msg: string;
    console.log("Erro lançado. ", errorResponse);


    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      console.log("errorResponse ", errorResponse);

      msg = "Sua sessão expirou";
      this.authService.login();

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499
    ) {
      msg = "Ocorreu um erro ao processar a sua solicitação";

      if (errorResponse.status === 403) {
        msg = "Você não tem permissão para executar esta ação";
      }

      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch(e) {}

      console.log("Ocorreu um erro ", errorResponse);

    } else {
      msg = "Erro ao processar serviço. Tente novamente.";
      console.log("Ocorreu um erro ", errorResponse);
    }

    this.messageService.add({severity:'error', detail: msg});
  }
}
