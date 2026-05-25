import { db, collection, addDoc } from "./firebase-config.js";

const form = document.getElementById("contactForm");

const scriptURL =
    "https://script.google.com/macros/s/AKfycbwJLGhtNIodXSNrtlkTxrfv7RPjYwLreFXXheVXM9AI8Be4DxITq7S1yIqfq9pjnitt/exec";    
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const firebaseData = {
    createdAt: new Date(),
    name: form.name.value,
    email: form.email.value,
    message: form.message.value
  };

  // ✅ Show loading alert immediately on submit
  Swal.fire({
    title: "Sending...",
    text: "Please wait while we send your message.",
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
        sheet: "Contact-Messages",
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      })
    });

    await addDoc(
      collection(db, "contact_messages"),
      firebaseData
    );

    // ✅ Replaces the loading alert automatically
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
});