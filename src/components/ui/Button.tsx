import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-ardoise text-white hover:bg-ardoise/90 disabled:bg-ardoise-clair',
  accent: 'bg-ambre text-ardoise hover:bg-ambre/90',
  secondary: 'border border-filet bg-white text-ardoise hover:bg-fond-alt',
  danger: 'border border-rouge-signal bg-white text-rouge-signal hover:bg-rouge-clair',
  ghost: 'text-ardoise-clair hover:text-ardoise underline underline-offset-4',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[--radius-action] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}