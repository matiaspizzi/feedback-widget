"use client";

import { useState } from "react";
import { DashboardHeader } from "./_components/DashboardHeader";
import { ApiKeyTable } from "./_components/ApiKeyTable";
import { ModalApiKeyForm } from "@/components/forms/ModalApiKeyForm";
import { createApiKeyAction } from "@actions/api-key";
import { Button } from "@components/ui";
import type { ApiKey } from "@repo/database";
import "./page.css";

interface DashboardClientProps {
  initialKeys: ApiKey[];
}

export default function DashboardClient({ initialKeys }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateKey = async (name: string, expiresAt: string | null) => {
    return await createApiKeyAction({ name, expiresAt });
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

          <Button label="Create New Key" onClick={() => setIsModalOpen(true)} />
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
