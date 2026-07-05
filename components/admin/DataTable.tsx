'use client'

import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  title: string
  render?: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  keyExtractor: (item: T) => string
}

export default function DataTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-muted',
                    col.width
                  )}
                >
                  {col.title}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right font-medium text-muted">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="border-b border-border transition-colors hover:bg-muted/50"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                          className="h-8 w-8 p-0 text-danger hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="space-y-2">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between gap-2">
                  <span className="text-sm text-muted">{col.title}</span>
                  <span className="text-sm font-medium">
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </span>
                </div>
              ))}
            </div>
            {(onEdit || onDelete) && (
              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    编辑
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
