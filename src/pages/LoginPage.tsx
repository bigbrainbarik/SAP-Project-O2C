import { ArrowRightToLine, Building2, Globe, Lock, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const navigate = useNavigate()
  const [client, setClient] = useState('800')
  const [user, setUser] = useState('SD_EXPERT')
  const [password, setPassword] = useState('******')
  const [language, setLanguage] = useState('EN')
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const nextErrors: { [k: string]: string } = {}
    if (!client.trim()) nextErrors.client = 'Client is required.'
    if (!user.trim()) nextErrors.user = 'User is required.'
    if (!password.trim()) nextErrors.password = 'Password is required.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    navigate('/loader')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-surface-dim via-surface to-surface-dim px-4">
      <div className="absolute inset-y-0 left-1/2 h-full w-[240px] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/8 to-transparent" />

      <div className="relative w-full max-w-sm rounded-2xl bg-surface/85 p-6 shadow-soft ring-1 ring-outline/20 backdrop-blur-lg dark:bg-inverse-surface/85">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Building2 size={20} />
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tight">SAP SD O2C Simulator</h1>
          <p className="text-sm text-on-surface/70 dark:text-inverse-on-surface/70">Enterprise Edition</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs font-semibold uppercase tracking-wide">
            Client
            <div className="mt-1 flex items-center rounded-md bg-surface-variant px-3 ring-1 ring-outline/20">
              <Building2 size={14} className="text-on-surface/60" />
              <input
                value={client}
                onChange={(event) => setClient(event.target.value)}
                className="h-11 w-full bg-transparent px-2 text-sm outline-none"
              />
            </div>
            {errors.client && <span className="mt-1 block text-[11px] text-red-600">{errors.client}</span>}
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wide">
            User
            <div className="mt-1 flex items-center rounded-md bg-surface-variant px-3 ring-1 ring-outline/20">
              <UserRound size={14} className="text-on-surface/60" />
              <input
                value={user}
                onChange={(event) => setUser(event.target.value)}
                className="h-11 w-full bg-transparent px-2 text-sm outline-none"
              />
            </div>
            {errors.user && <span className="mt-1 block text-[11px] text-red-600">{errors.user}</span>}
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wide">
            Password
            <div className="mt-1 flex items-center rounded-md bg-surface-variant px-3 ring-1 ring-outline/20">
              <Lock size={14} className="text-on-surface/60" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full bg-transparent px-2 text-sm outline-none"
              />
            </div>
            {errors.password && (
              <span className="mt-1 block text-[11px] text-red-600">{errors.password}</span>
            )}
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wide">
            Language
            <div className="mt-1 flex items-center rounded-md bg-surface-variant px-3 ring-1 ring-outline/20">
              <Globe size={14} className="text-on-surface/60" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-11 w-full bg-transparent px-2 text-sm outline-none"
              >
                <option value="EN">EN</option>
                <option value="DE">DE</option>
                <option value="FR">FR</option>
              </select>
            </div>
          </label>

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-primary-container text-sm font-semibold text-on-primary transition hover:brightness-105"
          >
            Execute Logon
            <ArrowRightToLine size={16} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-primary">
          <button type="button">System Status</button>
          <button type="button">Reset Password</button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-outline/20 bg-surface-container-low px-4 py-2 text-xs text-on-surface/70 dark:bg-inverse-surface dark:text-inverse-on-surface/70">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between">
          <p>Simulator Active</p>
          <p>Made by Aditya Kumar Barik</p>
        </div>
      </div>
    </main>
  )
}
