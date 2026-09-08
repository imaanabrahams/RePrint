export function formatRand(value) {
  if (value === null || value === undefined) return '—'
  return 'R' + Number(value).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
