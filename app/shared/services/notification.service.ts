import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  displayText: any;

  constructor(public toastr: ToastrService, private store: Store<any>) {
    this.store.select('displayText').subscribe(displayText => {
      this.displayText = displayText;
    });
  }

  success = (title: string, message: string) => {
    this.toastr.success(message, title, {
      progressBar: true
    });
  };

  info = (title: string, message: string) => {
    this.toastr.info(message, title, {
      progressBar: true
    });
  };

  warning = (title: string, message: string) => {
    this.toastr.warning(message, title, {
      progressBar: true
    });
  };

  error = (title: string, message: string) => {
    this.toastr.error(message, title, {
      progressBar: true
    });
  };

  isPhoneFormat = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  confirmArchive = () => {
    return this.confirmArchiveDelete(true);
  };

  confirmDelete = () => {
    return this.confirmArchiveDelete(false);
  };

  confirm = (title = this.displayText.areYouSure, text = '', confirmButtonText = 'Yes') => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      customClass: {
        confirmButton: 'btn btn-sm btn-success',
        cancelButton: 'btn btn-sm btn-danger'
      },
      buttonsStyling: false
    });
  };

  private confirmArchiveDelete = (isArchive: boolean) => {
    const confirmButtonText = isArchive ? this.displayText.yesArchiveIt : this.displayText.yesDeleteIt;
    const text = isArchive ? this.displayText.confirmArchiveText : this.displayText.confirmDeleteText;
    return Swal.fire({
      title: this.displayText.areYouSure,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      customClass: {
        confirmButton: 'btn btn-sm btn-success',
        cancelButton: 'btn btn-sm btn-danger'
      },
      buttonsStyling: false
    });
  };
}
