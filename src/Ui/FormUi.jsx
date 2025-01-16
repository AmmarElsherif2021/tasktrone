/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types'
import { Button, Form, InputGroup } from 'react-bootstrap'

const FormCounter = ({
  src,
  handlePriorityChange,
  handlePrioritySubmit,
  priority,
  projectId,
}) => {
  return (
    <InputGroup>
      <Form.Control
        type='number'
        value={priority}
        onChange={handlePriorityChange}
        min={0}
        max={100}
        style={{ width: '4.2rem', marginRight: '0.5rem' }}
      />
      <Button
        variant='primary'
        onClick={handlePrioritySubmit}
        disabled={!projectId}
      >
        <img src={src} style={{ width: '1.7rem' }} />
      </Button>
    </InputGroup>
  )
}

FormCounter.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  priority: PropTypes.number,
  handlePriorityChange: PropTypes.func,
  handlePrioritySubmit: PropTypes.func,
  projectId: PropTypes.string,
}

export default FormCounter
