"use client"

import { useState } from "react"
import "./ApiKeyForm.css"

interface ApiKeyFormProps {
  onCreateKey: (name: string, expiresAt: string | null) => Promise<void>
}

export function ApiKeyForm({ onCreateKey }: ApiKeyFormProps) {
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyExpiry, setNewKeyExpiry] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newKeyName.trim()) {
      setError("Name is required")
      return
    }

    setIsCreating(true)

    try {
      await onCreateKey(newKeyName, newKeyExpiry || null)
      setNewKeyName("")
      setNewKeyExpiry("")
    } catch (err) {
      setError("Failed to create API key")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <tr className="api-key-form-row">
      <td className="api-key-form-cell">
        <input
          type="text"
          placeholder="Enter key name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="api-key-input"
        />
      </td>
      <td className="api-key-form-cell">
        <input
          type="datetime-local"
          value={newKeyExpiry}
          onChange={(e) => setNewKeyExpiry(e.target.value)}
          className="api-key-input"
        />
      </td>
      <td colSpan={2} className="api-key-form-cell">
        <button
          onClick={handleSubmit}
          disabled={isCreating}
          className="api-key-create-btn"
        >
          {isCreating ? 'Creating...' : 'Add'}
        </button>
        {error && (
          <span className="api-key-error">
            {error}
          </span>
        )}
      </td>
    </tr>
  )
}
