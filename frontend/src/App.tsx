// Импорты функции библиотек
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

// Импорты иконок
import searchIcon from "./assets/icons/search.svg";
import leftIcon from "./assets/icons/left.svg";
import rightIcon from "./assets/icons/right.svg";
import errorIcon from "./assets/icons/error.svg";
import loadingIcon from "./assets/icons/spinner.svg";

// Импорты компонентов
import AppCard from "./components/AppCard";
import AppPopup from "./components/AppPopup";
import AppStatus from "./components/AppStatus";

// Импорты типов
import { User, UserWithId } from "./types";

const App = () => {
  const [popupData, setPopupData] = useState<User | null>(null); // Данные которые будут показаны в модальном окне
  const [users, setUsers] = useState<UserWithId[]>([]); // Все пользователи полученные с сервера
  const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]); // Пользователи, которые соответствуют поиску
  const [error, setError] = useState(false); // Состояние ошибки приложения
  const [loading, setLoading] = useState(false); // Состояние загрузки приложения
  const [currentPage, setCurrentPage] = useState(1); // Номер текущей страницы в пагинации
  const [search, setSearch] = useState(""); // Состояние строки поиска
  const startIndex = (currentPage - 1) * 6; // Получение начального индекса для пагинации
  const endIndex = startIndex + 6; // Получение конечного индекса для пагинации

  // Функция обрабатывающая клик на определенного пользователя
  const handleUserClick = (id: string) => {
    const foundUser = users.find((user) => user.id === id); // Находим пользователя на которого кликнули
    if (foundUser) {
      setPopupData(foundUser); // Если нашли, показываем в модальном окне
    }
  };

  // Функция обрабатывающая закрытие модального окна
  const handlePopupClose = () => {
    setPopupData(null);
  };

  // Функция обрабатывающая поиск
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value; // Получаем текст из текстового поля
    setSearch(searchText); // Запоминаем текст

    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      ) // Отфильтровываем всех людей по именам содержащим строку из текстового поля
    );

    setCurrentPage(1); // Устанавливаем первую страницу пагинации
  };

  // Эффекты, для получение пользователей из сервера
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Включаем загрузчик
      try {
        const response = await fetch("http://localhost:3000/"); // Отправка запроса на сервер
        const data = (await response.json()) as User[]; // Получение данных в виде JSON
        const usersWithId: UserWithId[] = data.map((user) => ({
          ...user,
          id: uuid(),
        })); // Добавление пользователям уникального ключа id, так как отсутствует у сервера

        // Установка пользователей
        setUsers(usersWithId);
        setFilteredUsers(usersWithId);
      } catch (error) {
        // В случае ошибки
        setError(true); // Установить состояние ошибки
        console.error(error);
      } finally {
        setLoading(false); // Выключить загрузчик
      }
    };

    fetchUsers();
  }, []);

  const infoToDisplay = loading ? (
    <AppStatus icon={loadingIcon} message="Loading..." /> // Если идет загрузка рендерим иконку загрузки 
  ) : error ? (
    <AppStatus icon={errorIcon} message="Failed fetching users!" /> // Если возникла ошибки рендерим иконку ошибки 
  ) : filteredUsers.length === 0 ? (
    <AppStatus icon={errorIcon} message="Users not found" /> // Если не нашли пользователей рендерим иконку ошибки 
  ) : ( 
    <div className="cards">
      {filteredUsers
        .slice(startIndex, endIndex) // Обрезаем пользователей для пагинации
        .map(({ id, name, email, phone }) => (
          <AppCard
            key={id}
            id={id}
            name={name}
            email={email}
            phone={phone}
            onUserSelected={handleUserClick}
          />
        ))}
    </div> // Рендерим карточки с пользователями
  );

  return (
    <main className="app">
      <div className="container">
        <div className="search">
          <input
            onChange={handleSearch}
            value={search}
            className="search-input"
            type="text"
            autoComplete="true"
            placeholder="Search by name..."
          />
          <img className="search-icon" src={searchIcon} alt="Search icon" />
        </div>
        {infoToDisplay}
        {!loading && !error && filteredUsers.length !== 0 && (
          <div className="pagination">
            <button
              className="btn-icon"
              onClick={() =>
                setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
              }
              disabled={currentPage === 1}
            >
              <img src={leftIcon} alt="Left icon" />
            </button>
            <span>Page {currentPage}</span>
            <button
              className="btn-icon"
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              disabled={endIndex >= filteredUsers.length}
            >
              <img src={rightIcon} alt="Right icon" />
            </button>
          </div>
        )}
        {popupData && <AppPopup onClose={handlePopupClose} {...popupData} />}
      </div>
    </main>
  );
};

export default App;
