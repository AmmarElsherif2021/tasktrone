import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const IconButton = ({
  src,
  alt = 'icon',
  onClick = () => {},
  className = '',
}) => {
  return (
    <Button
      variant='link'
      onClick={onClick}
      className={`icon-button p-0 ${className}`}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div className='icon-wrapper'>
        <img src={src} alt={alt} className='icon-image' />
        <span className='icon-text'>{alt}</span>
      </div>
    </Button>
  )
}

IconButton.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default IconButton
