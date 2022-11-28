import ActionButton from "./actionButton/index";

export default function ActionsMenu({
  clearParkMarkers,
  canAddMarker,
  toggleCustomMarker,
}) {
  return (
    <div className="action-buttons">
      <ActionButton
        label="Add Pointer"
        isDisabled={canAddMarker}
        action={toggleCustomMarker}
      />
      <ActionButton label="Clear marker" action={clearParkMarkers} />
    </div>
  );
}
