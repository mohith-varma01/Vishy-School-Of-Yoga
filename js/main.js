// // Small JS: year and simple form validation
// document.getElementById('year').textContent = new Date().getFullYear();

// (function(){
//   const form = document.getElementById('contactForm');
//   form.addEventListener('submit', function(e){
//     if(!form.checkValidity()){
//       e.preventDefault();
//       e.stopPropagation();
//     } else {
//       e.preventDefault();
//       // Replace this with real submission: AJAX / fetch to your backend or automation
//       alert('Thanks! Your message has been received — this demo does not actually send messages.');
//       form.reset();
//     }
//     form.classList.add('was-validated');
//   }, false);
// })();

// // Smooth scroll for nav anchors
// document.querySelectorAll('a[href^="#"]').forEach(a=>{
//   a.addEventListener('click', function(e){
//     const target = document.querySelector(this.getAttribute('href'));
//     if(target){
//       e.preventDefault();
//       target.scrollIntoView({behavior:'smooth', block:'start'});
//     }
//   });
// });
