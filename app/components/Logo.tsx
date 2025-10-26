interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: { text: 'text-sm', dot: 'text-xs' },
    md: { text: 'text-xl', dot: 'text-sm' },
    lg: { text: 'text-2xl', dot: 'text-base' },
    xl: { text: 'text-3xl', dot: 'text-lg' },
  };

  const { text, dot } = sizeClasses[size];

  return (
    <span className={`${text} font-bold ${className}`}>
      J<span className={`text-purple-600 dark:text-purple-400 ${dot} inline-block align-middle`}>●</span>urney
    </span>
  );
}
