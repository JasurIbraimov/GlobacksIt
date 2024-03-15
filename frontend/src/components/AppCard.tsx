// Импорты иконок
import phoneIcon from "../assets/icons/phone.svg";
import mailIcon from "../assets/icons/mail.svg";

// Импорты типов
import { UserWithId } from "../types";

// Тип для пропсов 
type AppCardProps = Pick<UserWithId, "id" | "name" | "email" | "phone"> & {
  onUserSelected: (id: string) => void;
};

const AppCard = ({ id, name, email, phone, onUserSelected }: AppCardProps) => {
  return (
    <div className="card" onClick={() => onUserSelected(id)}>
      <h2 className="card-title">{name}</h2>
      <div className="card-body">
        <p className="card-info">
          <img src={phoneIcon} alt="Phone icon" />
          <span>{phone}</span>
        </p>
        <p className="card-info">
          <img src={mailIcon} alt="Mail icon" />
          <span>{email}</span>
        </p>
      </div>
    </div>
  );
};

export default AppCard;
