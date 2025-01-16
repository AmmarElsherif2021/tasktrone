/* eslint-disable react/prop-types */

import { Navbar, Container } from 'react-bootstrap'
import { format } from 'date-fns'

import Notifications from './Notifications'
import Search from './Search'
import RefreshProject from './RefreshProject'

const THEME = {
  colors: {
    primary: '#1aaa8F',
    secondary: '#EAF9ED',
    accent: '#EC4F50',
    dark: '#404C46',
    muted: '#B4E2D3',
  },
}

const COMMON_STYLES = {
  navbar: {
    borderStyle: 'solid',
    borderColor: '#000', //THEME.colors.primary,
    backgroundColor: THEME.colors.muted,
    borderWidth: '2px',
    padding: '1rem',
    borderRadius: '0.5rem',
    height: '4rem',
  },
  metricBox: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    borderStyle: 'solid',
    borderColor: THEME.colors.primary,
    borderWidth: '1px',
    backgroundColor: THEME.colors.secondary,
    color: THEME.colors.dark,
    fontSize: '0.875rem',
    textAlign: 'center',
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
        <div className='d-flex align-items-center justify-content-between w-100 py-2'>
          {/* Left section - Project Info */}
          <div className='d-flex align-items-center'>
            <div
              className='rounded-circle me-3'
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: THEME.colors.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeIntegrations > 0 ? '✓' : '!'}
            </div>
            <div>
              <h5 style={{ margin: 0 }}>{title}</h5>
              <small className='text-muted'>
                {formatDate(startDate)} - {formatDate(endDate)}
              </small>
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
