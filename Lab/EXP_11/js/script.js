// AJAX: load course cards from data.json
async function loadCourses() {
  const box = document.getElementById("courses");
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const courses = await res.json();
    box.innerHTML = courses.map(c =>
      `<div class="card"><h3>${c.title}</h3><p>${c.desc}</p><span class="badge">${c.level}</span></div>`
    ).join("");
  } catch (e) {
    box.textContent = "Could not load courses. Run the site through a local server. (" + e.message + ")";
  }
}

// Form validation
function setError(id, msg) { document.getElementById(id).textContent = msg; return !msg; }

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  let ok = true;
  ok = setError("nameErr", name.length >= 3 ? "" : "Enter at least 3 characters") && ok;
  ok = setError("emailErr", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email") && ok;
  ok = setError("msgErr", msg.length >= 10 ? "" : "Message must be at least 10 characters") && ok;
  document.getElementById("formMsg").textContent = ok ? "Thank you, " + name + "! Message sent." : "";
  if (ok) e.target.reset();
});

// Smooth scroll for hero button
document.getElementById("startBtn").addEventListener("click", () =>
  document.getElementById("courseSection").scrollIntoView({ behavior: "smooth" }));

document.getElementById("year").textContent = new Date().getFullYear();
loadCourses();
