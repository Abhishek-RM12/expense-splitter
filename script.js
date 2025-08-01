let expenses = [];

document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let name = document.getElementById('name').value;
  let amount = parseFloat(document.getElementById('amount').value);

  expenses.push({ name, amount });

  let total = expenses.reduce((sum, item) => sum + item.amount, 0);
  let perPerson = total / expenses.length;

  let output = expenses.map(e => `${e.name} paid ₹${e.amount.toFixed(2)}<br>`).join('');
  output += `<br><strong>Total: ₹${total.toFixed(2)}</strong><br>`;
  output += `<strong>Each should pay: ₹${perPerson.toFixed(2)}</strong>`;

  document.getElementById('output').innerHTML = output;

  this.reset();
});
