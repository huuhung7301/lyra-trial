import * as React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const baseClasses = "flex w-full bg-transparent";

  return (
    <input className={`${baseClasses} ${className}`} {...props} />
  );
}
