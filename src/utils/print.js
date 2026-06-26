import { getSettings } from './storage'

function generateBillNumber() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${dd}${mm}-${hh}${min}`
}

function formatBillDate() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(2)
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yy} ${hh}:${min}`
}

export function printBill(records, type, hasDiscount) {
  const settings = getSettings()
  const printWindow = window.open('', '_blank', 'width=400,height=600')
  
  const showDiscount = type === 'calculator' && hasDiscount
  const billNo = generateBillNumber()
  const billDate = formatBillDate()
  
  const colFontSize = settings.columnFontSize || 13
  const bodyFontSize = settings.bodyFontSize || 15
  
  let tableHeaders = ''
  let tableRows = ''
  let totalColSpan = 1
  
  if (type === 'calculator') {
    totalColSpan = showDiscount ? 5 : 4
    tableHeaders = `<tr>
      <th class="col-sno">#</th>
      <th class="col-price">Price</th>
      <th class="col-qty">Qty</th>
      ${showDiscount ? `<th class="col-dis">Dis%</th>` : ''}
      <th class="col-total">Total</th>
    </tr>`
    
    tableRows = records.map((r, i) => `<tr>
      <td class="col-sno">${i + 1}</td>
      <td>${r.price}</td>
      <td>${r.qty}</td>
      ${showDiscount ? `<td>${r.discount || ''}</td>` : ''}
      <td>${r.total.toFixed(2)}</td>
    </tr>`).join('')
  } else {
    totalColSpan = 2
    tableHeaders = `<tr>
      <th class="col-sno">#</th>
      <th>Price</th>
    </tr>`
    
    tableRows = records.map((r, i) => `<tr>
      <td class="col-sno">${i + 1}</td>
      <td>${r.price}</td>
    </tr>`).join('')
  }
  
  const grandTotal = records.reduce((sum, r) => sum + (r.total || r.price), 0)
  
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Bill - ${settings.shopName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      padding: 2px;
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
      font-size: ${colFontSize - 3}px;
      font-weight: 600;
      margin: 2px 0;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
    }
    .divider {
      border: none;
      border-top: 1px dashed #000;
      margin: 4px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000;
    }
    th {
      font-size: ${colFontSize}px;
      font-weight: 900;
      padding: 3px 1px;
      text-align: center;
      border: 1px solid #000;
      white-space: nowrap;
    }
    td {
      font-size: ${bodyFontSize}px;
      font-weight: 700;
      padding: 2px 1px;
      text-align: center;
      border: 1px solid #000;
      white-space: nowrap;
    }
    .col-sno { width: 16px; }
    .col-price { }
    .col-qty { width: 28px; }
    .col-dis { width: 32px; }
    .col-total { }
    .total-row td {
      border: 1px solid #000;
      font-weight: 900;
      font-size: ${bodyFontSize + 2}px;
      padding: 4px 2px;
      text-align: center;
    }
    .bill-footer {
      text-align: center;
      font-size: ${colFontSize - 1}px;
      font-weight: 600;
      margin-top: 8px;
    }
    @media print {
      @page {
        margin: 0;
        size: 80mm auto;
      }
      body {
        padding: 2px;
      }
    }
  </style>
</head>
<body>
  <p class="shop-name">${settings.shopName}</p>
  ${settings.shopAddress ? `<p class="shop-address">${settings.shopAddress}</p>` : ''}
  <hr class="divider"/>
  <div class="bill-info">
    <span>Bill#:${billNo}</span>
    <span>${billDate}</span>
  </div>
  <hr class="divider"/>
  <table>
    <thead>${tableHeaders}</thead>
    <tbody>${tableRows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="${totalColSpan}">Total: ${grandTotal.toFixed(2)}</td>
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
