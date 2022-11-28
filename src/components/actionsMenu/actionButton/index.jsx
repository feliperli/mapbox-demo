export default function ActionButton({ label, action, isDisabled }) {
  return (
    <div>
      <button onClick={action} disabled={isDisabled}>
        {label}
      </button>
    </div>
  );
}
