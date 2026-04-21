import { useEffect, useRef } from "react";

export default function DeleteModal({
  invoiceId,
  onCancel,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <h2 id="delete-modal-title" className="delete-modal__title">
          Confirm Deletion
        </h2>

        <p id="delete-modal-description" className="delete-modal__description">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot
          be undone.
        </p>

        <div className="delete-modal__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="button button--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}