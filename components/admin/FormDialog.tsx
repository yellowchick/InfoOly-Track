'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type FieldType = 'input' | 'select' | 'textarea' | 'number'

export interface FormField {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string | number | boolean
  rows?: number
}

interface FormDialogProps {
  title: string
  fields: FormField[]
  initialValues?: Record<string, string | number | boolean>
  onSubmit: (values: Record<string, string | number | boolean>) => void
  onCancel: () => void
}

export default function FormDialog({
  title,
  fields,
  initialValues,
  onSubmit,
  onCancel,
}: FormDialogProps) {
  const [values, setValues] = React.useState<Record<string, string | number | boolean>>(() => {
    const defaults: Record<string, string | number | boolean> = {}
    for (const field of fields) {
      defaults[field.name] = initialValues?.[field.name] ?? field.defaultValue ?? (field.type === 'number' ? 0 : '')
    }
    return defaults
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  const handleChange = (name: string, value: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] rounded-xl border border-border bg-card shadow-lg animate-fade-in">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-muted hover:bg-muted/50 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="ml-1 text-danger">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                    required={field.required}
                  >
                    <option value="">请选择</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows || 3}
                    className={cn(
                      'flex w-full rounded-md border border-border bg-card px-3 py-2 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                    required={field.required}
                  />
                ) : field.type === 'number' ? (
                  <Input
                    type="number"
                    value={values[field.name] as number | string}
                    onChange={(e) => handleChange(field.name, Number(e.target.value))}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : (
                  <Input
                    type="text"
                    value={String(values[field.name] ?? '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
