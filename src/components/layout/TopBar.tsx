import { Bell, CircleHelp, Search, Settings, Volume2, VolumeX } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { moduleTitles } from '../../data/navigation'
import { useSimulator } from '../../context/SimulatorContext'

const getTitleFromPath = (pathname: string): string => {
  const matching = Object.entries(moduleTitles).find(([path]) =>
    pathname.startsWith(path),
  )
  return matching ? matching[1] : 'SAP SD O2C Simulator'
}

export const TopBar = () => {
  const { pathname } = useLocation()
  const { state, toggleTheme, toggleSound } = useSimulator()

  return (
    <header className="sticky top-0 z-30 border-b border-outline/30 bg-surface/90 backdrop-blur-lg dark:bg-inverse-surface/90">
      <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <div>
            <p className="font-heading text-lg font-black tracking-tight text-on-surface dark:text-inverse-on-surface">
              SAP SD O2C Simulator
            </p>
            <p className="text-xs text-on-surface/70 dark:text-inverse-on-surface/70">
              Enterprise Edition
            </p>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-primary">{getTitleFromPath(pathname)}</p>
          </div>
        </div>

        <div className="hidden min-w-[220px] flex-1 items-center lg:flex">
          <label className="relative block w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/60 dark:text-inverse-on-surface/60"
            />
            <input
              type="text"
              aria-label="Search"
              placeholder="Search transaction, T-code, or document..."
              className="h-10 w-full rounded-full bg-surface-container px-10 text-sm text-on-surface outline-none transition focus:ring-2 focus:ring-primary/40 dark:bg-inverse-surface"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={state.preferences.soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="rounded-full p-2 text-on-surface transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-inverse-on-surface dark:hover:bg-surface-container"
          >
            {state.preferences.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-on-surface transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-inverse-on-surface dark:hover:bg-surface-container"
          >
            <Settings size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full p-2 text-on-surface transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-inverse-on-surface dark:hover:bg-surface-container"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="rounded-full p-2 text-on-surface transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-inverse-on-surface dark:hover:bg-surface-container"
          >
            <CircleHelp size={18} />
          </button>
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
            AK
          </div>
        </div>
      </div>
    </header>
  )
}
