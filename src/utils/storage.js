const SETTINGS_KEY = 'pos_calculator_settings'
const BILLS_KEY = 'pos_calculator_bills'

export function getSettings() {
  const defaults = {
    shopName: 'My Stationary Store',
    shopAddress: '',
    columnFontSize: 13,
    bodyFontSize: 15,
    showDiscount: true,
  }
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return { ...defaults, ...JSON.parse(stored) }
  } catch {}
  return defaults
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getBills() {
  try {
    const stored = localStorage.getItem(BILLS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

export function saveBill(bill) {
  const bills = getBills()
  bills.unshift(bill)
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills))
}

export function deleteBill(id) {
  const bills = getBills().filter(b => b.id !== id)
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills))
}
