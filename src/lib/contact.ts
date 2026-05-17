export const businessEmail = 'skysthelimitpainting1779@gmail.com';
export const businessPhone = '651-410-4196';

export function openEstimateEmail(fields: Record<string, string>) {
  const body = Object.entries(fields)
    .filter(([, value]) => value.trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  const subject = "Estimate request - Sky's the Limit Painting LLC";
  window.location.href = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
