import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {  catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
              private router: Router,
              private ngZone: NgZone  ) { 

    this.googleInit();            
              }

  googleInit() {
    gapi.load('auth2', () =>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '155635147862-p5u368vdou013cefa64lehjh5nmmn9oe.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });

    });
  }            

  logout() {
    localStorage.removeItem('token');
 
    this.auth2.signOut().then(() => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
      
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url}/login/renew`, {
        headers: {
          'x-token': token
        }

    }).pipe( 
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true),
      catchError ( error => of(false) ) 

    );
  }

  crearUsuario( formData: RegisterForm){

   return  this.http.post(`${ base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                  localStorage.setItem('token', resp.token)
                  })
                )
    
  }

  login( formData: LoginForm  ){

    return  this.http.post(`${ base_url}/login`, formData)
                 .pipe(
                   tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                   })
                 )
     
   }

   loginGoogle( token:any  ){

    return  this.http.post(`${ base_url}/login/google`, { token })
                 .pipe(
                   tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                   })
                 )
     
   }


}
