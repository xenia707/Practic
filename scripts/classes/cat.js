// Класс для работы с котиками
class Cat {
  constructor(name, image) {
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
