"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, Link, Type, FileText, FileIcon, Sparkles, ChevronRight, HelpCircle, Plus, X } from 'lucide-react'

interface AddColumnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (name: string, type: string) => void
}

const fieldTypes = [
  { id: 'link', name: 'Link to another record', icon: Link },
  { id: 'text', name: 'Single line text', icon: Type },
  { id: 'longtext', name: 'Long text', icon: FileText },
  { id: 'attachment', name: 'Attachment', icon: FileIcon },
  { id: 'ai', name: 'AI', icon: Sparkles, badge: 'Team' },
]

export function AddColumnModal({ open, onOpenChange, onAddColumn }: AddColumnModalProps) {
  const [fieldName, setFieldName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredTypes = fieldTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddColumn = () => {
    if (selectedType) {
      onAddColumn(fieldName || `New Column ${Date.now()}`, selectedType)
      onOpenChange(false)
      setFieldName("")
      setSelectedType(null)
      setSearchQuery("")
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed top-[25%] left-[65%] w-[33%] bg-transparent flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg border w-full max-w-md">
        <div className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Field name (optional)"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find a field type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <HelpCircle className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="max-h-[300px] overflow-y-auto rounded-md border border-gray-200">
              {filteredTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors ${
                    selectedType === type.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <type.icon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {type.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                        {type.badge}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => onOpenChange(false)}
              >
                <Plus className="h-4 w-4" />
                Add description
              </button>
              <div className="space-x-2">
                <button 
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`px-3 py-1 text-sm text-white rounded-md ${
                    selectedType ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  onClick={handleAddColumn} 
                  disabled={!selectedType}
                >
                  Add column
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
