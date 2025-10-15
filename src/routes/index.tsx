import { createFileRoute } from '@tanstack/react-router'

import { IngredientsTable } from '@/components/ingredients/IngredientsTable'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Gelato Ingredient Catalog
          </h1>
          <p className="max-w-3xl text-slate-300">
            Review every ingredient available to the gelato kitchen. Status,
            supplier, and composition details stay in sync with the backend API.
          </p>
        </header>

        <IngredientsTable />
      </div>
    </main>
  )
}
