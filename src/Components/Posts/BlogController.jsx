// BlogControls.jsx
/* eslint-disable react/prop-types */
import { useState } from 'react'
import filterIcon from '../../assets/filter.svg'

export function BlogControls({
  author,
  onAuthorChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  sortFields,
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="mb-3 mx-1">
      <button
        type="button"
        className="phase-button flex items-center gap-2 border-2 border-black rounded-full bg-[#FFDE59] px-4 py-2 text-black font-bold"
        onClick={() => setShowModal(true)}
      >
        <img src={filterIcon} width={25} alt="Filter" className="phase-button-icon" />
        <span>Filter</span>
      </button>

      {/* Custom Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false)
          }}
        >
          <div className="bg-white rounded-md p-4 w-full max-w-md border-2 border-neutral-black shadow-lg">
            <div className="flex justify-between items-center border-b-2 border-modal-divider pb-2 mb-4">
              <h3 className="text-lg font-bold">Filter Options</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Filter by Author</label>
                <div className="flex border-2 border-black rounded-md overflow-hidden">
                  <span className="bg-gray-100 px-3 py-1 border-r-2 border-black">Author</span>
                  <input
                    type="text"
                    placeholder="Filter by author..."
                    value={author}
                    onChange={(e) => onAuthorChange(e.target.value)}
                    className="flex-1 px-3 py-1 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full border-2 border-black rounded-md px-3 py-1 bg-white"
                >
                  {sortFields.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => onSortOrderChange(e.target.value)}
                  className="w-full border-2 border-black rounded-md px-3 py-1 bg-white"
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}