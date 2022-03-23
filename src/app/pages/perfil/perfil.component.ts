import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;


  constructor( private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService ) { 

                this.usuario = usuarioService.usuario;
              }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
        nombre: [this.usuario.nombre, Validators.required ],
        email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
      console.log(this.perfilForm.value);
      this.usuarioService.actualizarPerfil(this.perfilForm.value)
          .subscribe( resp => {
            const {nombre, email} = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;

            Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
          }, ( err ) => {
            Swal .fire('Error', err.error.msg, 'error');
          })
  }

cambiarImagen(event: Event){
  const element = event.currentTarget as HTMLInputElement;
  let fileList: FileList | null = element.files;

  const files = element.files as FileList;

  this.imagenSubir = files[0];

  if (fileList) {
    console.log("FileUpload -> files", fileList);
  }

  if ( !files[0] ){ 
    this.imgTemp = null;
    return;
  }

  const reader = new FileReader();
  //const url64 = reader.readAsDataURL( files[0]);
  reader.readAsDataURL( files[0]);
  reader.onloadend = () => {
      this.imgTemp = reader.result;
  }
}
  
subirImagen(){
  this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then( img => {
      this.usuario.img = img;
      Swal.fire('Guardado', 'Imagen actualizada', 'success');
    }).catch(err => {
      Swal.fire('Error', err.error.msg, 'error');
      
    });
}


}
