// Импорты функции библиотек
import { useEffect, useRef } from "react";

// Импорты иконок
import closeIcon from "../assets/icons/close.svg";

// Импорты типов
import { User } from "../types";

// Тип для пропсов
type AppPopupProps = User & {
  onClose: () => void;
};

const AppPopup = ({
  name,
  hire_date,
  position_name,
  phone,
  email,
  department,
  address,
  onClose,
}: AppPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [onClose]);

  return (
    <div className="popup-wrapper">
      <div className="popup" ref={popupRef}>
        <div className="popup-head">
          <h2>{name}</h2>
          <button className="btn-icon" onClick={onClose}>
            <img src={closeIcon} alt="Close icon" />
          </button>
        </div>

        <div className="popup-body">
          <table className="user-info">
            <tbody>
              <tr>
                <td>Телефон:</td>
                <td>{phone}</td>
              </tr>
              <tr>
                <td>Почта:</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td>Дата приема:</td>
                <td>{hire_date}</td>
              </tr>
              <tr>
                <td>Должность:</td>
                <td>{position_name}</td>
              </tr>
              <tr>
                <td>Подразделение:</td>
                <td>{department}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="popup-footer">
          <h3>Дополнительная информация:</h3>
          <p>{address}</p>
        </div>
      </div>
    </div>
  );
};

export default AppPopup;
