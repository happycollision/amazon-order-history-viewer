import { createFileRoute } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/upload')({
  component: Upload,
})

function Upload() {
  return (
    <div className="App">
      <header className="App-header">
        Dis da upload page
      </header>
    </div>
  )
}
