import { db, collection, addDoc } from "./firebase-config.js";

// Initialize intl-tel-input
const phoneInput = document.getElementById("phone");

const iti = window.intlTelInput(phoneInput, {
  initialCountry: "in",
  separateDialCode: true,
});

const form = document.getElementById("admissionForm");

const scriptURL =
    "https://script.google.com/macros/s/AKfycbx98FTZfJOTqFqXJA0wbyFCKFKWbA-3Uy61FNmnE8WH0A8TVuSK8ASiT4E426IQtZ7S/exec";

/* ─────────────────────────────────────────
   HELPERS — mark a field valid / invalid
───────────────────────────────────────── */
function setError(fieldId, errorId, message) {
  let field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  // intl-tel-input wraps the input — apply border to the wrapper instead
  if (fieldId === "phone" && field?.closest(".iti")) {
    field = field.closest(".iti");
  }

  if (field) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
  }
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function setValid(fieldId, errorId) {
  let field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);

  if (fieldId === "phone" && field?.closest(".iti")) {
    field = field.closest(".iti");
  }

  if (field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }
  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

function setRadioError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const error = document.getElementById(errorId);
  if (group) group.classList.add("radio-invalid");
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function setRadioValid(groupId, errorId) {
  const group = document.getElementById(groupId);
  const error = document.getElementById(errorId);
  if (group) group.classList.remove("radio-invalid");
  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

/* ─────────────────────────────────────────
   VALIDATE — checks all required fields,
   returns { valid: bool, errors: string[] }
───────────────────────────────────────── */
function validate() {
  let valid = true;
  const errors = [];   // collects labels for the popup summary

  // ── Full Name ──────────────────────────
  const name = document.getElementById("name").value.trim();
  if (!name) {
    setError("name", "name-error", "Full name is required.");
    errors.push("Full Name");
    valid = false;
  } else if (name.length < 2) {
    setError("name", "name-error", "Name must be at least 2 characters.");
    errors.push("Full Name");
    valid = false;
  } else {
    setValid("name", "name-error");
  }

// ── Phone ──────────────────────────────
  const phone = phoneInput.value.trim();
  
  if (!phone) {
    setError("phone", "phone-error", "Phone number is required.");
    errors.push("Phone");
    valid = false;
  } else if (!iti.isValidNumber()) {
    // The plugin now safely handles the validation for ANY selected country
    setError("phone", "phone-error", `Enter a valid phone number for ${iti.getSelectedCountryData().name}.`);
    errors.push("Phone");
    valid = false;
  } else {
    setValid("phone", "phone-error");
  }

  // ── Email ──────────────────────────────
  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setError("email", "email-error", "Email address is required.");
    errors.push("Email");
    valid = false;
  } else if (!emailRegex.test(email)) {
    setError("email", "email-error", "Enter a valid email address (e.g. name@gmail.com).");
    errors.push("Email");
    valid = false;
  } else {
    setValid("email", "email-error");
  }

  // ── Age ────────────────────────────────
  const ageVal = document.getElementById("age").value.trim();
  const age = parseInt(ageVal);
  if (!ageVal) {
    setError("age", "age-error", "Age is required.");
    errors.push("Age");
    valid = false;
  } else if (isNaN(age) || age < 16) {
    setError("age", "age-error", "Minimum age to join is 16 years.");
    errors.push("Age");
    valid = false;
  } else if (age > 100) {
    setError("age", "age-error", "Please enter a valid age (16–100).");
    errors.push("Age");
    valid = false;
  } else {
    setValid("age", "age-error");
  }

  // ── Address ────────────────────────────
  const address = document.getElementById("address").value.trim();
  if (!address) {
    setError("address", "address-error", "Address is required.");
    errors.push("Address");
    valid = false;
  } else if (address.length < 10) {
    setError("address", "address-error", "Please enter your full address (at least 10 characters).");
    errors.push("Address");
    valid = false;
  } else {
    setValid("address", "address-error");
  }

  // ── Emergency Contact ──────────────────
  const ec = document.getElementById("emergency_contact").value.trim();
  if (!ec) {
    setError("emergency_contact", "ec-error", "Emergency contact is required.");
    errors.push("Emergency Contact");
    valid = false;
  } else if (ec.length < 5) {
    setError("emergency_contact", "ec-error", "Please enter a valid emergency contact name or number.");
    errors.push("Emergency Contact");
    valid = false;
  } else {
    setValid("emergency_contact", "ec-error");
  }

  // ── Preferred Batch (radio) ────────────
  const batchSelected = document.querySelector('input[name="batch"]:checked');
  if (!batchSelected) {
    setRadioError("batch-group", "batch-error", "Please select a preferred batch.");
    errors.push("Preferred Batch");
    valid = false;
  } else {
    setRadioValid("batch-group", "batch-error");
  }

  // ── Mode (radio) ───────────────────────
  const modeSelected = document.querySelector('input[name="mode"]:checked');
  if (!modeSelected) {
    setRadioError("mode-group", "mode-error", "Please select a mode — Online or Offline.");
    errors.push("Mode");
    valid = false;
  } else {
    setRadioValid("mode-group", "mode-error");
  }

  return { valid, errors };
}

