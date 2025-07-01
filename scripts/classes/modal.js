class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.setupEvents();
  }

  show() {
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  setupEvents() {
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }
}