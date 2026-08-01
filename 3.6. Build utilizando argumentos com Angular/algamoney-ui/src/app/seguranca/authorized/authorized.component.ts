import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.css']
})
export class AuthorizedComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.authService.obterNovoAccessTokenComCode(params.code, params.state)
        .then(() => {
          console.log("Autorização concluída com sucesso!");
          this.router.navigate(['/']);
        })
        .catch((e: any) => {
          console.error("Erro no callback de autorização", e);
          this.router.navigate(['/']);
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

}
