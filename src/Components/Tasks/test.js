// // import { useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Modal,
//   Button,
//   Badge,
//   Tab,
//   Nav,
//   ProgressBar,
//   Alert,
//   Spinner,
// } from 'react-bootstrap';
// import {
//   FileText,
//   Users,
//   Upload,
//   Clock,
//   ArrowLeft,
//   ArrowRight,
//   Check,
// } from 'lucide-react';
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// import { getTaskById, updateTask } from '../../API/tasks';
// import { useAuth } from '../../contexts/AuthContext';

// // TASK MODAL
// function TaskModal({ show, onHide, taskId, projectId }) {
//   const [token] = useAuth();
//   const [activeTab, setActiveTab] = useState('overview');
//   const queryClient = useQueryClient();

//   const taskQuery = useQuery({
//     queryKey: ['task', taskId, projectId],
//     queryFn: async () => {
//       const data = await getTaskById(taskId, projectId, token);
//       if (!data) throw new Error('No data returned');
//       return {
//         ...data,
//         startDate: data.startDate ? new Date(data.startDate).toLocaleDateString() : null,
//         dueDate: data.dueDate ? new Date(data.dueDate).toLocaleDateString() : null,
//       };
//     },
//     retry: 2,
//     staleTime: 2 * 60 * 1000, // 2 min
//     enabled: !!taskId && !!projectId,
//     onError: (err) => console.error('Error fetching task:', err),
//   });

//   const currentTask = taskQuery.data ?? {};

//   const phaseMutation = useMutation({
//     mutationFn: ({ token, projectId, taskId, phase }) =>
//       updateTask(token, projectId, taskId, { phase }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['tasks', taskId]);
//     },
//   });

//   const getNextPhase = (currentPhase) => {
//     const phaseFlow = {
//       story: 'inProgress',
//       inProgress: 'reviewing',
//       reviewing: 'done',
//     };
//     return phaseFlow[currentPhase];
//   };

//   const getPreviousPhase = (currentPhase) => {
//     const reversePhaseFlow = {
//       done: 'reviewing',
//       reviewing: 'inProgress',
//       inProgress: 'story',
//     };
//     return reversePhaseFlow[currentPhase];
//   };

//   const handlePhaseChange = (newPhase) => {
//     phaseMutation.mutate({
//       token,
//       projectId: currentTask?.projectId,
//       taskId: currentTask?.taskId,
//       phase: newPhase,
//     });
//   };

//   const cycleTimePercentage = (currentTask?.cycleTime / currentTask?.leadTime) * 100;

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       {taskQuery.isLoading ? (
//         <Modal.Body>
//           <div className="text-center">
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         </Modal.Body>
//       ) : taskQuery.isError ? (
//         <Modal.Body>
//           <Alert variant="danger">
//             Failed to load task details. {taskQuery.error?.message && `Error: ${taskQuery.error.message}`}
//           </Alert>
//         </Modal.Body>
//       ) : (
//         <>
//           <Modal.Header closeButton>
//             <Modal.Title>{currentTask?.title || 'Task Details'}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="mb-3">
//               <span className="text-muted">Task ID: {currentTask?.taskId}</span>
//               <Badge bg={'#ffffff'} className="ms-2 text-xs capitalize">
//                 {currentTask?.phase}
//               </Badge>
//             </div>

//             <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
//               <Nav variant="tabs">
//                 <Nav.Item>
//                   <Nav.Link eventKey="overview">
//                     <FileText /> Overview
//                   </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                   <Nav.Link eventKey="team">
//                     <Users /> Team
//                   </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                   <Nav.Link eventKey="attachments">
//                     <Upload /> Attachments
//                   </Nav.Link>
//                 </Nav.Item>
//                 <Nav.Item>
//                   <Nav.Link eventKey="metrics">
//                     <Clock /> Metrics
//                   </Nav.Link>
//                 </Nav.Item>
//               </Nav>

//               <Tab.Content className="mt-3">
//                 <Tab.Pane eventKey="overview">
//                   <h5>Task Description</h5>
//                   <p>{currentTask?.description || 'No description provided'}</p>

//                   <h5>Requirements</h5>
//                   {currentTask?.requirements?.length > 0 ? (
//                     <ul className="list-disc ps-3">
//                       {currentTask?.requirements.map((req, index) => (
//                         <li key={index}>{req}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No specific requirements defined</p>
//                   )}
//                 </Tab.Pane>

//                 <Tab.Pane eventKey="team">
//                   <h5>Team Members</h5>
//                   <div className="row g-3">
//                     {currentTask?.members?.map((member) => (
//                       <div key={member.user} className="col-6 d-flex align-items-center gap-3 p-3 border rounded">
//                         <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-circle" />
//                         <div>
//                           <div className="font-medium">{member.name}</div>
//                           <Badge bg="outline-secondary">{member.role}</Badge>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </Tab.Pane>

//                 <Tab.Pane eventKey="attachments">
//                   <div className="border-dashed border-2 p-4 text-center">
//                     <Upload size={48} className="text-muted-foreground mb-2" />
//                     <p>Drag and drop files or click to upload</p>
//                     <input
//                       type="file"
//                       className="d-none"
//                       multiple
//                       onChange={() => {
//                         // Implement file upload logic
//                         // setUploadProgress(50); // Simulated progress
//                       }}
//                     />
//                   </div>

//                   {currentTask?.attachments?.length > 0 && (
//                     <div className="mt-4">
//                       <h5 className="mb-3">Existing Attachments</h5>
//                       {currentTask?.attachments.map((attachment) => (
//                         <div key={attachment.id} className="d-flex justify-content-between align-items-center p-3 border-bottom">
//                           <div className="d-flex align-items-center gap-2">
//                             <FileText className="text-muted-foreground" />
//                             <div>
//                               <div>{attachment.filename}</div>
//                               <div className="text-muted">
//                                 {attachment.contentType} • {attachment.size}
//                               </div>
//                             </div>
//                           </div>
//                           <Button variant="outline-secondary" size="sm">
//                             <Check />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Tab.Pane>

//                 <Tab.Pane eventKey="metrics">
//                   <div className="row">
//                     <div className="col-6">
//                       <h5>Lead Time</h5>
//                       <ProgressBar now={cycleTimePercentage} />
//                       <small>{currentTask?.leadTime} days</small>
//                     </div>
//                     <div className="col-6">
//                       <h5>Cycle Time</h5>
//                       <ProgressBar now={cycleTimePercentage} />
//                       <small>{currentTask?.cycleTime} days</small>
//                     </div>
//                   </div>
//                 </Tab.Pane>
//               </Tab.Content>
//             </Tab.Container>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="outline-secondary" onClick={onHide}>
//               Close
//             </Button>
//             <div className="ms-auto d-flex gap-2">
//               {currentTask?.phase !== 'story' && (
//                 <Button variant="outline-secondary" onClick={() => handlePhaseChange(getPreviousPhase(currentTask.phase))}>
//                   <ArrowLeft /> Previous Phase
//                 </Button>
//               )}
//               {currentTask?.phase !== 'done' && (
//                 <Button variant="primary" onClick={() => handlePhaseChange
