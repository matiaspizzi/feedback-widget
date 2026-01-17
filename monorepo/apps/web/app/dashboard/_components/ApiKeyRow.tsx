"use client"

import { useState } from "react"
import "./ApiKeyRow.css"

interface ApiKeyRowProps {
  apiKey: {
    id: string
    name: string
    value: string
    createdAt: string
    expiresAt: string | null
  }
  onRevoke: (id: string) => void
}

export function ApiKeyRow({ apiKey, onRevoke }: ApiKeyRowProps) {
  const [openMenu, setOpenMenu] = useState(false)

  const handleRevoke = () => {
    if (confirm("Are you sure you want to revoke this API key?")) {
      onRevoke(apiKey.id)
    }
  }

  return (
    <tr className="api-key-row">
      <td className="api-key-cell">{apiKey.name}</td>
      <td className="api-key-cell api-key-expiry">
        {apiKey.expiresAt ? new Date(apiKey.expiresAt).toLocaleString() : 'Never'}
      </td>
      <td className="api-key-cell api-key-value-cell">

      </td>
      <td className="api-key-cell api-key-actions-cell">
        <button
          onClick={() => {
            setOpenMenu(!openMenu)
          }}
          className="api-key-menu-btn"
        >
          ⋮
        </button>
        {openMenu && (
          <div className="api-key-menu">
            <button
              onClick={handleRevoke}
              className="api-key-revoke-btn"
            >
              Revoke
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}
