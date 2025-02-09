/* eslint-disable react/prop-types */
import { Card } from 'react-bootstrap'
import { colors } from './colors'

const CARD_STYLES = {
  borderWidth: '2.5px',
  borderColor: '#557263',
  transition: 'background-color 0.2s',
  backgroundColor: colors.cardBackgroundColor,
  padding: '0.5rem',
}

const HOVER_CARD_STYLES = {
  backgroundColor: colors.hoverCardBackgroundColor,
}

export const StyledCard = ({
  children,
  hoverKey,
  hoverStates,
  handleHover,
  style,
}) => (
  <Card
    className='mb-1 '
    style={{
      ...CARD_STYLES,
      backgroundColor: hoverStates[hoverKey]
        ? HOVER_CARD_STYLES.backgroundColor
        : CARD_STYLES.backgroundColor,
      ...style,
    }}
    onMouseEnter={() => handleHover(hoverKey, true)}
    onMouseLeave={() => handleHover(hoverKey, false)}
  >
    {children}
  </Card>
)
