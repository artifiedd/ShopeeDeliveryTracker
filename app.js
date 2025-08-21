const tableBody = document.querySelector('#deliveryTable tbody');
const updateBtn = document.getElementById('updateBtn');

const storageKey = 'shopeeItems';
let items = JSON.parse(localStorage.getItem(storageKey)) || [];

function renderTable() {
  tableBody.innerHTML = '';
  items.forEach((item, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.account}</td>
      <td>${item.name}</td>
      <td>${item.orderId}</td>
      <td>
        <select class="statusSelect" data-index="${index}">
          <option value="" disabled ${!item.status ? 'selected' : ''}>Status</option>
          <option value="In Transit" ${item.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
          <option value="Delivered" ${item.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
        ${item.status==='Delivered'?'<span style="color:white;background-color:green;padding:4px 10px;border-radius:6px;margin-left:5px;font-size:16px;display:inline-block;">✔</span>':item.status==='In Transit'?'<span style="margin-left:5px;font-size:18px;display:inline-block;">🛻</span>':''}
      </td>
      <td>
        <select class="estimatedSelect" data-index="${index}">
          <option value="" disabled ${!item.estimated ? 'selected' : ''}>Dah Ambil ke?</option>
          <option value="Yes" ${item.estimated === 'Yes' ? 'selected' : ''}>Yes</option>
          <option value="No" ${item.estimated === 'No' ? 'selected' : ''}>No</option>
        </select>
        ${item.estimated==='Yes'?'<span style="color:white;background-color:green;padding:4px 10px;border-radius:6px;margin-left:5px;font-size:16px;display:inline-block;">✔</span>':item.estimated==='No'?'<span style="color:white;background-color:red;padding:4px 10px;border-radius:6px;margin-left:5px;font-size:16px;display:inline-block;">❌</span>':''}
      </td>
      <td>${item.lastUpdated}</td>
      <td><button class="deleteBtn" data-index="${index}">Delete</button></td>
    `;

    tableBody.appendChild(row);

    if(item.justUpdated){
      row.classList.add('highlight');
      setTimeout(() => row.classList.remove('highlight'), 1000);
      delete item.justUpdated;
    }
  });

  // Event listeners
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-index');
      items.splice(idx, 1);
      localStorage.setItem(storageKey, JSON.stringify(items));
      renderTable();
    });
  });

  document.querySelectorAll('.statusSelect').forEach(sel => {
    sel.addEventListener('change', e => {
      const idx = e.target.getAttribute('data-index');
      items[idx].status = e.target.value;
      items[idx].lastUpdated = new Date().toLocaleString();
      items[idx].justUpdated = true;
      localStorage.setItem(storageKey, JSON.stringify(items));
      renderTable();
    });
  });

  document.querySelectorAll('.estimatedSelect').forEach(sel => {
    sel.addEventListener('change', e => {
      const idx = e.target.getAttribute('data-index');
      items[idx].estimated = e.target.value;
      items[idx].lastUpdated = new Date().toLocaleString();
      items[idx].justUpdated = true;
      localStorage.setItem(storageKey, JSON.stringify(items));
      renderTable();
    });
  });
}

updateBtn.addEventListener('click', () => {
  const account = document.getElementById('account').value;
  const name = document.getElementById('item').value;
  const orderId = document.getElementById('orderId').value;
  const status = document.getElementById('status').value;
  const estimated = document.getElementById('estimated').value;

  if (!account || !name || !orderId || !status || !estimated) {
    alert('Please fill out all fields!');
    return;
  }

  const lastUpdated = new Date().toLocaleString();
  const index = items.findIndex(i => i.orderId === orderId);

  if(index >= 0){
    items[index] = { account, name, orderId, status, estimated, lastUpdated, justUpdated:true };
  } else {
    items.push({ account, name, orderId, status, estimated, lastUpdated, justUpdated:true });
  }

  localStorage.setItem(storageKey, JSON.stringify(items));
  renderTable();

  // Clear form
  document.getElementById('account').value = '';
  document.getElementById('item').value = '';
  document.getElementById('orderId').value = '';
  document.getElementById('status').value = '';
  document.getElementById('estimated').value = '';
});

renderTable();
