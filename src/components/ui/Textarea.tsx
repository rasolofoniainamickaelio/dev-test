import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { CONTROL_CLASSES } from './Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = '', ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${CONTROL_CLASSES} min-h-24 resize-y py-2 leading-relaxed ${className}`}
      {...props}
    />
  );
});
