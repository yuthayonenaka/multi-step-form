// INPUT
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneNumberInput = document.querySelector("#phone-number");

//Button
const nextButton = document.querySelectorAll(".btn-dark");

const prevButton = document.querySelectorAll(".btn-light");

// Card Plan
const yearlyText = document.querySelectorAll(".yearly-bonus");
const cardEl = document.querySelectorAll(".card");
const cardPriceEl = document.querySelectorAll(".card .sub-heading:not(.small)");

// Add ons
const addOnCheckBoxes = document.querySelectorAll(".checkbox");

// Toggle
const planToggle = document.querySelector(".toggle");

// Summary Container

const summaryContainer = document.querySelector(".container__detail");
const addOnsSummaryEl = document.querySelectorAll(
  ".container__detail .flex-row:not(:nth-child(1))"
);
const totalEl = document.querySelector(".total");
const total = document.querySelector(".price--large");
const changeEl = document.querySelector("#change");

addOnsSummaryEl.forEach((addon) => (addon.outerHTML = ""));
totalEl.textContent = "";
total.textContent = "";

// Price
const planMonthlyPrice = [9, 12, 15];
const planYearlyPrice = [90, 120, 150];
const addOnMonthlyPrice = [1, 2, 2];
const addOnYearlyPrice = [10, 20, 20];

let time = "monthly";
let currentStep = 1;
let currentPlan = "Arcade";

const price = {
  plan_price: time === "monthly" ? 9 : 90,
  online_service: 0,
  larger_storage: 0,
  custom_profile: 0,

  total() {
    return (
      this.plan_price +
      this.online_service +
      this.larger_storage +
      this.custom_profile
    );
  },
};

// Email Regex
const re =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Form Validation

function resetInputError(inputEl, type) {
  inputEl.classList.remove("error");
  document.querySelector(`.error-message-${type}`).textContent = "";
}

function setError(inputEl, type, message) {
  inputEl.classList.add("error");
  document.querySelector(`.error-message-${type}`).textContent = message;
}

function validateForm() {
  const form = {
    name: null,
    email: null,
    phone: null,
  };
  let isValid;

  if (nameInput.value) {
    resetInputError(nameInput, "name");
    form.name = true;
  } else {
    setError(nameInput, "name", "This field is required");

    form.name = false;
  }

  if (emailInput.value) {
    if (emailInput.value.toLowerCase().match(re)) {
      resetInputError(emailInput, "email");
      form.email = true;
    } else {
      setError(emailInput, "email", "Email Invalid");
      form.email = false;
    }
  } else {
    setError(emailInput, "email", "This field is required");

    form.email = false;
  }

  if (phoneNumberInput.value) {
    resetInputError(phoneNumberInput, "phone");
    form.phone = true;
  } else {
    setError(phoneNumberInput, "phone", "This field is required");
    form.phone = false;
  }

  isValid = form.name && form.email && form.phone;

  return isValid;
}

// Plan function

function planDefault() {
  cardEl.forEach((el) => el.classList.remove("chose"));
  cardEl[0].classList.add("chose");
  price.plan_price = time === "monthly" ? 9 : 90;
  currentPlan = "Arcade";
}

function planUiSwitcher() {
  document.querySelector(".monthly").classList.toggle("toggle-active");
  document.querySelector(".yearly").classList.toggle("toggle-active");
}

function planUiUpdate() {
  cardPriceEl.forEach((price, i) => {
    if (time === "monthly") {
      price.textContent = `$${planMonthlyPrice[i]}/mo`;
      document
        .querySelectorAll(".yearly-bonus")
        .forEach((el) => el.classList.add("hidden"));
    } else if (time === "yearly") {
      price.textContent = `$${planYearlyPrice[i]}/yr`;
      document
        .querySelectorAll(".yearly-bonus")
        .forEach((el) => el.classList.remove("hidden"));
    }
  });
}

function setValueOfPlan() {
  cardEl.forEach((card, i) => {
    if (!card.classList.contains("chose")) return;

    if (time === "yearly") price.plan_price = planYearlyPrice[i];

    if (time === "monthly") price.plan_price = planMonthlyPrice[i];
  });
}

function setValueOfAddOns(targetElement, index) {
  if (time === "monthly") {
    price[targetElement.name] = addOnMonthlyPrice[index];
    addOnsSummary(targetElement.name, addOnMonthlyPrice[index]);
  }

  if (time === "yearly") {
    price[targetElement.name] = addOnYearlyPrice[index];
    addOnsSummary(targetElement.name, addOnYearlyPrice[index]);
  }
}

