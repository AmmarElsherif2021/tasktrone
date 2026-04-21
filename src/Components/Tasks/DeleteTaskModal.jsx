import PropTypes from 'prop-types'

export const DeleteWarningModal = ({ show, onHide, onConfirm, taskTitle }) => {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onHide()
      }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-4 border-2 border-black shadow-xl">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-bold">Confirm Delete Task</h3>
          <button onClick={onHide} className="text-2xl leading-none">&times;</button>
        </div>
        <div className="mb-4">
          Are you sure you want to delete <strong>{taskTitle}</strong>? This action cannot be undone.
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onHide} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-md">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

DeleteWarningModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  taskTitle: PropTypes.string.isRequired,
}