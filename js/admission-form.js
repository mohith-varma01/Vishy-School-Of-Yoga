import { db, collection, addDoc } from "./firebase-config.js";

const form = document.getElementById("admissionForm");

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxu0wSyTEt7ln02C4psjqVWsLcV4Qk4qi-PeXLpz1M-pqAxMUYb5Bi2zZWczXgO5Nzh/exec";

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // Firebase object
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

  try {

    // Send to Google Sheets
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",                                  // ✅ Fixes CORS error
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"  // ✅ Required for e.parameter
      },
      body: new URLSearchParams({                       // ✅ Replaces FormData
        sheet: "Admissions",                            // ✅ Moved from URL to body
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

    // Store in Firebase
    await addDoc(
      collection(db, "admissions"),
      firebaseData
    );

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
});