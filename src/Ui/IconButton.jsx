import PropTypes from 'prop-types'
//import { Button } from 'react-bootstrap'

const IconButton = ({
  src,
  alt = 'icon',
  onClick = () => {},
  className = '',
  iconWidthREM = 7,
  color = '#000000',
}) => {
  return (
    <button
      onClick={onClick}
      className={`icon-button p-0 ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: `${iconWidthREM}rem`,
        minWidth: `${iconWidthREM - 3}rem`,
        height: `${iconWidthREM / 3}rem`,
        // borderRightWidth: '2px',
        // borderRight: '#000',
        //backgroundColor: '#a4a35f',
      }}
    >
      <div className='icon-wrapper'>
        <img
          src={src}
          alt={alt}
          className='icon-image'
          style={{ minWidth: `${iconWidthREM - 3}rem` }}
        />
        <span className='icon-text' style={{ color: color }}>
          {alt}
        </span>
      </div>
    </button>
  )
}

IconButton.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconWidthREM: PropTypes.string,
  color: PropTypes.string,
}

export default IconButton
