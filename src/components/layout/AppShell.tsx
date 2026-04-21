import { Outlet } from 'react-router-dom'
import { FooterBar } from './FooterBar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-surface-dim dark:text-inverse-on-surface">
      <TopBar />
      <div className="mx-auto flex max-w-[1800px]">
        <Sidebar />
        <main className="min-h-[calc(100vh-96px)] flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <FooterBar />
    </div>
  )
}
