"use client"

import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { deleteApiKeyAction } from "@actions/api-key"
import "./ApiKeyTable.css"
import type { ApiKey } from "@repo/database"

const columnHelper = createColumnHelper<ApiKey>()

export function ApiKeyTable({ apiKeys }: { apiKeys: ApiKey[] }) {

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this key?")) return
    const result = await deleteApiKeyAction(id)
    if (!result.success) alert(result.error)
  }

  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created At",
      cell: (info) => {
        const val = info.getValue()
        return val ? new Date(val).toLocaleString() : "Never"
      },
    }),
    columnHelper.accessor("expiresAt", {
      header: "Expires At",
      cell: (info) => {
        const val = info.getValue()
        return val ? new Date(val).toLocaleString() : "Never"
      },
    }),
    columnHelper.accessor("value", {
      header: "Key",
      cell: (info) => (
        <code className="api-key-masked">
          {`••••••••••••••••••••••••${info.getValue().slice(-4)}`}
        </code>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: (info) => (
        <button
          onClick={() => handleRevoke(info.row.original.id)}
          className="btn-revoke"
        >
          Revoke
        </button>
      ),
    }),
  ], [])

  const table = useReactTable({
    data: apiKeys,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="api-key-table-container">
      <table className="api-key-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="api-key-table-header">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="api-key-table-th">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="api-key-row">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="api-key-td">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {apiKeys.length === 0 && (
        <div className="api-key-table-empty">
          No API keys found. Create one to get started.
        </div>
      )}
    </div>
  )
}
