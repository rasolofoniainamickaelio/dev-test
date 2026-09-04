import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export const CONTROL_CLASSES =
  'min-h-11 w-full rounded-[--radius-action] border border-filet bg-white px-3 text-base text-ardoise placeholder:text-ardoise-clair/70 aria-[invalid=true]:border-rouge-signal';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`${CONTROL_CLASSES} ${className}`} {...props} />;
  },
);
