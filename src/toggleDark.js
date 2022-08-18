export default function ToggleDark(props) {
  return (
    <div>
      <div className="wrapper">
        <label className="switch">
          <input
            type="checkbox"
            id="checkbox-toggle"
            onClick={() => {
              props.toggleDark();
            }}
          />
        </label>
        Dark Mode
      </div>
    </div>
  );
}
