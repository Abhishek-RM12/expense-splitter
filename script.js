let members = [];

function addMember() {
  const nameInput = document.getElementById('memberName');
  const name = nameInput.value.trim();

  if (name && !members.includes(name)) {
    members.push(name);

    const li = document.createElement('li');
    li.textContent = name;
    document.getElementById('memberList').appendChild(li);

    nameInput.value = '';
  }
}

function splitAmount() {
  const totalAmount = parseFloat(document.getElementById('totalAmount').value);
  const outputDiv = document.getElementById('output');

  if (isNaN(totalAmount) || totalAmount <= 0) {
    outputDiv.innerHTML = 'Please enter a valid total amount.';
    return;
  }

  if (members.length === 0) {
    outputDiv.innerHTML = 'Please add at least one member.';
    return;
  }

  const splitAmount = (totalAmount / members.length).toFixed(2);

  let result = `<strong>Total: ₹${totalAmount.toFixed(2)}</strong><br>`;
  result += `<strong>Each should pay: ₹${splitAmount}</strong><br><br>`;

  members.forEach(member => {
    result += `${member} should pay ₹${splitAmount}<br>`;
  });

  outputDiv.innerHTML = result;
}
