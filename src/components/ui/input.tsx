import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  const baseClasses = "flex w-full bg-transparent"
  
  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props}
    />
  )
}

