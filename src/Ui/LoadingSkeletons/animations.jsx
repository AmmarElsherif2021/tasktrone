// animations.js
export const ANIMATION_CONSTANTS = {
  duration: {
    slow: '2s',
    medium: '1.5s',
    fast: '0.8s',
  },
  timing: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
}

export const createKeyframes = (theme) => `
    @keyframes pulse {
      0% { opacity: 0.8; }
      50% { opacity: 0.4; }
      100% { opacity: 0.8; }
    }
  
    @keyframes colorShift {
      0% { background-color: ${theme.colors.secondary}; }
      35% { background-color: ${theme.colors.muted}; }
      65% { background-color: ${theme.colors.muted}; }
      100% { background-color: ${theme.colors.secondary}; }
    }
  
    @keyframes slideIn {
      from { 
        transform: translateY(20px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  
    @keyframes scaleIn {
      from { 
        transform: scale(0.95);
        opacity: 0;
      }
      to { 
        transform: scale(1);
        opacity: 1;
      }
    }
  `

export const ANIMATION_STYLES = {
  pulse: {
    animation: `pulse ${ANIMATION_CONSTANTS.duration.medium} infinite ${ANIMATION_CONSTANTS.timing.smooth}`,
  },
  colorShift: {
    animation: `colorShift ${ANIMATION_CONSTANTS.duration.slow} infinite ${ANIMATION_CONSTANTS.timing.smooth}`,
  },
  slideIn: {
    animation: `slideIn ${ANIMATION_CONSTANTS.duration.fast} ${ANIMATION_CONSTANTS.timing.elastic}`,
  },
  fadeIn: {
    animation: `fadeIn ${ANIMATION_CONSTANTS.duration.fast} ${ANIMATION_CONSTANTS.timing.smooth}`,
  },
  scaleIn: {
    animation: `scaleIn ${ANIMATION_CONSTANTS.duration.fast} ${ANIMATION_CONSTANTS.timing.bounce}`,
  },
}
