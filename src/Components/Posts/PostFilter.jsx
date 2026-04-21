// PostFilter.jsx
import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex border-2 border-black rounded-md overflow-hidden">
        <span className="bg-gray-100 px-3 py-1 border-r-2 border-black capitalize">
          {field}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Filter by ${field}...`}
          className="flex-1 px-3 py-1 focus:outline-none"
        />
      </div>
    </div>
  )
}

PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}