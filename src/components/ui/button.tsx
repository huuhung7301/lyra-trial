import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'icon'
}

export function Button({
  className = "",
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variantClasses = variant === 'default' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
    : 'hover:bg-accent hover:text-accent-foreground'
  
  const sizeClasses = size === 'default' ? 'h-10 px-4' : 'h-9 w-9'
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`

  return (
    <button
      className={combinedClasses}
      {...props}
    />
  )
}

