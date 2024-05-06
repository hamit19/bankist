"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2024-05-01T23:36:17.929Z",
    "2024-05-04T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  moves.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${formatMovementDate(
            date,
            acc.locale
          )}</div>
          <div class="movements__value">${formatCur(
            mov,
            acc.locale,
            acc.currency
          )}</div>
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

const formatMovementDate = function (date, locale) {
  const calcPassedDays = (currentDate, perDate) =>
    Math.floor(Math.abs(perDate - currentDate) / (1000 * 60 * 60 * 24));

  const daysPassed = calcPassedDays(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

createUsername(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.innerHTML = formatCur(acc.balance, acc.locale, acc.currency);
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

  labelSumIn.innerHTML = formatCur(
    totalIn,
    currentAccount.locale,
    currentAccount.currency
  );
  labelSumOut.innerHTML = formatCur(
    Math.abs(totalOut),
    currentAccount.locale,
    currentAccount.currency
  );
  labelSumInterest.innerHTML = formatCur(
    interest,
    currentAccount.locale,
    currentAccount.currency
  );
};

// Event Listeners

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  let username = inputLoginUsername.value;
  let pin = +inputLoginPin.value;

  currentAccount = accounts.find((acc) => acc.username === username);

  if (currentAccount?.pin === pin) {
    //Display users first name and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    const now = new Date();

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };

    labelDate.innerText = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

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

  let amount = +inputTransferAmount.value;
  let recipient = inputTransferTo.value;

  const recAccount = accounts.find((acc) => acc.username === recipient);

  if (
    recAccount &&
    amount >= 1 &&
    amount <= currentAccount.balance &&
    recAccount.username !== currentAccount.username
  ) {
    recAccount.movements.push(amount);
    recAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());

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
    +inputClosePin.value === currentAccount.pin
  ) {
    const accIndex = accounts.findIndex(
      (acc) => acc.username === inputCloseUsername.value
    );

    accounts.splice(accIndex, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => amount >= mov * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    inputLoanAmount.value = "";
  }
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
