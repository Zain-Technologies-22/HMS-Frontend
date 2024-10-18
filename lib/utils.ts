type ClassValue = string | undefined | null | false;

/**
 * Utility function to conditionally join class names.
 * Example: cn('class1', isActive && 'active', 'class3')
 * Output: 'class1 active class3' (if `isActive` is true)
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
