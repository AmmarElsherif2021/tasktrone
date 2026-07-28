import PropTypes from 'prop-types'
import { iconBtnStyle } from './componentStyles'

/**
 * IconButton
 * ──────────────────────────────────────────────────────────────
 * A button that shows an icon at rest and slides in a text label
 * on hover.  Animation is driven by CSS classes in index.css
 * (.icon-button, .icon-wrapper, .icon-image, .icon-text).
 *
 * @prop {number} iconWidthREM  – total button width in rem (default 7)
 * @prop {string} color         – label text color (default neutral-black)
 */
export const IconButton = ({
  src,
  alt = 'icon',
  onClick   = () => {},
  className = '',
  iconWidthREM = 7,
  color = 'var(--color-fog)',
}) => (
  <button
    onClick={onClick}
    className={`icon-button ${className}`}
    style={iconBtnStyle.base(iconWidthREM)}
  >
    <div className="icon-wrapper">
      <img
        src={src}
        alt={alt}
        className="icon-image"
        style={iconBtnStyle.icon(iconWidthREM)}
      />
      <span className="border rounded-[3px] icon-text px-2 py-1" style={{ backgroundColor: color, noOfLines: 2 }}>
        {alt}
      </span>
    </div>
  </button>
)

IconButton.propTypes = {
  src:         PropTypes.string.isRequired,
  alt:         PropTypes.string,
  onClick:     PropTypes.func,
  className:   PropTypes.string,
  iconWidthREM: PropTypes.number,
  color:       PropTypes.string,
}

export default IconButton