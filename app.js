(function () {
  const money = (n) => SETTINGS.currency + n.toFixed(2);
  const qty = {};
  MENU.forEach((m) => (qty[m.id] = 0));

  // ---- Fill in page text from menu.js ----
  document.title = SETTINGS.title;
  document.getElementById("title").textContent = SETTINGS.title;
  document.getElementById("tagline").textContent = SETTINGS.tagline;
  document.getElementById("intro").textContent = SETTINGS.intro;
  const dl = document.getElementById("deadline");
  if (SETTINGS.orderDeadline) dl.textContent = SETTINGS.orderDeadline; else dl.hidden = true;
  document.getElementById("paymentNote").textContent = SETTINGS.paymentNote;

  const pickup = document.getElementById("pickup");
  SETTINGS.pickupOptions.forEach((o) => {
    const opt = document.createElement("option");
    opt.value = o;
    opt.textContent = o;
    pickup.appendChild(opt);
  });

  // ---- Build the menu cards ----
  const menuEl = document.getElementById("menu");
  MENU.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    const photo = document.createElement("div");
    photo.className = "photo";
    const img = new Image();
    img.alt = item.name;
    img.onload = () => { photo.textContent = ""; photo.appendChild(img); };
    img.onerror = () => { photo.textContent = item.emoji || "🧁"; photo.classList.add("placeholder"); };
    img.src = item.image;
    photo.textContent = item.emoji || "🧁";
    photo.classList.add("placeholder");
    img.addEventListener("load", () => photo.classList.remove("placeholder"));

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      "<h3></h3><p class='size'></p><p class='desc'></p><p class='price'></p>";
    body.querySelector("h3").textContent = item.name;
    body.querySelector(".size").textContent = item.size;
    body.querySelector(".desc").textContent = item.description;
    body.querySelector(".price").textContent = money(item.price) + " each";

    const stepper = document.createElement("div");
    stepper.className = "stepper";
    const minus = button("−", "Remove one " + item.name);
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = "0";
    const plus = button("+", "Add one " + item.name);
    stepper.append(minus, count, plus);

    const set = (n) => {
      qty[item.id] = Math.max(0, Math.min(20, n));
      count.textContent = qty[item.id];
      card.classList.toggle("selected", qty[item.id] > 0);
      updateTotal();
    };
    minus.onclick = () => set(qty[item.id] - 1);
    plus.onclick = () => set(qty[item.id] + 1);

    body.appendChild(stepper);
    card.append(photo, body);
    menuEl.appendChild(card);
  });

  function button(label, aria) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute("aria-label", aria);
    return b;
  }

  function orderTotal() {
    return MENU.reduce((s, m) => s + m.price * qty[m.id], 0);
  }
  function updateTotal() {
    document.getElementById("total").textContent = money(orderTotal());
  }
  updateTotal();

  // ---- Submit ----
  const form = document.getElementById("orderForm");
  const errorEl = document.getElementById("error");
  const submitBtn = document.getElementById("submitBtn");

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const f = form.elements;
    const items = MENU.filter((m) => qty[m.id] > 0).map((m) => ({
      name: m.name + " (" + m.size + ")",
      qty: qty[m.id],
      price: m.price,
    }));

    if (!items.length) return showError("Please choose at least one item.");
    if (!f.name.value.trim()) return showError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim()))
      return showError("Please enter a valid email so we can confirm your order.");
    if (SETTINGS.orderEndpoint.indexOf("PASTE_") === 0)
      return showError("This page isn't connected to the order system yet (see README step 3).");

    const body = new URLSearchParams();
    body.set("name", f.name.value.trim());
    body.set("email", f.email.value.trim());
    body.set("phone", f.phone.value.trim());
    body.set("pickup", f.pickup.value);
    body.set("notes", f.notes.value.trim());
    body.set("website", f.website.value); // honeypot
    body.set("items", JSON.stringify(items));
    body.set("total", orderTotal().toFixed(2));

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      // no-cors: the browser can't read Apps Script's reply, but the order still arrives.
      await fetch(SETTINGS.orderEndpoint, { method: "POST", mode: "no-cors", body });
      form.hidden = true;
      document.getElementById("thanks").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      showError("Sorry, something went wrong sending your order. Please check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send my order";
    }
  });

  document.getElementById("again").onclick = () => {
    MENU.forEach((m) => (qty[m.id] = 0));
    document.querySelectorAll(".count").forEach((c) => (c.textContent = "0"));
    document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
    updateTotal();
    form.reset();
    document.getElementById("thanks").hidden = true;
    form.hidden = false;
  };
})();
