import "./styles.menu.css";

export default function MenuButton({ onClick, change }) {
  const onButtonClick = () => {
    onClick && onClick();
  };

  return (
    <div
      className={change ? "toggle-btn change btn-right" : "toggle-btn"}
      onClick={onButtonClick}
    >
      <div className="bar1"></div>
      <div className="bar2"></div>
      <div className="bar3"></div>
    </div>
  );
}
