import { db, collection, addDoc } from "./firebase-config.js";

const form = document.getElementById("contactForm");

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxu0wSyTEt7ln02C4psjqVWsLcV4Qk4qi-PeXLpz1M-pqAxMUYb5Bi2zZWczXgO5Nzh/exec";

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  // Firebase data object
  const firebaseData = {
    createdAt: new Date(),
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  try {

    // Send data to Google Sheets
    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",                                  // ✅ Fixes CORS error
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"  // ✅ Required for e.parameter
      },
      body: new URLSearchParams({                       // ✅ FormData won't work with no-cors
        sheet: "Contact-Messages",                      // ✅ Fixed sheet name (was "ContactMessages")
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      })
    });

    // Store in Firebase
    await addDoc(
      collection(db, "contact_messages"),
      firebaseData
    );

    Swal.fire({
      title: "Success!",
      text: "Message sent successfully!",
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