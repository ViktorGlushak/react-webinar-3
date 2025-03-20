/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = initState;
    this.listeners = []; // Слушатели изменений состояния

    this.lastCode = 0;
    if (initState.list && initState.list.length > 0) {
      this.lastCode = Math.max(...initState.list.map(item => item.code));
      
      // Инициализируем счетчик выделений, если его нет
      this.state.list = this.state.list.map(item => ({
        ...item,
        selectCount: item.selectCount || 0
      }));
    }
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const newCode = this.lastCode + 1;
    this.lastCode = newCode;

    this.setState({
      ...this.state,
      list: [...this.state.list, { code: newCode, title: 'Новая запись', selectCount: 0 }],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   * @param multiSelect {boolean} Флаг множественного выделения (с нажатой Ctrl/Cmd)
   */
  selectItem(code, multiSelect = false) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        if (item.code === code) {
          // Увеличиваем счетчик выделений только при выделении записи, а не при снятии выделения
          const newSelectCount = (!item.selected) ? (item.selectCount || 0) + 1 : (item.selectCount || 0);
          return { ...item, selected: !item.selected, selectCount: newSelectCount };
        }
        if (!multiSelect) {
          return { ...item, selected: false };
        }
        return item;
      }),
    });
  }
}

export default Store;
