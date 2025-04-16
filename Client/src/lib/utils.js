
/**
 * Combines CSS class names
 * @param  {...string} classes - CSS class names to combine
 * @returns {string} - Combined CSS class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  