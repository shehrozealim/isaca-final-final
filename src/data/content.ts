import data from './site-content.json'
/** Edit site-content.json to change every public heading, label, fact and printed note. */
export const siteContent = data
export const copy = (key: string): string => (siteContent.copy as Record<string, string>)[key] ?? key
export const formatCopy = (key: string, values: Record<string, string | number>) => copy(key).replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? ''))
