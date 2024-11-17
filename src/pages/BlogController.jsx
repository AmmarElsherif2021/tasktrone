/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Form,
  InputGroup,
  Card,
  //Row,
  //Col,
  Button,
  Collapse,
  //Dropdown,
} from 'react-bootstrap'

export function BlogControls({
  author,
  onAuthorChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  sortFields,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='mb-4'>
      <Button
        variant='secondary'
        onClick={() => setIsExpanded(!isExpanded)}
        aria-controls='filter-collapse'
        aria-expanded={isExpanded}
        className='mb-3'
      >
        Filter
      </Button>

      <Collapse in={isExpanded}>
        <div id='filter-collapse'>
          <Card className='p-3'>
            <Form>
              <Form.Group controlId='filterByAuthor' className='mb-3'>
                <Form.Label>Filter by Author</Form.Label>
                <InputGroup>
                  <InputGroup.Text>Author</InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Filter by author...'
                    value={author}
                    onChange={(e) => onAuthorChange(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='sortBy' className='mb-3'>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  {sortFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId='sortOrder' className='mb-3'>
                <Form.Label>Order</Form.Label>
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => onSortOrderChange(e.target.value)}
                >
                  <option value='ascending'>Ascending</option>
                  <option value='descending'>Descending</option>
                </Form.Select>
              </Form.Group>
              <Button variant='primary' onClick={() => setIsExpanded(false)}>
                Apply
              </Button>
            </Form>
          </Card>
        </div>
      </Collapse>
    </div>
  )
}
