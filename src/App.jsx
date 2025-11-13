import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/todos`)
      const data = await res.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    try {
      const res = await fetch(`${API_BASE}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc })
      })
      const data = await res.json()
      setTodos([data, ...todos])
      setTitle('')
      setDesc('')
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE}/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })
      const updated = await res.json()
      setTodos(todos.map(t => t.id === id ? updated : t))
    } catch (e) {
      console.error(e)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_BASE}/api/todos/${id}`, { method: 'DELETE' })
      setTodos(todos.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Todos</h1>

        <form onSubmit={addTodo} className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add details (optional)"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            disabled={creating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 w-fit"
          >
            {creating ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {todos.length === 0 && (
              <li className="text-slate-500">No todos yet. Add one above.</li>
            )}
            {todos.map(t => (
              <li key={t.id} className="bg-white rounded-xl shadow p-4 flex items-start gap-3">
                <button
                  onClick={() => toggleTodo(t.id, t.completed)}
                  className={`w-5 h-5 rounded border flex items-center justify-center mt-1 ${t.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
                  aria-label="Toggle"
                >
                  {t.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className={`font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.title}</div>
                  {t.description && <div className="text-slate-500 text-sm mt-1">{t.description}</div>}
                </div>
                <button onClick={() => deleteTodo(t.id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
