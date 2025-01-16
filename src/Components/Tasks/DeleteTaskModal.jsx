import PropTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'

export const DeleteWarningModal = ({ show, onHide, onConfirm, taskTitle }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {taskTitle} ? This action cannot be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancel
        </Button>
        <Button variant='danger' onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

DeleteWarningModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  taskTitle: PropTypes.string.isRequired,
}
