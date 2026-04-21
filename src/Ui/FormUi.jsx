import PropTypes from 'prop-types'
import { formCounterStyle } from './componentStyles'

/**
 * FormCounter
 * ──────────────────────────────────────────────────────────────
 * A small number input paired with a submit icon button.
 * Used for inline priority / WIP-limit editing on task cards.
 */
const FormCounter = ({
  src,
  handlePriorityChange,
  handlePrioritySubmit,
  priority,
  projectId,
}) => (
  <div className="flex items-center">
    <input
      type="number"
      value={priority}
      onChange={handlePriorityChange}
      min={0}
      max={100}
      style={formCounterStyle.input}
      className="
        text-center
        border border-neutral-black
        rounded p-1
        font-mono font-bold text-xs
        bg-neutral-white
      "
    />
    <button
      onClick={handlePrioritySubmit}
      disabled={!projectId}
      className="
        bg-neutral-black text-neutral-white
        border-none rounded p-1
        cursor-pointer
        hover:opacity-80 transition-opacity duration-fast
        disabled:opacity-40 disabled:cursor-not-allowed
      "
    >
      <img
        src={src}
        alt="submit"
        style={{ width: formCounterStyle.imgWidth, height: formCounterStyle.imgWidth }}
      />
    </button>
  </div>
)

FormCounter.propTypes = {
  src:                  PropTypes.string.isRequired,
  priority:             PropTypes.number,
  handlePriorityChange: PropTypes.func,
  handlePrioritySubmit: PropTypes.func,
  projectId:            PropTypes.string,
}

export default FormCounter