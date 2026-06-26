import { useState, useRef, useEffect, useCallback } from 'react'
import { saveBill, getSettings } from '../utils/storage'
import { printBill } from '../utils/print'

function Addition() {
  const [records, setRecords] = useState([])
  const [price, setPrice] = useState('')
  
  const priceRef = useRef()
  const settings = getSettings()
  
  useEffect(() => {
    priceRef.current?.focus()
  }, [])
  
  const addRecord = useCallback(() => {
    const p = parseFloat(price)
    if (!p || p <= 0) return
    
    setRecords(prev => [...prev, { price: p, total: p }])
    setPrice('')
    priceRef.current?.focus()
  }, [price])
  
  const deleteRecord = (index) => {
    setRecords(prev => prev.filter((_, i) => i !== index))
  }
  
  const handlePrint = useCallback(() => {
    if (records.length === 0) return
    printBill(records, 'addition', false)
  }, [records])
  
  const handleSaveAndPrint = useCallback(() => {
    if (records.length === 0) return
    const bill = {
      id: Date.now(),
      type: 'addition',
      date: new Date().toISOString(),
      records: [...records],
      total: records.reduce((s, r) => s + r.price, 0),
      hasDiscount: false
    }
    saveBill(bill)
    printBill(records, 'addition', false)
    setRecords([])
  }, [records])
  
  const handleClear = () => {
    setRecords([])
    setPrice('')
    priceRef.current?.focus()
  }
  
  // Space key for print
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault()
        handleSaveAndPrint()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSaveAndPrint])
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRecord()
    }
  }
  
  const grandTotal = records.reduce((s, r) => s + r.price, 0)
  
  return (
    <div>
      <h2 className="page-title">Addition</h2>
      <div className="calc-form">
        <div className="calc-field addition-field">
          <label>Price (₹)</label>
          <input
            ref={priceRef}
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            step="any"
          />
        </div>
        <button className="btn-add" onClick={addRecord}>Add</button>
      </div>
      
      <p className="hint-text">Type price and press Enter to add. Press Space (outside input) to save & print.</p>
      
      {records.length > 0 && (
        <>
          <div className="print-header">
            <h2>{settings.shopName}</h2>
            {settings.shopAddress && <p>{settings.shopAddress}</p>}
          </div>
          <table className="records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Price</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.price}</td>
                  <td className="no-print">
                    <button className="delete-btn" onClick={() => deleteRecord(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td>Total</td>
                <td>{grandTotal.toFixed(2)}</td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>
          
          <div className="actions-bar">
            <button className="btn btn-print" onClick={handlePrint}>Print</button>
            <button className="btn btn-save" onClick={handleSaveAndPrint}>Save & Print</button>
            <button className="btn btn-clear" onClick={handleClear}>Clear</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Addition
