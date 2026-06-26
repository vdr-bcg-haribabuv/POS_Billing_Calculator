import { getSettings } from './storage'

function generateBillNumber() {
  const now = new Date()
  const date = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const time = String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  return date + time
}

export function printBill(records, type, hasDiscount) {
  const settings = getSettings()
  const printWindow = window.open('', '_blank', 'width=400,height=600')
  
  const showDiscount = type === 'calculator' && hasDiscount
  const billNo = generateBillNumber()
  const billDate = new Date().toLocaleString()
  
  const colFontSize = settings.columnFontSize || 13
  const bodyFontSize = settings.bodyFontSize || 15
  
  let tableHeaders = ''
  let tableRows = ''
  
  if (type === 'calculator') {
    tableHeaders = `<tr>
      <th>#</th>
      <th>Price</th>
      <th>Qty</th>
      ${showDiscount ? `<th>Dis%</th>` : ''}
      <th>Total</th>
    </tr>`
    
    tableRows = records.map((r, i) => `<tr>
      <td>${i + 1}</td>
      <td>${r.price}</td>
      <td>${r.qty}</td>
      ${showDiscount ? `<td>${r.discount || ''}</td>` : ''}
      <td>${r.total.toFixed(2)}</td>
    </tr>`).join('')
  } else {
    tableHeaders = `<tr>
      <th>#</th>
      <th>Price</th>
    </tr>`
    
    tableRows = records.map((r, i) => `<tr>
      <td>${i + 1}</td>
      <td>${r.price}</td>
    </tr>`).join('')
  }
  
  const grandTotal = records.reduce((sum, r) => sum + (r.total || r.price), 0)
  const colSpan = type === 'calculator' ? (showDiscount ? 4 : 3) : 1
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Bill - ${settings.shopName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      padding: 8px;
      width: 100%;
      max-width: 80mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
    }
    .shop-name {
      text-align: center;
      font-size: ${colFontSize + 4}px;
      font-weight: 900;
      margin-bottom: 2px;
      word-wrap: break-word;
    }
    .shop-address {
      text-align: center;
      font-size: ${colFontSize}px;
      font-weight: 600;
      margin-bottom: 6px;
      word-wrap: break-word;
    }
    .bill-info {
      font-size: ${colFontSize}px;
      font-weight: 700;
      margin: 4px 0;
      display: flex;
      justify-content: space-between;
    }
    .divider {
      border: none;
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      border: 1px solid #000;
    }
    th {
      font-size: ${colFontSize}px;
      font-weight: 900;
      padding: 4px 2px;
      text-align: right;
      border: 1px solid #000;
      white-space: nowrap;
      overflow: hidden;
    }
    td {
      font-size: ${bodyFontSize}px;
      font-weight: 700;
      padding: 3px 2px;
      text-align: right;
      border: 1px solid #000;
      word-wrap: break-word;
      overflow: hidden;
    }
    th:first-child, td:first-child {
      text-align: center;
      width: 24px;
    }
    .total-row td {
      border: 1px solid #000;
      font-weight: 900;
      font-size: ${bodyFontSize + 3}px;
      padding-top: 6px;
    }
    .bill-footer {
      text-align: center;
      font-size: ${colFontSize - 1}px;
      font-weight: 600;
      margin-top: 10px;
    }
    @media print {
      @page {
        margin: 0;
        size: 80mm auto;
      }
      body {
        padding: 4px;
      }
    }
  </style>
</head>
<body>
  <p class="shop-name">${settings.shopName}</p>
  ${settings.shopAddress ? `<p class="shop-address">${settings.shopAddress}</p>` : ''}
  <hr class="divider"/>
  <div class="bill-info">
    <span>Bill#: ${billNo}</span>
  </div>
  <div class="bill-info">
    <span>Date: ${billDate}</span>
  </div>
  <hr class="divider"/>
  <table>
    <thead>${tableHeaders}</thead>
    <tbody>${tableRows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="${colSpan}">TOTAL</td>
        <td>${grandTotal.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>
  <hr class="divider"/>
  <p class="bill-footer">Thank You! Visit Again</p>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`
  
  printWindow.document.write(html)
  printWindow.document.close()
}
