// PostSorting.jsx
import PropTypes from 'prop-types'

export function PostSorting({
  fields = [],
  value,
  onChange,
  orderValue,
  onOrderChange,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <div>
        <label htmlFor="sortBy" className="mr-2 block sm:inline">
          Sort By:
        </label>
        <select
          id="sortBy"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-black rounded-md px-2 py-1 bg-white"
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sortOrder" className="mr-2 block sm:inline">
          Sort Order:
        </label>
        <select
          id="sortOrder"
          value={orderValue}
          onChange={(e) => onOrderChange(e.target.value)}
          className="w-full border-2 border-black rounded-md px-2 py-1 bg-white"
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>
    </div>
  )
}

PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderValue: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
}