/* ─────────────────────────────────────────
   SUBMIT HANDLER
───────────────────────────────────────── */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { valid, errors } = validate();

  if (!valid) {
    

    // Build the error list for the popup
    const errorListHTML = errors
      .map(e => `<li style="text-align:left; margin-bottom: 6px;">❌ &nbsp;${e}</li>`)
      .join("");

    // Show SweetAlert popup summarising all errors
    Swal.fire({
      title: "Please fix the following fields:",
      html: `<ul style="list-style:none; padding:0; margin-top:8px;">${errorListHTML}</ul>`,
      icon: "warning",
      confirmButtonText: "OK, let me fix it",
      confirmButtonColor: "#f4a259",
      background: "#fff",
      color: "#2b2623",
    }).then(() => {
    // Scroll AFTER the user dismisses the popup
    const firstInvalid = document.querySelector(".is-invalid, .radio-invalid");
    if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "start" });
    // offset for fixed navbar so the field isn't hidden behind it
    setTimeout(() => window.scrollBy({ top: -80, behavior: "smooth" }), 300);
  }
  });

    return;
  }

  // ── All valid — proceed with submission ──
  const firebaseData = {
    createdAt: new Date(),
    name: form.name.value,
    phone: iti.getNumber(),
    email: form.email.value,
    age: form.age.value,
    address: form.address.value,
    emergency_contact: form.emergency_contact.value,
    batch: form.batch.value,
    mode: form.mode.value,
    medical: form.medical.value,
    weight: form.weight.value,
    blood_group: form.blood_group.value
  };

  Swal.fire({
    title: "Submitting...",
    text: "Please wait while we process your admission form.",
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => { Swal.showLoading(); }
  });

  try {
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        sheet: "Admissions",
        name: form.name.value,
        phone: iti.getNumber(),
        email: form.email.value,
        age: form.age.value,
        address: form.address.value,
        emergency_contact: form.emergency_contact.value,
        batch: form.batch.value,
        mode: form.mode.value,
        medical: form.medical.value,
        weight: form.weight.value,
        blood_group: form.blood_group.value
      })
    });

    await addDoc(collection(db, "admissions"), firebaseData);

    Swal.fire({
      title: "Success!",
      text: "Your registration has been submitted successfully!",
      icon: "success",
      confirmButtonColor: "#f4a259",
      background: "#fff",
      color: "#333"
    });

    form.reset();

    // Clear all green valid borders after reset
    document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));

  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#f4a259",
      background: "#fff",
      color: "#333"
    });
  }
});

/* ─────────────────────────────────────────
   LIVE CLEARING — remove error as user
   starts fixing each field
───────────────────────────────────────── */
const textFields = [
  { fieldId: "name",              errorId: "name-error" },
  { fieldId: "email",             errorId: "email-error" },
  { fieldId: "age",               errorId: "age-error" },
  { fieldId: "address",           errorId: "address-error" },
  { fieldId: "emergency_contact", errorId: "ec-error" },
];

const phoneField = document.getElementById("phone");
if (phoneField) {
  phoneField.addEventListener("input", () => {
    const wrapper = phoneField.closest(".iti");  // ← climb up to the wrapper
    if (wrapper) {
      wrapper.classList.remove("is-invalid", "is-valid");  // ← remove from wrapper
    }
    const error = document.getElementById("phone-error");
    if (error) { error.textContent = ""; error.style.display = "none"; }
  });
}

textFields.forEach(({ fieldId, errorId }) => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener("input", () => {
      field.classList.remove("is-invalid", "is-valid");
      const error = document.getElementById(errorId);
      if (error) { error.textContent = ""; error.style.display = "none"; }
    });
  }
});

document.querySelectorAll('input[name="batch"]').forEach(radio => {
  radio.addEventListener("change", () => {
    setRadioValid("batch-group", "batch-error");
  });
});

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    setRadioValid("mode-group", "mode-error");
  });
});
