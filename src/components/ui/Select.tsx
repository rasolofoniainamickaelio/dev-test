import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { CONTROL_CLASSES } from './Input';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...props }, ref) {
    return (
      <select ref={ref} className={`${CONTROL_CLASSES} ${className}`} {...props}>
        {children}
      </select>
    );
  },
);
