'use client'

import React from 'react'

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export default function Loading() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center px-4">
        <Skeleton className="h-8 w-32" />
        <div className="ml-auto flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 overflow-auto">
          {/* Table header */}
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1 mr-2" />
            ))}
          </div>

          {/* Table rows */}
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex mb-2">
              {[...Array(5)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-10 flex-1 mr-2" />
              ))}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

