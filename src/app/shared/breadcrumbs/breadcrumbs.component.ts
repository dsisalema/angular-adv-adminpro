import { Component } from '@angular/core';
import { ActivationEnd, Router, NavigationStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})

 export class BreadcrumbsComponent {
 
  public titulo: string = 'ss';

  constructor( private router: Router) { 

    this.getArgumentosRuta();
   
   }

   getArgumentosRuta(){

     this.router.events
     .pipe(
       filter( event => event instanceof ActivationEnd ),
       //filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
       //map( (event: ActivationEnd) => event.snapshot.data),
     )
     .subscribe( event => {
        console.log(event);
       this.titulo = `Página ${event}`;
       document.title = ` Adminpro - ${event}`;
     });
  
   }




 }
 