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