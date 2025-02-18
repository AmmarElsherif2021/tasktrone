/* eslint-disable react/prop-types */

import { Navbar, Container } from 'react-bootstrap'
import { format } from 'date-fns'

import Notifications from './Notifications'
import Search from './Search'
import RefreshProject from './RefreshProject'

const THEME = {
  colors: {
    primary: '#7CBF9E',
    secondary: '#EAF9ED',
    accent: '#EC4F50',
    dark: '#404C46',
    muted: '#B4E2D3',
  },
}

const COMMON_STYLES = {
  navbar: {
    borderStyle: 'solid',
    borderColor: '#000',
    backgroundColor: THEME.colors.primary,
    borderWidth: '2px',
    padding: '1rem',
    borderRadius: '0.5rem',
    height: '5rem',
  },
  metricBox: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    borderStyle: 'solid',
    borderColor: '#000', //THEME.colors.dark,
    borderWidth: '2px',
    backgroundColor: THEME.colors.secondary,
    color: '#000',
    fontFamily: ` var(--font-family-mono)`,
    fontWeight: ' var(--font-weight-bold)',
    fontSize: '0.9em',
    textAlign: 'center',
  },
  activeStyle: {
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: THEME.colors.secondary,
    borderRadius: '4px',
    borderColor: '#000',
    borderWidth: '1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const Toolbar = ({ project }) => {
  const {
    title,
    startDate,
    endDate,
    wip,
    members = [],
    integrations = {},
  } = project

  const activeMembersCount = members.length
  const activeIntegrations = Object.values(integrations).filter(Boolean).length

  const formatDate = (date) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'Not set'
  }

  return (
    <Navbar expand='lg' className='mb-2 ' style={COMMON_STYLES.navbar}>
      <Container fluid className='px-3'>
        <div className='d-flex align-items-center justify-content-between w-100 py-1'>
          {/* Left section - Project Info */}
          <div className='d-flex align-items-center'>
            <span className=' me-3' style={COMMON_STYLES.activeStyle}>
              {activeIntegrations > 0 ? '✓' : '!'}
            </span>
            <div>
              <h5
                style={{
                  fontFamily: ` var(--font-family-mono)`,
                  color: '#000',
                }}
              >
                {title}
              </h5>
              <span
                style={{
                  fontFamily: ` var(--font-family-mono)`,
                  fontWeight: ' var(--font-weight-bold)',
                  fontSize: '0.9em',
                }}
              >
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
          </div>

          {/* Center section - Project Metrics */}
          <div className='d-none d-md-flex align-items-center gap-4'>
            <strong style={COMMON_STYLES.metricBox}>WIP: {wip}%</strong>
            <strong style={COMMON_STYLES.metricBox}>
              Team: {activeMembersCount}
            </strong>
            <strong style={COMMON_STYLES.metricBox}>
              Systems: {activeIntegrations}
            </strong>
          </div>

          {/* Right section - Actions */}
          <div className='d-flex align-items-center gap-3'>
            <Notifications />
            <RefreshProject />
            <Search />
          </div>
        </div>
      </Container>
    </Navbar>
  )
}

export default Toolbar
