// BlogControls.jsx
/* eslint-disable react/prop-types */
import { useState } from 'react'
import filterIcon from '../../assets/filter.svg'
import { Modal } from '../../Ui/Modal'        
import { coldBtn } from '../../Ui/componentStyles'

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
        style={coldBtn('secondary')}
        className="flex items-center gap-2"
        onClick={() => setShowModal(true)}
      >
        <img src={filterIcon} width={25} alt="Filter" />
        <span>Filter</span>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Filter Options"
      >
        {/* All modal content – header is already handled by Modal */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Filter by Author</label>
            <div className="flex border-2 border-neutral-black">
              <span className="bg-neutral-black/10 px-3 py-1 border-r-2 border-neutral-black">
                Author
              </span>
              <input
                type="text"
                placeholder="Filter by author..."
                value={author}
                onChange={(e) => onAuthorChange(e.target.value)}
                className="flex-1 px-3 py-1 focus:outline-none bg-neutral-white"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full border-2 border-neutral-black px-3 py-1 bg-neutral-white"
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
              className="w-full border-2 border-neutral-black px-3 py-1 bg-neutral-white"
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>

          <button
            type="button"
            style={coldBtn('primary')}
            onClick={() => setShowModal(false)}
          >
            Apply
          </button>
        </div>
      </Modal>
    </div>
  )
}