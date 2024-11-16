import PropTypes from 'prop-types'
import { Form, Row, Col } from 'react-bootstrap'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <Row className='g-2 align-items-center'>
      <Col xs={12} sm={6}>
        <Form.Group>
          <Form.Label htmlFor='sortBy' className='me-2'>
            Sort By:
          </Form.Label>
          <Form.Select
            id='sortBy'
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {fields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Col xs={12} sm={6}>
        <Form.Group>
          <Form.Label htmlFor='sortOrder' className='me-2'>
            Sort Order:
          </Form.Label>
          <Form.Select
            id='sortOrder'
            value={orderValue}
            onChange={(e) => onOrderChange(e.target.value)}
          >
            <option value='ascending'>Ascending</option>
            <option value='descending'>Descending</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}

PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}
