"use client"

import { useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { ApiKeyTable } from "./components/ApiKeyTable";
import { ModalApiKeyForm } from "@/components/forms/ModalApiKeyForm";
import { createApiKeyAction } from "@actions/api-key";
import "./page.css";

interface DashboardClientProps {
  initialKeys: any[];
}

export default function DashboardClient({ initialKeys }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateKey = async (name: string, expiresAt: string | null) => {
    const result = await createApiKeyAction({ name, expiresAt });

    if (!result.success || !result.data?.value) {
      throw new Error(result.error || "Failed to generate key");
    }

    return { key: result.data.value };
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader />

      <main className="dashboard-main">
        <div className="dashboard-controls">
          <div className="title-group">
            <h1>API Keys</h1>
            <p>Manage your keys to access the Feedback Widget API.</p>
          </div>

          <button
            className="api-key-create-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Key
          </button>
        </div>

        <ApiKeyTable apiKeys={initialKeys} />

        <ModalApiKeyForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateKey={handleCreateKey}
        />
      </main>
    </div>
  );
}