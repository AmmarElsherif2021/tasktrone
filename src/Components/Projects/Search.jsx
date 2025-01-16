import { Button, Nav, FormControl, InputGroup } from 'react-bootstrap'
import searchIcon from '../../assets/search.svg'
import { useState } from 'react'

const Search = () => {
  const [isOpenSearch, setIsOpenSearch] = useState(false)

  const toggleSearch = () => setIsOpenSearch(!isOpenSearch)

  return (
    <Nav className='align-items-center'>
      <Nav.Item className='nav-item'>
        <Button
          variant='none'
          className='px-3'
          type='button'
          onClick={toggleSearch}
        >
          <img src={searchIcon} style={{ width: '2rem' }} alt='search' />
        </Button>
      </Nav.Item>{' '}
      {isOpenSearch && (
        <Nav.Item className='nav-item'>
          <InputGroup className='ms-0.5'>
            <FormControl
              type='text'
              placeholder='Search...'
              aria-label='Search'
              style={{
                borderColor: '#729B87',
                borderWidth: '2.5px',
              }}
            />
          </InputGroup>
        </Nav.Item>
      )}
    </Nav>
  )
}

export default Search