planToggle.addEventListener("change", (e) => {
  if (e.target.value === "monthly") {
    e.target.value = "yearly";
    time = e.target.value;
    planUiSwitcher();
  } else {
    e.target.value = "monthly";
    time = e.target.value;
    planUiSwitcher();
  }
  document.querySelectorAll(`.add-ons`).forEach((el) => el.remove());
  addOnCheckBoxes.forEach((checkBox, i) => {
    if (checkBox.value === "check") {
      setValueOfAddOns(checkBox, i);
    }
  });
  setValueOfPlan();

  planUiUpdate();
});

// Add plan element into step summary / step 4
function addPlanSummary() {
  document.querySelector(
    ".container__detail .heading--tertiary"
  ).textContent = `${currentPlan} (${
    time === "monthly" ? "Monthly" : "Yearly"
  })`;

  document.querySelector(".price--medium").textContent = `$${
    price.plan_price
  }/${time === "monthly" ? "mo" : "yr"}`;
}

// Choosing the plan
cardEl.forEach((card, i) => {
  const plan = ["Arcade", "Advanced", "Pro"];

  card.addEventListener("click", (e) => {
    cardEl.forEach((card) => card.classList.remove("chose"));
    card.classList.add("chose");

    setValueOfPlan();
    currentPlan = plan[i];
  });
});

// Add ons function

// Update the display on step 3 (yearly / monthly)
function addOnsDisplayUpdate() {
  document.querySelectorAll(".card__price").forEach((price, i) => {
    if (time === "monthly") price.textContent = `+$${addOnMonthlyPrice[i]}/mo`;
    if (time === "yearly") price.textContent = `+$${addOnYearlyPrice[i]}/yr`;
  });
}
// Add element into step summary / step 4
function addOnsSummary(addOnName, price) {
  const html =
    time === "monthly"
      ? ` <div class="flex-row add-ons" id="${addOnName}">
  <p class="sub-heading">${addOnName
    .split("_")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ")}</p>
  <p class="sub-heading price--small">+$${price}/mo</p>
</div>`
      : ` <div class="flex-row add-ons" id="${addOnName}">
<p class="sub-heading">${addOnName
          .split("_")
          .map((word) => word.replace(word[0], word[0].toUpperCase()))
          .join(" ")}</p>
<p class="sub-heading price--small">+$${price}/yr</p>
</div>`;

  summaryContainer.insertAdjacentHTML("beforeend", html);
}

// Choosing add on
addOnCheckBoxes.forEach((checkBox, i) => {
  checkBox.addEventListener("change", (e) => {
    e.target.value = e.target.value === "uncheck" ? "check" : "uncheck";
    document.querySelector(`.add-ons-card-${i}`).classList.toggle("checked");
    if (e.target.value === "check") {
      setValueOfAddOns(e.target, i);
    }
    if (e.target.value === "uncheck") {
      price[e.target.name] = 0;
      document.querySelector(`#${e.target.name}`).remove();
    }
  });
});

// Display currentStep
function displayUpdate() {
  document
    .querySelector(`.section__step-${currentStep}`)
    .classList.toggle("hidden");
  if (currentStep <= 4)
    document.querySelector(`#step-${currentStep}`).classList.toggle("active");
}

//  Update the display on step summry / step 4
function updateSummary() {
  addPlanSummary();
  if (time === "monthly") {
    total.textContent = `$${price.total()}/mo`;
    totalEl.textContent = `Total(per month)`;
  }
  if (time === "yearly") {
    totalEl.textContent = `Total(per year)`;
    total.textContent = `$${price.total()}/yr`;
  }
}

// Next Step Button
nextButton.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    validateForm();

    if (validateForm() && currentStep <= 4) {
      displayUpdate();
      currentStep++;
      displayUpdate();
    }

    addOnsDisplayUpdate();
    updateSummary();
  });
});

function resetInput() {
  nameInput.value = "";
  emailInput.value = "";
  phoneNumberInput.value = "";
}

function resetAddOnsValue() {
  price.online_service = 0;
  price.larger_storage = 0;
  price.custom_profile = 0;

  addOnCheckBoxes.forEach((checkbox) => {
    checkbox.value = "uncheck";
    checkbox.checked = false;
  });
  document
    .querySelectorAll(".form__add-ons-card")
    .forEach((card) => card.classList.remove("checked"));
  if (document.querySelectorAll(".add-ons"))
    document.querySelectorAll(".add-ons").forEach((addon) => addon.remove());
}

function resetPlan() {
  planToggle.value = "monthly";
  time = "monthly";
  planToggle.checked = false;
  planUiSwitcher();
  planUiUpdate();
  planDefault();
}
// Prev Step button

prevButton.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (currentStep <= 2) {
      resetInput();
      resetPlan();
      resetAddOnsValue();
    }

    displayUpdate();
    currentStep--;
    displayUpdate();
  });
});

changeEl.addEventListener("click", (e) => {
  e.preventDefault();

  displayUpdate();
  currentStep = 2;
  displayUpdate();
});
