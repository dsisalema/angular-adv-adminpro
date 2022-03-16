import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioServices: UsuarioService,
              private router: Router)
  { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.usuarioServices.validarToken()
      .pipe(
        tap( (estaAutenticado: any) => {

          if ( !estaAutenticado ) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

}
