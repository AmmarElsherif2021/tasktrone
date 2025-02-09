import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const StaticRoundBtn = ({
  src = '',
  alt,
  handleClick = () => {},
  color = '#fff',
  backgroundColor = 'transparent',
}) => {
  return (
    <Button
      variant='none'
      size='sm'
      style={{
        borderWidth: '2px',
        borderColor: color, //'#ad0000',
        color: color,
        borderRadius: '10px',
        maxWidth: '7rem',
        margin: '0.4rem',
        backgroundColor: backgroundColor,
      }}
      onClick={handleClick}
    >
      {src && <img src={src} width={2} alt={alt} />}
      <span style={{ color: color }}>{alt}</span>
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
