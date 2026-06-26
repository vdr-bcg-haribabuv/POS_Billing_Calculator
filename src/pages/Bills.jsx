import { useState, useEffect } from 'react'
import { getBills, deleteBill } from '../utils/storage'
import { printBill } from '../utils/print'

function Bills() {
  const [bills, setBills] = useState([])
  const [viewBill, setViewBill] = useState(null)
  
  useEffect(() => {
    setBills(getBills())
  }, [])
  
  const handleDelete = (id) => {
    deleteBill(id)
    setBills(getBills())
    if (viewBill?.id === id) setViewBill(null)
  }
  
  const handleView = (bill) => {
    setViewBill(bill)
  }
  
  const handlePrintBill = (bill) => {
    printBill(bill.records, bill.type, bill.hasDiscount)
  }
  
  if (viewBill) {
    const hasDiscount = viewBill.type === 'calculator' && viewBill.hasDiscount
    return (
      <div>
        <h2 className="page-title">Bill Details</h2>
        <button className="btn btn-view" onClick={() => setViewBill(null)} style={{ marginBottom: 16 }}>
          ← Back to Bills
        </button>
        
        <table className="records-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Price</th>
              {viewBill.type === 'calculator' && <th>Qty</th>}
              {hasDiscount && <th>Dis%</th>}
              {viewBill.type === 'calculator' && <th>Total</th>}
            </tr>
          </thead>
          <tbody>
            {viewBill.records.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.price}</td>
                {viewBill.type === 'calculator' && <td>{r.qty}</td>}
                {hasDiscount && <td>{r.discount || ''}</td>}
                {viewBill.type === 'calculator' && <td>{r.total.toFixed(2)}</td>}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan={viewBill.type === 'calculator' ? (hasDiscount ? 4 : 3) : 1}>Total</td>
              <td>{viewBill.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div className="actions-bar">
          <button className="btn btn-print" onClick={() => handlePrintBill(viewBill)}>Print</button>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="page-title">Saved Bills</h2>
      {bills.length === 0 ? (
        <p style={{ color: '#777', marginTop: 20 }}>No bills saved yet.</p>
      ) : (
        <div className="bills-list">
          {bills.map(bill => (
            <div key={bill.id} className="bill-card">
              <div className="bill-card-info">
                <span className="bill-type">
                  {bill.type === 'calculator' ? '🧮 Calculator' : '➕ Addition'}
                </span>
                <span className="bill-date">{new Date(bill.date).toLocaleString()}</span>
                <span className="bill-total">₹{bill.total.toFixed(2)}</span>
              </div>
              <div className="bill-card-actions">
                <button className="btn btn-view" onClick={() => handleView(bill)}>View</button>
                <button className="btn btn-print" onClick={() => handlePrintBill(bill)}>Print</button>
                <button className="btn btn-delete-bill" onClick={() => handleDelete(bill.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bills
