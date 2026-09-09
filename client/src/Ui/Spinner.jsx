import propTypes from 'prop-types'
export const Spinner= ({ title="Loading", subtitle="..." }) => (
  <div className="bg-white p-8 rounded-lg shadow-md w-full">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500 text-center">{subtitle}</p>
    </div>
  </div>
)
Spinner.propTypes = {
  title: propTypes.string,
  subtitle: propTypes.string,
}