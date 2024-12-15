import { Button, Nav } from 'react-bootstrap'
import searchIcon from '../../assets/search.svg'
import { useState } from 'react'
const Search = () => {
  const [isOpenSearch, setIsOpenSearch] = useState(false)

  const toggleSearch = () => setIsOpenSearch(!isOpenSearch)

  return (
    <Nav>
      <Nav.Item className='nav-item'>
        <Button
          variant='light'
          className='px-3'
          type='button'
          onClick={toggleSearch}
        >
          <img src={searchIcon} style={{ width: '2rem' }} alt='search' />
        </Button>
      </Nav.Item>
    </Nav>
  )
}

export default Search
