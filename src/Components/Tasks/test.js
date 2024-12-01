// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// import PropTypes from 'prop-types'
// import { useState, useRef } from 'react'
// import { Card, Button, Badge, Modal, Image } from 'react-bootstrap'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { , uploadTaskAttachment } from '../../API/tasks.js'
// import { useAuth } from '../../contexts/AuthContext.jsx'
// import { User } from '../User/User.jsx'

// import forwardArrow from '../../assets/forward-negative.svg'
// import backwardArrow from '../../assets/backward-negative.svg'
// import { format, isValid } from 'date-fns'
// import {
//   UploadCloud,
//   Paperclip,
//   Calendar,
//   Clock,
//   User as UserIcon,
// } from 'lucide-react'

// function createHexColor(id) {
//   const cleanedId = id.replace(/\s/g, '')
//   const firstChar = cleanedId.charAt(cleanedId.length - 1)
//   const middleChar = cleanedId.charAt(cleanedId.length - 2)
//   const lastChar = cleanedId.charAt(cleanedId.length - 3)
//   return `#fd9${firstChar}${middleChar}${lastChar}`
// }

// export function TaskCard({
//   taskId,
//   title,
//   author,
//   leadTime,
//   cycleTime,
//   phase,
//   requirements = [],
//   members = [],
//   attachments = [],
//   createdAt,
//   updatedAt,
//   projectId,
//   onAttachmentUpload,
// }) {

//   return (
//     <>
//       {/* Rest of the component remains the same, with the only changes being in the mutations */}
//       {/* ... (previous code) ... */}
//     </>
//   )
// }

// TaskCard.propTypes = {
//   ...TaskCard.propTypes, // Spread existing propTypes
//   projectId: PropTypes.string.isRequired, // Add projectId to propTypes
// }
