'use client'

import React from 'react'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export default function Loading() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 z-50">
      {/* Header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 p-4 overflow-auto">
          {/* Table header */}
          <div className="flex mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1 mr-2" />
            ))}
          </div>

          {/* Table rows */}
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex mb-2">
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-10 flex-1 mr-2" />
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
