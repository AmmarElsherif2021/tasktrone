/**
 * Settings.jsx — Notifications + CustomDropdown
 * ──────────────────────────────────────────────────────────────
 * CustomDropdown is a shared primitive used here.
 * If more components need it, extract to Ui/CustomDropdown.jsx.
 */
import { useState, useRef, useEffect }  from 'react'
import IconButton                        from '../../Ui/IconButton'
import notificationIcon         from '../../assets/notification-icon.svg'
import notificationSettingsIcon from '../../assets/notificationsSettings.svg'
import markAllIcon              from '../../assets/markAll.svg'

// ── Shared dropdown primitive ─────────────────────────────────
const CustomDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setIsOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 z-50
            flex flex-col items-center gap-2 p-3
            bg-card-bg
            border-[length:var(--border-width-base)] border-card-border border-solid
            shadow-sm
            w-32
          "
        >
          {children}
        </div>
      )}
    </div>
  )
}

// ── Notifications ─────────────────────────────────────────────
export const Notifications = () => (
  <CustomDropdown
    trigger={
      <IconButton
        src={notificationIcon}
        alt="Notifications"
        iconWidthREM={1.75}
        color="var(--color-neutral-black)"
      />
    }
  >
    <IconButton src={notificationIcon}         alt="Unread Notifications"   iconWidthREM={9} className="w-full" />
    <IconButton src={markAllIcon}              alt="Mark All Read"          iconWidthREM={9} className="w-full" />
    <IconButton src={notificationSettingsIcon} alt="Notification Settings"  iconWidthREM={9} className="w-full" />
  </CustomDropdown>
)

export default Notifications