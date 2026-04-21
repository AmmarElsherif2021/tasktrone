import PropTypes from 'prop-types'
import { roundBtnStyle } from './componentStyles'

/**
 * StaticRoundBtn
 * ──────────────────────────────────────────────────────────────
 * A pill-shaped label button with an optional leading icon image.
 * Border + text color are driven by the `color` prop so callers
 * can match team-role or category colors at runtime.
 *
 * @prop {string} color           – border + text color
 * @prop {string} backgroundColor – defaults to transparent
 */
export const StaticRoundBtn = ({
  src = '',
  alt,
  handleClick      = () => {},
  color            = 'var(--color-neutral-black)',
  backgroundColor  = 'transparent',
}) => (
  <button
    onClick={handleClick}
    style={roundBtnStyle.base(color, backgroundColor)}
  >
    {src && (
      <img src={src} width="14" alt="" aria-hidden="true" className="inline mr-1" />
    )}
    <span>{alt}</span>
  </button>
)

StaticRoundBtn.propTypes = {
  src:             PropTypes.string,
  alt:             PropTypes.string,
  handleClick:     PropTypes.func,
  color:           PropTypes.string,
  backgroundColor: PropTypes.string,
}

export default StaticRoundBtn