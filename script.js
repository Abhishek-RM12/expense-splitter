let expenses = {};

document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let name = document.getElementById('name').value.trim();
  let amount = parseFloat(document.getElementById('amount').value);

  if (!name || isNaN(amount)) return;

  if (expenses[name]) {
    expenses[name] += amount;
  } else {
    expenses[name] = amount;
  }

  let people = Object.keys(expenses);
  let total = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  let perPerson = total / people.length;

  let output = '';
  people.forEach(person => {
    output += `${person} paid ₹${expenses[person].toFixed(2)}<br>`;
  });

  output += `<br><strong>Total: ₹${total.toFixed(2)}</strong><br>`;
  output += `<strong>Each should pay: ₹${perPerson.toFixed(2)}</strong><br><br>`;

  people.forEach(person => {
    let diff = (expenses[person] - perPerson).toFixed(2);
    if (diff > 0) {
      output += `${person} should receive ₹${diff}<br>`;
    } else if (diff < 0) {
      output += `${person} should pay ₹${Math.abs(diff)}<br>`;
    } else {
      output += `${person} is settled<br>`;
    }
  });

  document.getElementById('output').innerHTML = output;
  this.reset();
});
