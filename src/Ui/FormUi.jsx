// FormUi.jsx
import PropTypes from 'prop-types'
import { formCounterStyle } from './componentStyles'   

/* ── Original FormCounter (unchanged) ────────────────────── */
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
        border-2 border-neutral-black
        bg-neutral-white
        font-mono font-bold text-xs
        px-1 py-1
        focus:outline-none focus:ring-1 focus:ring-primary
      "
    />
    <button
      onClick={handlePrioritySubmit}
      disabled={!projectId}
      className="
        bg-neutral-black text-neutral-white
        border-2 border-neutral-black
        px-1 py-1
        font-mono font-bold text-xs
        cursor-pointer
        hover:opacity-80 transition-opacity
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

/* ── New generic form components ──────────────────────────── */
const sharedInputClasses = `
  w-full border-2 border-neutral-black
  bg-neutral-white px-3 py-2
  font-mono text-sm
  focus:outline-none focus:ring-1 focus:ring-primary
`

export const Input = ({ className, ...props }) => (
  <input className={`${sharedInputClasses} ${className ?? ''}`} {...props} />
)

export const Textarea = ({ className, ...props }) => (
  <textarea className={`${sharedInputClasses} ${className ?? ''}`} {...props} />
)

export const Select = ({ className, children, ...props }) => (
  <select className={`${sharedInputClasses} ${className ?? ''}`} {...props}>
    {children}
  </select>
)

export const Label = ({ children }) => (
  <label className="block text-xs font-mono font-bold mb-1 uppercase tracking-wider text-neutral-black/70">
    {children}
  </label>
)

Input.propTypes = { className: PropTypes.string }
Textarea.propTypes = { className: PropTypes.string }
Select.propTypes = { className: PropTypes.string, children: PropTypes.node }
Label.propTypes = { children: PropTypes.node }

export default FormCounter   // keep original default export