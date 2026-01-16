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
  isJustCreated: boolean
  onRevoke: (id: string) => void
}

export function ApiKeyRow({ apiKey, isJustCreated, onRevoke }: ApiKeyRowProps) {
  const [openMenu, setOpenMenu] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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
        {isJustCreated ? (
          <div className="api-key-value-container">
            <code className="api-key-value-visible">
              {apiKey.value}
            </code>
            <button
              onClick={() => copyToClipboard(apiKey.value)}
              className="api-key-copy-btn"
            >
              Copy
            </button>
          </div>
        ) : (
          <span className="api-key-value-hidden">••••••••••••••••</span>
        )}
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
