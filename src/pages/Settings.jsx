import { useState, useEffect } from 'react'
import { getSettings, saveSettings } from '../utils/storage'

function Settings() {
  const [settings, setSettings] = useState(getSettings())
  const [saved, setSaved] = useState(false)
  
  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }
  
  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  
  return (
    <div className="settings-form">
      <h2>Settings</h2>
      
      <div className="settings-group">
        <h3>Shop Information</h3>
        <div className="settings-field">
          <label>Shop Name</label>
          <input
            type="text"
            value={settings.shopName}
            onChange={e => handleChange('shopName', e.target.value)}
          />
        </div>
        <div className="settings-field">
          <label>Shop Address</label>
          <input
            type="text"
            value={settings.shopAddress}
            onChange={e => handleChange('shopAddress', e.target.value)}
          />
        </div>
      </div>
      
      <div className="settings-group">
        <h3>Calculator Configuration</h3>
        <div className="settings-field checkbox-field">
          <label>
            <input
              type="checkbox"
              checked={settings.showDiscount}
              onChange={e => handleChange('showDiscount', e.target.checked)}
            />
            {' '}Show Discount (%) column in Calculator
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h3>Bill Print Configuration</h3>
        <div className="settings-field">
          <label>Column Headers Font Size (px)</label>
          <input
            type="number"
            value={settings.columnFontSize}
            onChange={e => handleChange('columnFontSize', parseInt(e.target.value) || 12)}
            min="8"
            max="24"
          />
        </div>
        <div className="settings-field">
          <label>Body Values Font Size (px)</label>
          <input
            type="number"
            value={settings.bodyFontSize}
            onChange={e => handleChange('bodyFontSize', parseInt(e.target.value) || 14)}
            min="8"
            max="24"
          />
        </div>
      </div>
      
      <button className="btn-settings-save" onClick={handleSave}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}

export default Settings
