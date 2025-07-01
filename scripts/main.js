document.addEventListener('DOMContentLoaded', () => {
  // ========== DOM Элементы ==========
  const loginBtn = document.getElementById('loginBtn');
  const createBtn = document.getElementById('createBtn');
  const chooseBtn = document.getElementById('chooseBtn');
  const showCatsBtn = document.getElementById('showCatsBtn');
  const loginModal = document.getElementById('loginModal');
  const createCatModal = document.getElementById('createCatModal');
  const chooseCatModal = document.getElementById('chooseCatModal');
  const myCatsModal = document.getElementById('myCatsModal');
  const confirmLogin = document.getElementById('confirmLogin');
  const saveCatBtn = document.getElementById('saveCatBtn');
  const saveSelectedCatBtn = document.getElementById('saveSelectedCatBtn');
  const availableCats = document.getElementById('availableCats');
  const myCatsList = document.getElementById('myCatsList');
  const catImage = document.getElementById('catImage');

  const defaultCats = [
    { id: 1, name: 'Вася', image: 'cot.jpg' },
    { id: 2, name: 'Булка', image: 'cot2.jpg' },
    { id: 3, name: 'Бусинка', image: 'cot3.jpg' }
  ];

  let currentUser = localStorage.getItem('currentUser');
  let selectedImage = 'cot.jpg';
  let selectedCat = null;

  if (currentUser) {
    loginBtn.textContent = 'Log out';
    showCatsBtn.style.display = 'inline-block';
  }

  loginBtn.addEventListener('click', toggleLogin);
  confirmLogin.addEventListener('click', handleLogin);
  createBtn.addEventListener('click', showCreateModal);
  chooseBtn.addEventListener('click', showChooseModal);
  showCatsBtn.addEventListener('click', showMyCatsModal);
  saveCatBtn.addEventListener('click', saveNewCat);
  saveSelectedCatBtn.addEventListener('click', saveSelectedCat);

  // выбор фотки
  document.querySelectorAll('.cat-option img').forEach(img => {
    img.addEventListener('click', function() {
      document.querySelectorAll('.cat-option img').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      selectedImage = this.dataset.img;
    });
  });

  //закрытие окон
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });


  function toggleLogin() {
    if (currentUser) {
      localStorage.removeItem('currentUser');
      currentUser = null;
      loginBtn.textContent = 'Log in';
      showCatsBtn.style.display = 'none';
    } else {
      loginModal.style.display = 'block';
    }
  }

  function handleLogin() {
    const username = document.getElementById('username').value.trim();
    if (username) {
      currentUser = username;
      localStorage.setItem('currentUser', username);
      loginModal.style.display = 'none';
      loginBtn.textContent = 'Log out';
      showCatsBtn.style.display = 'inline-block';
      document.getElementById('username').value = '';
    }
  }

  function showCreateModal() {
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    document.getElementById('newCatName').value = '';
    createCatModal.style.display = 'block';
  }

  function showChooseModal() {
    chooseCatModal.style.display = 'block';
    renderAvailableCats();
  }

  function showMyCatsModal() {
    myCatsModal.style.display = 'block';
    renderMyCats();
  }

  function saveNewCat() {
    const catName = document.getElementById('newCatName').value.trim();
    if (!catName) return;

    const userCats = JSON.parse(localStorage.getItem(`userCats_${currentUser}`)) || [];
    const newCat = {
      id: Date.now(),
      name: catName,
      image: selectedImage
    };
    
    userCats.push(newCat);
    localStorage.setItem(`userCats_${currentUser}`, JSON.stringify(userCats));
    
    document.getElementById('newCatName').value = '';
    createCatModal.style.display = 'none';
    alert(`Котик ${catName} сохранён!`);
  }

  function saveSelectedCat() {
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    
    if (!selectedCat) {
      alert('Выберите котика для сохранения');
      return;
    }

    const userCats = JSON.parse(localStorage.getItem(`userCats_${currentUser}`)) || [];
    
    //повторка
    const exists = userCats.some(cat => 
      cat.name === selectedCat.name && cat.image === selectedCat.image
    );
    
    if (!exists) {
      userCats.push({
        id: Date.now(),
        name: selectedCat.name,
        image: selectedCat.image
      });
      localStorage.setItem(`userCats_${currentUser}`, JSON.stringify(userCats));
      alert(`${selectedCat.name} добавлен в вашу коллекцию!`);
    } else {
      alert('Этот котик уже есть в вашей коллекции!');
    }
  }

  function renderAvailableCats() {
    availableCats.innerHTML = '';
    saveSelectedCatBtn.style.display = 'none';
    selectedCat = null;

    defaultCats.forEach(cat => {
      const catCard = document.createElement('div');
      catCard.className = 'cat-card';
      catCard.innerHTML = `
        <img src="img/${cat.image}" alt="${cat.name}">
        <p>${cat.name}</p>
      `;
      catCard.addEventListener('click', () => {
        document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
        catCard.classList.add('selected');
        catImage.src = `img/${cat.image}`;
        catImage.alt = cat.name;
        selectedCat = cat;
        saveSelectedCatBtn.style.display = 'block';
      });
      availableCats.appendChild(catCard);
    });
  }

  function renderMyCats() {
    myCatsList.innerHTML = '';
    
    if (!currentUser) {
      myCatsList.innerHTML = '<p>Войдите в систему</p>';
      return;
    }

    const userCats = JSON.parse(localStorage.getItem(`userCats_${currentUser}`)) || [];
    
    if (userCats.length === 0) {
      myCatsList.innerHTML = '<div class="no-cats-message">У вас пока нет котиков</div>';
      return;
    }

    userCats.forEach(cat => {
      const catCard = document.createElement('div');
      catCard.className = 'cat-card';
      catCard.innerHTML = `
        <img src="img/${cat.image}" alt="${cat.name}">
        <p>${cat.name}</p>
      `;
      myCatsList.appendChild(catCard);
    });
  }
  const clearDataBtn = document.getElementById('clearDataBtn');
  if (clearDataBtn) {
    clearDataBtn.addEventListener('click', () => {
      if (confirm('Очистить ВСЕ сохранённые данные? Это нельзя отменить!')) {
        localStorage.clear();
        alert('Все данные очищены. Страница будет перезагружена.');
        location.reload();
      }
    });
  }
});