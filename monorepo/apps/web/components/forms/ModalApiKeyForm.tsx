"use client"

import { useState } from "react"
import { Modal, Button } from "@components/ui"
import "./ModalApiKeyForm.css"

interface ModalApiKeyFormProps {
  isOpen: boolean
  onClose: () => void
  onCreateKey: (name: string, expiresAt: string | null) => Promise<{ key: string }>
}

export const ModalApiKeyForm = ({ isOpen, onClose, onCreateKey }: ModalApiKeyFormProps) => {
  const [name, setName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const handleReset = () => {
    setName("")
    setExpiry("")
    setCreatedKey(null)
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError("Name is required")

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onCreateKey(name, expiry || null)
      setCreatedKey(result.key)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create API key")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (createdKey) navigator.clipboard.writeText(createdKey)
  }

  return (
    <Modal isOpen={isOpen} onClose={createdKey ? () => { } : handleReset}>
      <div className="api-key-container">
        {!createdKey ? (
          <form onSubmit={handleSubmit} className="api-key-form">
            <h2>Create New API Key</h2>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Expiration</label>
              <input
                className="api-key-expiry"
                type="datetime-local"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <div className="form-actions">
              <Button
                label="Cancel"
                onClick={onClose}
                variant="tertiary"
                disabled={isSubmitting}
              />
              <Button
                isLoading={isSubmitting}
                label={isSubmitting ? 'Creating...' : 'Add'}
                onClick={handleSubmit}
                variant="primary"
              />
            </div>
          </form>
        ) : (
          <div className="success-state">
            <h2>API Key Generated</h2>
            <p className="warning-box">
              <strong>Warning:</strong> Copy this key now. For security reasons,
              it will not be shown again.
            </p>
            <div className="key-display">
              <code>{createdKey}</code>
              <Button onClick={copyToClipboard} label="Copy" variant="quaternary" />
            </div>
            <Button
              label="Continue"
              onClick={handleReset}
              variant="primary"
            />
          </div>
        )}
      </div>
    </Modal>
  )
}