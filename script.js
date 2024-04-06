"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;

const updateUI = function (currentAccount) {
  //display calculated balance
  calcDisplayBalance(currentAccount);

  //display transactions
  displayMovements(currentAccount);

  //display summary
  calcDisplaySummary(currentAccount);
};

const displayMovements = function ({ movements }) {
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsername = function (accounts) {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
  });
};

createUsername(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.innerHTML = acc?.balance + "€";
};

const calcDisplaySummary = function ({ movements, interestRate }) {
  const totalIn = movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);

  const totalOut = movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.innerHTML = totalIn + "€";
  labelSumOut.innerHTML = Math.abs(totalOut) + "€";
  labelSumInterest.innerHTML = interest + "€";
};

// Event Listeners

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  let username = inputLoginUsername.value;
  let pin = Number(inputLoginPin.value);

  currentAccount = accounts.find((acc) => acc.username === username);

  if (currentAccount?.pin === pin) {
    //Display users first name and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    //display UI
    containerApp.style.opacity = 1;

    //clear felids
    inputLoginPin.value = inputLoginUsername.value = "";

    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  let amount = Number(inputTransferAmount.value);
  let recipient = inputTransferTo.value;

  const recAccount = accounts.find((acc) => acc.username === recipient);

  if (
    recAccount &&
    amount >= 1 &&
    amount <= currentAccount.balance &&
    recAccount.username !== currentAccount.username
  ) {
    recAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    inputTransferAmount.value = inputTransferTo.value = "";

    inputTransferAmount.blur();
    inputTransferTo.blur();

    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const accIndex = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );

    accounts.splice(accIndex, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const totalDeposits = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * 1.1)
//   .reduce((acc, curr) => acc + curr);
// console.log(totalDeposits);
