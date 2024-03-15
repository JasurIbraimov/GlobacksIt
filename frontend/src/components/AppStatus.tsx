const AppError = ({ icon, message }: { icon: string; message: string }) => {
  return (
    <div className="status">
      <img src={icon} alt={message} />
      <p>{message}</p>
    </div>
  );
};

export default AppError;
