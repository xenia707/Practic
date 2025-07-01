// Класс для работы с котиками
class Cat {
  constructor(id, name, image) {
    this.name = name;
    this.image = image;
  }

  static getDefaultCats() {
    return [
      new Cat('Вася', 'cot.jpg'),
      new Cat('Булка', 'cot2.jpg'),
      new Cat('Бусинка', 'cot3.jpg')
    ];
  }
}

class User {
  constructor(username) {
    this.username = username;
    this.cats = [];
  }

  saveToStorage() {
    localStorage.setItem(`userCats_${this.username}`, JSON.stringify(this.cats));
    localStorage.setItem('currentUser', this.username);
  }

  static loadFromStorage() {
    const username = localStorage.getItem('currentUser');
    if (!username) return null;
    
    const user = new User(username);
    user.cats = JSON.parse(localStorage.getItem(`userCats_${username}`)) || [];
    return user;
  }

  addCat(cat) {
    if (!this.hasCat(cat)) {
      this.cats.push(cat);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  hasCat(cat) {
    return this.cats.some(c => c.name === cat.name && c.image === cat.image);
  }
  clearData() {
    localStorage.removeItem(`userCats_${this.username}`);
    localStorage.removeItem('currentUser');
    this.cats = [];
  }
}

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

class ChooseCatApp {
  constructor() {
    this.currentUser = User.loadFromStorage();
    this.selectedCat = null;
    this.selectedImage = 'cot.jpg';
    
    this.initModals();
    this.initElements();
    this.setupEventListeners();
    this.updateUI();
  }

  initModals() {
    this.modals = {
      login: new Modal('loginModal'),
      createCat: new Modal('createCatModal'),
      chooseCat: new Modal('chooseCatModal'),
      myCats: new Modal('myCatsModal')
    };
  }

  initElements() {
    this.elements = {
      loginBtn: document.getElementById('loginBtn'),
      createBtn: document.getElementById('createBtn'),
      chooseBtn: document.getElementById('chooseBtn'),
      showCatsBtn: document.getElementById('showCatsBtn'),
      confirmLogin: document.getElementById('confirmLogin'),
      saveCatBtn: document.getElementById('saveCatBtn'),
      saveSelectedCatBtn: document.getElementById('saveSelectedCatBtn'),
      availableCats: document.getElementById('availableCats'),
      myCatsList: document.getElementById('myCatsList'),
      catImage: document.getElementById('catImage'),
      usernameInput: document.getElementById('username'),
      newCatName: document.getElementById('newCatName'),
      clearDataBtn: document.getElementById('clearDataBtn')
    };
  }
  setupEventListeners() {
    this.elements.loginBtn.addEventListener('click', () => this.toggleLogin());
    this.elements.confirmLogin.addEventListener('click', () => this.handleLogin());
    this.elements.createBtn.addEventListener('click', () => this.showCreateModal());
    this.elements.chooseBtn.addEventListener('click', () => this.showChooseModal());
    this.elements.showCatsBtn.addEventListener('click', () => this.showMyCatsModal());
    this.elements.saveCatBtn.addEventListener('click', () => this.saveNewCat());
    this.elements.saveSelectedCatBtn.addEventListener('click', () => this.saveSelectedCat());
    this.elements.clearDataBtn.addEventListener('click', () => this.clearData());

    document.querySelectorAll('.cat-option img').forEach(img => {
      img.addEventListener('click', () => {
        document.querySelectorAll('.cat-option img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');
        this.selectedImage = img.dataset.img;
      });
    });
  }

  updateUI() {
    if (this.currentUser) {
      this.elements.loginBtn.textContent = 'Log out';
      this.elements.showCatsBtn.style.display = 'inline-block';
    } else {
      this.elements.loginBtn.textContent = 'Log in';
      this.elements.showCatsBtn.style.display = 'none';
    }
  }
  // Вход/выход
  toggleLogin() {
    if (this.currentUser) {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      this.updateUI();
    } else {
      this.modals.login.show();
    }
  }

  // Обработка вход
  handleLogin() {
    const username = this.elements.usernameInput.value.trim();
    if (username) {
      this.currentUser = new User(username);
      this.currentUser.saveToStorage();
      this.modals.login.hide();
      this.elements.usernameInput.value = '';
      this.updateUI();
    }
  }

  showCreateModal() {
    if (!this.currentUser) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    this.elements.newCatName.value = '';
    this.modals.createCat.show();
  }

  showChooseModal() {
    this.renderAvailableCats();
    this.modals.chooseCat.show();
  }

  showMyCatsModal() {
    this.renderMyCats();
    this.modals.myCats.show();
  }

  saveNewCat() {
    const catName = this.elements.newCatName.value.trim();
    if (!catName) return;

    const newCat = new Cat(Date.now(), catName, this.selectedImage);
    
    if (this.currentUser.addCat(newCat)) {
      this.elements.newCatName.value = '';
      this.modals.createCat.hide();
      alert(`Котик ${catName} сохранён!`);
    } else {
      alert('Такой котик уже есть в вашей коллекции!');
    }
  }

  saveSelectedCat() {
    if (!this.currentUser) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    
    if (!this.selectedCat) {
      alert('Выберите котика для сохранения');
      return;
    }

    const catToAdd = new Cat(Date.now(), this.selectedCat.name, this.selectedCat.image);
    
    if (this.currentUser.addCat(catToAdd)) {
      alert(`${this.selectedCat.name} добавлен в вашу коллекцию!`);
    } else {
      alert('Этот котик уже есть в вашей коллекции!');
    }
  }

  clearData() {
    if (confirm('Очистить ВСЕ сохранённые данные? Это нельзя отменить!')) {
      localStorage.clear();
      this.currentUser = null;
      this.updateUI();
      alert('Все данные очищены.');
    }
  }

  //рендер котиов
  renderAvailableCats() {
    this.elements.availableCats.innerHTML = '';
    this.elements.saveSelectedCatBtn.style.display = 'none';
    this.selectedCat = null;

    Cat.getDefaultCats().forEach(cat => {
      const catCard = document.createElement('div');
      catCard.className = 'cat-card';
      catCard.innerHTML = `
        <img src="img/${cat.image}" alt="${cat.name}">
        <p>${cat.name}</p>
      `;
      catCard.addEventListener('click', () => {
        document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
        catCard.classList.add('selected');
        this.elements.catImage.src = `img/${cat.image}`;
        this.elements.catImage.alt = cat.name;
        this.selectedCat = cat;
        this.elements.saveSelectedCatBtn.style.display = 'block';
      });
      this.elements.availableCats.appendChild(catCard);
    });
  }

  renderMyCats() {
    this.elements.myCatsList.innerHTML = '';
    
    if (!this.currentUser) {
      this.elements.myCatsList.innerHTML = '<p>Войдите в систему</p>';
      return;
    }

    if (this.currentUser.cats.length === 0) {
      this.elements.myCatsList.innerHTML = '<div class="no-cats-message">У вас пока нет котиков</div>';
      return;
    }

    this.currentUser.cats.forEach(cat => {
      const catCard = document.createElement('div');
      catCard.className = 'cat-card';
      catCard.innerHTML = `
        <img src="img/${cat.image}" alt="${cat.name}">
        <p>${cat.name}</p>
      `;
      this.elements.myCatsList.appendChild(catCard);
    });
  }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  new ChooseCatApp();
});