// Search.jsx
import { useState } from 'react'
import searchIcon from '../../assets/search.svg'

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex items-center">
      <button
        type="button"
        className="p-1 hover:opacity-70 transition-opacity"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle search"
      >
        <img src={searchIcon} className="w-7 h-7" alt="search" />
      </button>

      {isOpen && (
        <input
          type="text"
          placeholder="Search…"
          className="
            ml-2 px-3 py-1
            font-mono text-sm
            bg-neutral-white
            border-[length:var(--border-width-base)] border-sage border-solid
            focus:outline-none focus:ring-1 focus:ring-sage
          "
        />
      )}
    </div>
  )
}

export default Search