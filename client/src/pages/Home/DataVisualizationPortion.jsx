import { useState } from 'react'
import dataVisualizationIcon from '../../assets/preferences.svg'
import { Modal } from '../../Ui/Modal'

export default function DataVisualizationPortion() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="border-thick border-neutral-black bg-neutral-white rounded-card p-5 text-center">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3">Visualize Data</h3>
          <button
            onClick={() => setShowModal(true)}
            className="border-thick bg-[#FFD941] rounded-full h-20 w-20 flex items-center justify-center p-4 mb-1 hover:scale-105 transition-transform"
            aria-label="Data visualization"
          >
            <img src={dataVisualizationIcon} alt="data visualization" className="w-16 cursor-pointer" />
          </button>
          <p className="mt-0 mb-4 text-[#666]">
            Visualize your project data to gain insights and make decisions.
          </p>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Data Visualization">
        <p>Data visualization content goes here.</p>
      </Modal>
    </>
  )
}