import ActionButton from "./actionButton/index";

export default function ActionsMenu({
  clearParkMarkers,
  canAddMarker,
  toggleCustomMarker,
}) {
  return (
    <div className="action-buttons">
      <ActionButton
        label="Select neighborhood"
        isDisabled={canAddMarker}
        action={toggleCustomMarker}
      />
      <ActionButton label="Clear markers" action={clearParkMarkers} />
    </div>
  );
}
