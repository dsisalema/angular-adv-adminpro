import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then( img => {
        
        Swal.fire('Guardado', 'Imagen actualizada', 'success');

        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();
      }).catch(err => {
        Swal.fire('Error', err.error.msg, 'error');
        
      });
  }


}
