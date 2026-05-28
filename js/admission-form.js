import { db, collection, addDoc } from "./firebase-config.js";

const form = document.getElementById("admissionForm");

const scriptURL =
    "https://script.google.com/macros/s/AKfycbwJLGhtNIodXSNrtlkTxrfv7RPjYwLreFXXheVXM9AI8Be4DxITq7S1yIqfq9pjnitt/exec";

function validate() {
  let valid = true;

  // Helper — marks a field as invalid with a message
  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    error.textContent = message;
    error.classList.add('visible');
    valid = false;
  }

  // Helper — marks a field as valid, clears error
  function setValid(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    error.textContent = '';
    error.classList.remove('visible');
  }

  // ── Full Name ──
  const name = document.getElementById('name').value.trim();
  if (!name) {
    setError('name', 'name-error', 'Full name is required.');
  } else if (name.length < 2) {
    setError('name', 'name-error', 'Name must be at least 2 characters.');
  } else {
    setValid('name', 'name-error');
  }

  // ── Phone ──
  const phone = document.getElementById('phone').value.trim();
  const phoneRegex = /^[6-9]\d{9}$/;   // Indian mobile: starts 6-9, 10 digits
  if (!phone) {
    setError('phone', 'phone-error', 'Phone number is required.');
  } else if (!phoneRegex.test(phone)) {
    setError('phone', 'phone-error', 'Enter a valid 10-digit Indian mobile number.');
  } else {
    setValid('phone', 'phone-error');
  }

  // ── Email ──
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setError('email', 'email-error', 'Email address is required.');
  } else if (!emailRegex.test(email)) {
    setError('email', 'email-error', 'Enter a valid email address (e.g. name@email.com).');
  } else {
    setValid('email', 'email-error');
  }

  // ── Age ──
  const age = parseInt(document.getElementById('age').value);
  if (!age) {
    setError('age', 'age-error', 'Age is required.');
  } else if (age < 16) {
    setError('age', 'age-error', 'Minimum age to join is 16 years.');
  } else if (age > 100) {
    setError('age', 'age-error', 'Please enter a valid age.');
  } else {
    setValid('age', 'age-error');
  }

  // ── Address ──
  const address = document.getElementById('address').value.trim();
  if (!address) {
    setError('address', 'address-error', 'Address is required.');
  } else if (address.length < 10) {
    setError('address', 'address-error', 'Please enter your full address.');
  } else {
    setValid('address', 'address-error');
  }

  // ── Emergency Contact ──
  const ec = document.getElementById('emergency_contact').value.trim();
  if (!ec) {
    setError('emergency_contact', 'ec-error', 'Emergency contact is required.');
  } else if (ec.length < 5) {
    setError('emergency_contact', 'ec-error', 'Please enter a valid emergency contact.');
  } else {
    setValid('emergency_contact', 'ec-error');
  }

  // ── Batch (radio group) ──
  const batchSelected = document.querySelector('input[name="batch"]:checked');
  const batchGroup = document.getElementById('batch-group');
  const batchError = document.getElementById('batch-error');
  if (!batchSelected) {
    batchGroup.classList.add('radio-invalid');
    batchError.textContent = 'Please select a preferred batch.';
    batchError.classList.add('visible');
    valid = false;
  } else {
    batchGroup.classList.remove('radio-invalid');
    batchError.textContent = '';
    batchError.classList.remove('visible');
  }

  // ── Mode (radio group) ──
  const modeSelected = document.querySelector('input[name="mode"]:checked');
  const modeGroup = document.getElementById('mode-group');
  const modeError = document.getElementById('mode-error');
  if (!modeSelected) {
    modeGroup.classList.add('radio-invalid');
    modeError.textContent = 'Please select a mode (Online or Offline).';
    modeError.classList.add('visible');
    valid = false;
  } else {
    modeGroup.classList.remove('radio-invalid');
    modeError.textContent = '';
    modeError.classList.remove('visible');
  }

  return valid;
}    

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // Run validation — stop if anything is invalid
  if (!validate()) {
    // Scroll to the first error so the user sees it
    const firstError = document.querySelector('.is-invalid, .radio-invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;   // ← stops here, never reaches Firebase/Sheets
  }

  const firebaseData = {
    createdAt: new Date(),
    name: form.name.value,
    phone: form.phone.value,
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

  // ✅ Show loading alert immediately on submit
  Swal.fire({
    title: "Submitting...",
    text: "Please wait while we process your admission form.",
    icon: "info",
    allowOutsideClick: false,       // ✅ Prevent user from dismissing it
    allowEscapeKey: false,          // ✅ Prevent closing with Escape
    showConfirmButton: false,       // ✅ No button, just a spinner feel
    didOpen: () => {
      Swal.showLoading();           // ✅ Shows the spinning loader
    }
  });

  try {

    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        sheet: "Admissions",
        name: form.name.value,
        phone: form.phone.value,
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

    await addDoc(
      collection(db, "admissions"),
      firebaseData
    );

    // ✅ Replaces the loading alert automatically
    Swal.fire({
      title: "Success!",
      text: "Form submitted successfully!",
      icon: "success",
      confirmButtonColor: "#f4a259",
      background: "#fff",
      color: "#333"
    });

    form.reset();

  } catch (error) {

    console.error("Error submitting form:", error);

    // ✅ Replaces the loading alert automatically
    Swal.fire({
      title: "Error!",
      text: "Something went wrong.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#f4a259",
      background: "#fff",
      color: "#333"
    });
  }
})

// Clear error on each field as user starts typing/changing
['name', 'phone', 'email', 'age', 'address', 'emergency_contact'].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('input', () => {
      field.classList.remove('is-invalid', 'is-valid');
      const error = document.getElementById(fieldId + '-error')
                 || document.getElementById('ec-error');  // emergency_contact special case
      if (error) {
        error.textContent = '';
        error.classList.remove('visible');
      }
    });
  }
});

// Clear radio errors on selection
document.querySelectorAll('input[name="batch"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('batch-group').classList.remove('radio-invalid');
    document.getElementById('batch-error').textContent = '';
    document.getElementById('batch-error').classList.remove('visible');
  });
});

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('mode-group').classList.remove('radio-invalid');
    document.getElementById('mode-error').textContent = '';
    document.getElementById('mode-error').classList.remove('visible');
  });
});