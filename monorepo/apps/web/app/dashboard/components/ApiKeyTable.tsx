"use client"

import { useState, useEffect } from "react"
import { ApiKeyForm } from "./ApiKeyForm"
import { ApiKeyRow } from "./ApiKeyRow"
import "./ApiKeyTable.css"

interface ApiKey {
  id: string
  name: string
  value: string
  createdAt: string
  expiresAt: string | null
}

export function ApiKeyTable() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [justCreatedKey, setJustCreatedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/keys")
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      }
    } catch (err) {
      console.error("Failed to fetch API keys:", err)
    }
  }

  const handleCreateKey = async (name: string, expiresAt: string | null) => {
    let formattedExpiresAt: string | null = null

    if (expiresAt) {
      formattedExpiresAt = new Date(expiresAt).toISOString()
    }

    const response = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        expiresAt: formattedExpiresAt,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Failed to create API key")
    }

    const newKey = await response.json()
    setJustCreatedKey(newKey.value)
    setApiKeys([newKey, ...apiKeys])
  }

  const handleRevokeKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id))
      }
    } catch (err) {
      console.error("Failed to revoke API key:", err)
    }
  }

  return (
    <div className="api-key-table-container">
      <table className="api-key-table">
        <thead>
          <tr className="api-key-table-header">
            <th className="api-key-table-th">Name</th>
            <th className="api-key-table-th">Expires At</th>
            <th className="api-key-table-th">Key</th>
            <th className="api-key-table-th api-key-table-th-actions"></th>
          </tr>
        </thead>
        <tbody>
          <ApiKeyForm onCreateKey={handleCreateKey} />

          {apiKeys.map((key) => (
            <ApiKeyRow
              key={key.id}
              apiKey={key}
              isJustCreated={justCreatedKey === key.value}
              onRevoke={handleRevokeKey}
            />
          ))}
        </tbody>
      </table>

      {apiKeys.length === 0 && (
        <div className="api-key-table-empty">
          No API keys yet. Create your first one above.
        </div>
      )}
    </div>
  )
}
