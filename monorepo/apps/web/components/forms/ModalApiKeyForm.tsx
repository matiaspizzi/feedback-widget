"use client"

import { useState } from "react"
import { Modal, Button, Input } from "@components/ui"
import "./ModalApiKeyForm.css"
import { ActionResponse } from "@actions/types"

interface ModalApiKeyFormProps {
  isOpen: boolean
  onClose: () => void
  onCreateKey: (name: string, expiresAt: string | null) => Promise<ActionResponse<{ value: string }>>
}

export const ModalApiKeyForm = ({ isOpen, onClose, onCreateKey }: ModalApiKeyFormProps) => {
  const [name, setName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const handleReset = () => {
    setName("")
    setExpiry("")
    setCreatedKey(null)
    setFieldErrors({})
    setGeneralError(null)
    setIsSubmitting(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError(null);

    const result = await onCreateKey(name, expiry || null);

    if (result.success) {
      setCreatedKey(result.data.value);
    } else {
      setGeneralError(result.error);
      if (result.details) {
        setFieldErrors(result.details);
      }
    }
    setIsSubmitting(false);
  };

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
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                error={fieldErrors.name?.[0]}
              />
            </div>
            <div className="form-group">
              <Input
                label="Expiration"
                type="datetime-local"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                disabled={isSubmitting}
                error={fieldErrors.expiresAt?.[0]}
              />
            </div>

            {generalError && !fieldErrors.name && !fieldErrors.expiresAt && (
              <p className="error-text">{generalError}</p>
            )}

            <div className="form-actions">
              <Button
                label="Cancel"
                type="button"
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