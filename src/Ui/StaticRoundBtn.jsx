import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const StaticRoundBtn = ({
  src = '',
  alt,
  handleClick = () => {},
  color = '#000000',
  backgroundColor = '#fff',
}) => {
  return (
    <Button
      variant='none'
      size='sm'
      style={{
        borderWidth: '2px',
        borderColor: color, //'#ad0000',
        borderRadius: '2rem',
        maxWidth: '6rem',
        margin: '0.4rem',
        backgroundColor: backgroundColor,
      }}
      onClick={handleClick}
    >
      {src && <img src={src} width={2} alt={alt} />}
      <span style={{ color: '#000' }}>
        <small>{alt}</small>
      </span>
    </Button>
  )
}

StaticRoundBtn.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  handleClick: PropTypes.func,
  //className: PropTypes.string,
  //iconWidthREM: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
}

export default StaticRoundBtn
