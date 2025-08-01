const participants = [];
const expenses = [];

const participantForm = document.getElementById('participantForm');
const participantName = document.getElementById('participantName');
const participantsList = document.getElementById('participantsList');
const payerSelect = document.getElementById('payer');
const resetAllBtn = document.getElementById('resetAll');

const expenseForm = document.getElementById('expenseForm');
const amountInput = document.getElementById('amount');
const descInput = document.getElementById('desc');
const expensesTableBody = document.querySelector('#expensesTable tbody');
const totalAmountEl = document.getElementById('totalAmount');

const computeBtn = document.getElementById('compute');
const balancesTableBody = document.querySelector('#balancesTable tbody');
const transfersList = document.getElementById('transfers');

const currency = n => Number(n).toFixed(2);

function renderParticipants() {
  participantsList.innerHTML = '';
  payerSelect.innerHTML = '<option value="" disabled selected>Select payer</option>';
  participants.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = p;
    participantsList.appendChild(li);

    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    payerSelect.appendChild(opt);
  });
}

function renderExpenses() {
  expensesTableBody.innerHTML = '';
  let total = 0;
  expenses.forEach((e, i) => {
    total += e.amount;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${e.payer}</td>
      <td class="right">${currency(e.amount)}</td>
      <td>${e.desc || ''}</td>
      <td><button data-index="${i}" class="delete-expense">✕</button></td>
    `;
    expensesTableBody.appendChild(tr);
  });
  totalAmountEl.textContent = currency(total);

  document.querySelectorAll('.delete-expense').forEach(btn => {
    btn.onclick = (e) => {
      const i = +e.target.dataset.index;
      expenses.splice(i,1);
      renderExpenses();
    };
  });
}

function computeSettlement() {
  if (participants.length === 0) {
    alert('Add participants first');
    return;
  }
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const share = total / participants.length;

  const paidMap = {};
  participants.forEach(p => paidMap[p] = 0);
  expenses.forEach(e => paidMap[e.payer] += e.amount);

  const netMap = {};
  participants.forEach(p => netMap[p] = +(paidMap[p] - share).toFixed(2));

  balancesTableBody.innerHTML = '';
  participants.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p}</td>
      <td class="right">${currency(paidMap[p])}</td>
      <td class="right">${currency(share)}</td>
      <td class="right">${currency(netMap[p])}</td>
    `;
    balancesTableBody.appendChild(tr);
  });

  const debtors = [];
  const creditors = [];
  for (const [name, net] of Object.entries(netMap)) {
    if (net < -0.009) debtors.push({name, amt: -net});
    else if (net > 0.009) creditors.push({name, amt: net});
  }

  debtors.sort((a,b)=>a.amt-b.amt);
  creditors.sort((a,b)=>b.amt-a.amt);

  const txns = [];
  let i=0, j=0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    txns.push({from: debtors[i].name, to: creditors[j].name, amount: pay});
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (Math.abs(debtors[i].amt) < 0.01) i++;
    if (Math.abs(creditors[j].amt) < 0.01) j++;
  }

  transfersList.innerHTML = '';
  if (txns.length === 0) {
    transfersList.innerHTML = '<li>All settled 🎉</li>';
  } else {
    txns.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.from} → ${t.to}: ₹${currency(t.amount)}`;
      transfersList.appendChild(li);
    });
  }
}

participantForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = participantName.value.trim();
  if (!name) return;
  if (participants.includes(name)) {
    alert('Name already added.');
    return;
  }
  participants.push(name);
  participantName.value = '';
  renderParticipants();
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const payer = payerSelect.value;
  const amount = parseFloat(amountInput.value);
  const desc = descInput.value.trim();
  if (!payer || isNaN(amount) || amount <= 0) return;
  expenses.push({ payer, amount, desc });
  amountInput.value = '';
  descInput.value = '';
  renderExpenses();
});

computeBtn.addEventListener('click', computeSettlement);

resetAllBtn.addEventListener('click', () => {
  if (!confirm('This will clear all participants and expenses. Continue?')) return;
  participants.splice(0);
  expenses.splice(0);
  renderParticipants();
  renderExpenses();
  balancesTableBody.innerHTML = '';
  transfersList.innerHTML = '';
  totalAmountEl.textContent = '0.00';
});

renderParticipants();
renderExpenses();
