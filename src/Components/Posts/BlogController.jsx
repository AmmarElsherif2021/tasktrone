/* eslint-disable react/prop-types */

import { useState } from 'react'
import { Form, InputGroup, Card, Button, Modal, Image } from 'react-bootstrap'
import filterIcon from '../../assets/filter.svg'

export function BlogControls({
  author,
  onAuthorChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  sortFields,
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className='mb-3 mx-1'>
      <Button
        variant='none'
        size='lg'
        className='phase-button'
        style={{
          borderWidth: '2px',
          borderColor: '#000',
          borderRadius: '2rem',
          backgroundColor: '#FFDE59',
        }}
        onClick={() => setShowModal(true)}
      >
        <Image
          src={filterIcon}
          width={25}
          alt='Filter'
          className='phase-button-icon'
        />
        <span className='phase-button-text' style={{ color: '#000' }}>
          <strong>Filter</strong>
        </span>
      </Button>

      <Modal
        className='custom-modal'
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header className='custom-modal' closeButton>
          <Modal.Title>Filter Options</Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom-modal'>
          <Card className='p-2' style={{ borderStyle: 'none' }}>
            <Form>
              <Form.Group controlId='filterByAuthor' className='mb-2'>
                <Form.Label className='mb-1'>Filter by Author</Form.Label>
                <InputGroup size='sm'>
                  <InputGroup.Text
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                  >
                    Author
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Filter by author...'
                    value={author}
                    style={{ borderWidth: '2px', borderColor: '#000' }}
                    onChange={(e) => onAuthorChange(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='sortBy' className='custom-modal mb-2'>
                <Form.Label className='mb-1'>Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  size='sm'
                  style={{ borderWidth: '2px', borderColor: '#000' }}
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
                  style={{ borderWidth: '2px', borderColor: '#000' }}
                >
                  <option value='ascending'>Ascending</option>
                  <option value='descending'>Descending</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant='primary'
                onClick={() => setShowModal(false)}
                size='sm'
              >
                Apply
              </Button>
            </Form>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  )
}
