import Swal from 'sweetalert2';

export function alertMessage() {
  Swal.fire({
    toast: false,
    position: 'center',
    icon: 'success',
    title: 'Successful!',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
    width: '400px',
    padding: '10px',

    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });
}

export function alertErrorMessage(message: string) {
  Swal.fire({
    toast: false,
    position: 'center',
    icon: 'error',
    text: message,
    title: 'Error!',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
    width: '400px',
    padding: '10px',

    showClass: {
      popup: 'animate__animated animate__fadeInDown',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp',
    },
  });
}
