import PropTypes from 'prop-types'
import { Form, InputGroup } from 'react-bootstrap'

export function PostFilter({ field, value, onChange }) {
  return (
    <Form.Group className='mb-3'>
      <InputGroup>
        <InputGroup.Text className='text-capitalize'>{field}</InputGroup.Text>
        <Form.Control
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Filter by ${field}...`}
        />
      </InputGroup>
    </Form.Group>
  )
}

PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
