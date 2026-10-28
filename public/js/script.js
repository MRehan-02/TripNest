// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// ---------- WISHLIST (heart icon) ----------
function toggleWishlist(event, btn) {
  event.preventDefault();
  event.stopPropagation();
  // not logged in -> go to login
  if (btn.dataset.auth !== "true") {
    window.location.href = "/login";
    return;
  }
  fetch("/wishlist/" + btn.dataset.id, {
    method: "POST",
    headers: { "Accept": "application/json" }
  })
    .then((res) => res.json())
    .then((data) => {
      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-solid", data.saved);
      icon.classList.toggle("text-danger", data.saved);
      icon.classList.toggle("fa-regular", !data.saved);
      // on the wishlist page, remove the card when un-saved
      if (!data.saved && btn.dataset.remove === "true") {
        const col = btn.closest(".col");
        if (col) col.remove();
        if (!document.querySelector(".listing-card")) window.location.reload();
      }
    })
    .catch(() => window.location.reload());
}

// ---------- DARK MODE ----------
function applyThemeIcon() {
  const icon = document.querySelector("#themeToggle i");
  if (!icon) return;
  const dark = document.documentElement.getAttribute("data-bs-theme") === "dark";
  icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
  applyThemeIcon();
}
document.addEventListener("DOMContentLoaded", applyThemeIcon);

// ---------- BOOKING FORM (live total) ----------
(() => {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");
  const summary = document.getElementById("bookingSummary");
  const price = Number(form.dataset.price);

  const update = () => {
    // check-out must be after check-in
    if (checkIn.value) {
      const next = new Date(checkIn.value);
      next.setDate(next.getDate() + 1);
      checkOut.min = next.toISOString().slice(0, 10);
    }
    if (checkIn.value && checkOut.value) {
      const nights = Math.round((new Date(checkOut.value) - new Date(checkIn.value)) / 86400000);
      if (nights >= 1) {
        const subtotal = nights * price;
        const gst = Math.round(subtotal * 0.18);
        summary.classList.remove("d-none");
        summary.innerHTML = "&#8377; " + price.toLocaleString("en-IN") + " x " + nights + " night" + (nights === 1 ? "" : "s") +
          " + 18% GST (&#8377; " + gst.toLocaleString("en-IN") + ") = <b>&#8377; " + (subtotal + gst).toLocaleString("en-IN") + "</b>";
        return;
      }
    }
    summary.classList.add("d-none");
  };
  checkIn.addEventListener("change", update);
  checkOut.addEventListener("change", update);
})();
