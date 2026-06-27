import { useState, useRef, useEffect, useCallback } from 'react'
import { saveBill, getSettings } from '../utils/storage'
import { printBill, generateBillNumber, formatBillDate } from '../utils/print'

function Calculator() {
  const [records, setRecords] = useState([])
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')
  const [discount, setDiscount] = useState('')
  const [total, setTotal] = useState('')
  
  const priceRef = useRef()
  const qtyRef = useRef()
  const discountRef = useRef()
  const totalRef = useRef()
  
  const settings = getSettings()
  const discountEnabled = settings.showDiscount !== false
  
  useEffect(() => {
    priceRef.current?.focus()
  }, [])
  
  useEffect(() => {
    const p = parseFloat(price) || 0
    const q = parseFloat(qty) || 1
    const d = parseFloat(discount) || 0
    const t = p * q * (1 - d / 100)
    setTotal(p > 0 ? t.toFixed(2) : '')
  }, [price, qty, discount])
  
  const hasDiscount = discountEnabled && records.some(r => r.discount)
  
  const addRecord = useCallback(() => {
    const p = parseFloat(price)
    if (!p || p <= 0) return
    const q = parseFloat(qty) || 1
    const d = parseFloat(discount) || 0
    const t = p * q * (1 - d / 100)
    
    setRecords(prev => [...prev, {
      price: p,
      qty: q,
      discount: d > 0 ? d : null,
      total: t
    }])
    
    setPrice('')
    setQty('1')
    setDiscount('')
    setTotal('')
    priceRef.current?.focus()
  }, [price, qty, discount])
  
  const deleteRecord = (index) => {
    setRecords(prev => prev.filter((_, i) => i !== index))
  }
  
  const handlePrint = useCallback(() => {
    if (records.length === 0) return
    const bill = {
      id: Date.now(),
      type: 'calculator',
      date: new Date().toISOString(),
      billNo: generateBillNumber(),
      records: [...records],
      total: records.reduce((s, r) => s + r.total, 0),
      hasDiscount
    }
    saveBill(bill)
    printBill(records, 'calculator', hasDiscount)
    setRecords([])
    setPrice('')
    setQty('1')
    setDiscount('')
    setTotal('')
    setTimeout(() => priceRef.current?.focus(), 100)
  }, [records, hasDiscount])
  
  const handleClear = () => {
    setRecords([])
    setPrice('')
    setQty('1')
    setDiscount('')
    priceRef.current?.focus()
  }
  
  // Space key for print
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handlePrint()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handlePrint])
  
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (nextRef) {
        nextRef.current?.focus()
        nextRef.current?.select()
      } else {
        addRecord()
      }
    }
  }
  
  const grandTotal = records.reduce((s, r) => s + r.total, 0)
  
  const currentBillNo = generateBillNumber()
  const currentBillDate = formatBillDate()

  return (
    <div className="calculator-wrapper">
      <h2 className="page-title">Calculator</h2>
      <div className="bill-meta">
        <span>Bill#: {currentBillNo}</span>
        <span>Date: {currentBillDate}</span>
      </div>
      <div className="calc-form">
        <div className="calc-field price">
          <label>Price (₹)</label>
          <input
            ref={priceRef}
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            onKeyDown={e => handleKeyDown(e, qtyRef)}
            placeholder="0"
            step="any"
          />
        </div>
        <div className="calc-field">
          <label>Qty</label>
          <input
            ref={qtyRef}
            type="number"
            value={qty}
            onChange={e => setQty(e.target.value)}
            onKeyDown={e => handleKeyDown(e, discountEnabled ? discountRef : null)}
            onFocus={e => e.target.select()}
            min="1"
          />
        </div>
        {discountEnabled && (
        <div className="calc-field">
          <label>Dis (%)</label>
          <input
            ref={discountRef}
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
            onKeyDown={e => handleKeyDown(e, null)}
            placeholder=""
            min="0"
            max="100"
          />
        </div>
        )}
        <div className="calc-field total">
          <label>Total</label>
          <input
            ref={totalRef}
            type="text"
            value={total}
            readOnly
            tabIndex={-1}
          />
        </div>
        <button className="btn-add" onClick={addRecord}>Add</button>
      </div>
      
      <p className="hint-text">Press Enter to move between fields and add row. Press Space (outside inputs) to save & print.</p>
      
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
                <th>Qty</th>
                {hasDiscount && <th>Dis%</th>}
                <th>Total</th>
                <th className="no-print"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.price}</td>
                  <td>{r.qty}</td>
                  {hasDiscount && <td>{r.discount || ''}</td>}
                  <td>{r.total.toFixed(2)}</td>
                  <td className="no-print">
                    <button className="delete-btn" onClick={() => deleteRecord(i)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={hasDiscount ? 4 : 3}>Grand Total</td>
                <td>{grandTotal.toFixed(2)}</td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>
          
          <div className="actions-bar">
            <button className="btn btn-print" onClick={handlePrint}>Print</button>
            <button className="btn btn-clear" onClick={handleClear}>Clear</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Calculator
