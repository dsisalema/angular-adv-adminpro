import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public FormSubmitted = false;
  public auth2:any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
   });

  constructor( private router: Router,
                private fb: FormBuilder,
                private usuarioServices: UsuarioService,
                private ngZone: NgZone   ) { }
 
  ngOnInit(): void {
   this.renderButton();
  }


  login() {

    this.usuarioServices.login( this.loginForm.value)
         .subscribe( resp => {
          if ( this.loginForm.get('remember')?.value) {
             localStorage.setItem('email',this.loginForm.get('email')?.value);
          } else{
            localStorage.removeItem('email');
          }

                    //Navegar alDashboard
                    this.router.navigateByUrl('/');

         }, (err) => {
           //Si sucede error
           Swal.fire('Error', err.error.msg, 'error');
           
         });
    
  }

 
 
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  };



  startApp() {
    gapi.load('auth2', () =>{
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '155635147862-p5u368vdou013cefa64lehjh5nmmn9oe.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        // Request scopes in addition to 'profile' and 'email'
        //scope: 'additional_scope'
      });
      this.attachSignin( document.getElementById('my-signin2') );
    });
  };

  attachSignin(element:any) {
    console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser:any) => {
          const id_token = googleUser.getAuthResponse().id_token;
          console.log(id_token);
          this.usuarioServices.loginGoogle( id_token )
          .subscribe( resp => {

          //Navegar alDashboard
          this.ngZone.run( () => {
            this.router.navigateByUrl('/');
          })
          
          });

        }, (error:any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
