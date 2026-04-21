import { Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { sidebarLinks } from '../../data/navigation'

export const Sidebar = () => {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[240px] shrink-0 border-r border-outline/20 bg-surface-container-low p-3 lg:block dark:bg-inverse-surface">
      <div className="flex h-full flex-col gap-3">
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-3 text-on-primary">
          <p className="text-sm font-semibold">O2C Workflow</p>
          <p className="text-xs text-on-primary/80">Simulation phase</p>
        </div>

        <NavLink
          to="/simulation/setup"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary transition hover:brightness-105"
        >
          <Plus size={16} />
          New Simulation
        </NavLink>

        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary-fixed text-primary'
                      : 'text-on-surface hover:bg-surface-container hover:text-primary dark:text-inverse-on-surface'
                  }`
                }
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-outline/20 pt-3 text-xs text-on-surface/70 dark:text-inverse-on-surface/70">
          <p>System Status: Ready</p>
          <p>Simulation Engine v2.4.1</p>
        </div>
      </div>
    </aside>
  )
}
