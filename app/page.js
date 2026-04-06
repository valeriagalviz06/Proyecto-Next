'use client'

import { useState } from 'react'

export default function Home() {
  const [table, setTable] = useState('todos')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('')

  async function fetchTable() {
    setStatus('Loading...')
    setResult(null)

    try {
      const res = await fetch(`/api/query-table?table=${encodeURIComponent(table)}`)
      const data = await res.json()
      setResult(data)
      setStatus(res.ok ? 'Success' : 'Error')
    } catch (error) {
      setResult({ error: error.message })
      setStatus('Error')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950 dark:bg-slate-950 dark:text-zinc-100">
      <main className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
        <h1 className="text-4xl font-semibold">Supabase DB Explorer</h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Usa tu proyecto Supabase para consultar una tabla desde el navegador. Escribe el nombre de tu tabla y pulsa el botón.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nombre de la tabla
            <input
              value={table}
              onChange={(event) => setTable(event.target.value)}
              placeholder="ejemplo: todos"
              className="rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
            />
          </label>

          <button
            type="button"
            onClick={fetchTable}
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-black dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Consultar tabla
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-100 p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">Resultado</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{status}</p>
            </div>
          </div>
          <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap break-words text-sm leading-6 text-zinc-800 dark:text-zinc-100">
            {result ? JSON.stringify(result, null, 2) : 'Pulsa el botón para consultar tu tabla.'}
          </pre>
        </div>
      </main>
    </div>
  )
}
