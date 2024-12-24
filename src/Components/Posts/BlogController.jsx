/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  Form,
  InputGroup,
  Card,
  Button,
  Collapse,
  Image,
} from 'react-bootstrap'
import filterIcon from '../../assets/filter-negative.svg'

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
    <div className='mb-3'>
      <Button
        variant='secondary'
        onClick={() => setIsExpanded(!isExpanded)}
        aria-controls='filter-collapse'
        aria-expanded={isExpanded}
        className='d-flex align-items-center mb-2'
        size='sm'
      >
        <Image src={filterIcon} width={20} className='me-2' />
        Filter
      </Button>

      <Collapse in={isExpanded}>
        <div id='filter-collapse'>
          <Card className='p-2'>
            <Form>
              <Form.Group controlId='filterByAuthor' className='mb-2'>
                <Form.Label className='mb-1'>Filter by Author</Form.Label>
                <InputGroup size='sm'>
                  <InputGroup.Text>Author</InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Filter by author...'
                    value={author}
                    onChange={(e) => onAuthorChange(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='sortBy' className='mb-2'>
                <Form.Label className='mb-1'>Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  size='sm'
                >
                  {sortFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId='sortOrder' className='mb-2'>
                <Form.Label className='mb-1'>Order</Form.Label>
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => onSortOrderChange(e.target.value)}
                  size='sm'
                >
                  <option value='ascending'>Ascending</option>
                  <option value='descending'>Descending</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant='primary'
                onClick={() => setIsExpanded(false)}
                size='sm'
              >
                Apply
              </Button>
            </Form>
          </Card>
        </div>
      </Collapse>
    </div>
  )
}
