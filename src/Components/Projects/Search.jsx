import { Form, FormControl, Button } from 'react-bootstrap'

const Search = () => {
  return (
    <Form inline>
      <FormControl type='text' placeholder='Search' className='mr-sm-2' />
      <Button variant='outline-primary'>Search</Button>
    </Form>
  )
}

export default Search
