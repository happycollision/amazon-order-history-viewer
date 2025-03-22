import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/upload')({
  component: Upload,
})

function Upload() {
  return (
    <div>
      <header className="text-purple-700">
        Dis da upload page
      </header>
    </div>
  )
}
