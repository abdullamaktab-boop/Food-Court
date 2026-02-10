const sections = [
  "Burger Factory",
  "MeatMe Mexicano",
  "PIZZARIA",
  "Baristo",
  "Tablo's Bakery",
];

const starterMenu = [
  { id: crypto.randomUUID(), section: "Burger Factory", category: "Burgers", name: "Classic Beef Burger", price: 8500, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80", description: "Juicy grilled beef patty, cheddar, lettuce, tomato, and special sauce." },
  { id: crypto.randomUUID(), section: "Burger Factory", category: "Crispy Chicken", name: "Crispy Chicken Burger", price: 8000, image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=900&q=80", description: "Crunchy fried chicken fillet with pickles and mayo." },
  { id: crypto.randomUUID(), section: "Burger Factory", category: "Wings", name: "Kentucky Wings", price: 7000, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80", description: "Golden fried wings with house seasoning." },
  { id: crypto.randomUUID(), section: "Burger Factory", category: "Sides", name: "Rizzo Fries", price: 5000, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80", description: "Crispy fries topped with signature spice blend." },
  { id: crypto.randomUUID(), section: "MeatMe Mexicano", category: "Tacos", name: "Beef Tacos", price: 7500, image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80", description: "Soft tacos loaded with seasoned beef and fresh toppings." },
  { id: crypto.randomUUID(), section: "MeatMe Mexicano", category: "Burritos", name: "Chicken Burrito", price: 9000, image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80", description: "Warm tortilla packed with chicken, rice, beans, and sauce." },
  { id: crypto.randomUUID(), section: "PIZZARIA", category: "Pizzas", name: "Margherita Pizza", price: 11000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80", description: "Classic tomato sauce, mozzarella, and fresh basil." },
  { id: crypto.randomUUID(), section: "PIZZARIA", category: "Pastas", name: "Creamy Chicken Pasta", price: 10500, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80", description: "Penne pasta in rich creamy sauce with grilled chicken." },
  { id: crypto.randomUUID(), section: "Baristo", category: "Hot Drinks", name: "Cappuccino", price: 4500, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80", description: "Rich espresso with steamed milk foam." },
  { id: crypto.randomUUID(), section: "Baristo", category: "Cold Drinks", name: "Iced Latte", price: 5000, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80", description: "Smooth cold milk coffee over ice." },
  { id: crypto.randomUUID(), section: "Tablo's Bakery", category: "Desserts", name: "Chocolate Croissant", price: 3500, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80", description: "Buttery flaky croissant filled with dark chocolate." },
  { id: crypto.randomUUID(), section: "Tablo's Bakery", category: "Desserts", name: "Mini Cheesecake", price: 5000, image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=80", description: "Creamy cheesecake with berry topping." }
];

const storageKey = "food-court-menu-v2";
const passwordKey = "food-court-admin-password-v2";
const defaultPassword = "foodcourt123";

let activeSection = sections[0];
let menu = loadMenu();

const sectionTabs = document.getElementById("sectionTabs");
const menuContainer = document.getElementById("menuContainer");
const template = document.getElementById("menuCardTemplate");
const adminPanel = document.getElementById("adminPanel");
const adminList = document.getElementById("adminList");
const itemForm = document.getElementById("itemForm");

bootstrap();

function bootstrap() {
  ensurePassword();
  renderTabs();
  renderMenu();
  fillSectionDropdown();
  renderAdminList();

  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("adminToggle").addEventListener("click", openAdminWithPassword);
  document.getElementById("closeAdmin").addEventListener("click", () => adminPanel.classList.add("hidden"));
  document.getElementById("resetForm").addEventListener("click", resetForm);

  itemForm.addEventListener("submit", onSaveItem);
}

function ensurePassword() {
  if (!localStorage.getItem(passwordKey)) {
    localStorage.setItem(passwordKey, defaultPassword);
  }
}

function openAdminWithPassword() {
  const input = prompt("Enter admin password:");
  if (input === null) return;

  if (input !== localStorage.getItem(passwordKey)) {
    alert("Incorrect password.");
    return;
  }

  adminPanel.classList.remove("hidden");
}

function loadMenu() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return starterMenu;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : starterMenu;
  } catch {
    return starterMenu;
  }
}

function saveMenu() {
  localStorage.setItem(storageKey, JSON.stringify(menu));
}

function renderTabs() {
  sectionTabs.innerHTML = "";
  sections.forEach((section) => {
    const button = document.createElement("button");
    button.className = `tab ${section === activeSection ? "active" : ""}`;
    button.textContent = section;
    button.addEventListener("click", () => {
      activeSection = section;
      renderTabs();
      renderMenu();
    });
    sectionTabs.appendChild(button);
  });
}

function renderMenu() {
  menuContainer.innerHTML = "";

  const inSection = menu.filter((item) => item.section === activeSection);
  const categories = [...new Set(inSection.map((item) => item.category))];

  categories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "menu-section";
    section.innerHTML = `<h3>${category}</h3>`;

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    inSection
      .filter((item) => item.category === category)
      .forEach((item) => {
        const card = template.content.cloneNode(true);
        card.querySelector(".menu-card__image").src = item.image;
        card.querySelector(".menu-card__image").alt = item.name;
        card.querySelector(".menu-card__name").textContent = item.name;
        card.querySelector(".menu-card__price").textContent = formatIQD(item.price);
        card.querySelector(".menu-card__desc").textContent = item.description || "";
        grid.appendChild(card);
      });

    section.appendChild(grid);
    menuContainer.appendChild(section);
  });

  if (!inSection.length) {
    menuContainer.innerHTML = `<p>No items yet in ${activeSection}.</p>`;
  }
}

function fillSectionDropdown() {
  const select = document.getElementById("itemSection");
  select.innerHTML = sections.map((section) => `<option value="${section}">${section}</option>`).join("");
}

function renderAdminList() {
  adminList.innerHTML = "";

  [...menu]
    .sort((a, b) => a.section.localeCompare(b.section) || a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    .forEach((item) => {
      const row = document.createElement("div");
      row.className = "admin-item";
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <small>${item.section} • ${item.category} • ${formatIQD(item.price)}</small>
        </div>
        <div class="admin-item__actions">
          <button class="btn btn--ghost" data-action="edit" data-id="${item.id}">Edit</button>
          <button class="btn" data-action="delete" data-id="${item.id}">Delete</button>
        </div>
      `;
      adminList.appendChild(row);
    });

  adminList.querySelectorAll("button").forEach((button) => {
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "edit") button.addEventListener("click", () => populateForm(id));
    if (action === "delete") button.addEventListener("click", () => deleteItem(id));
  });
}

function onSaveItem(event) {
  event.preventDefault();

  const id = document.getElementById("editingId").value || crypto.randomUUID();
  const image = document.getElementById("itemImage").value.trim();

  if (!image) {
    alert("Please provide an image URL.");
    return;
  }

  const item = {
    id,
    section: document.getElementById("itemSection").value,
    category: document.getElementById("itemCategory").value.trim(),
    name: document.getElementById("itemName").value.trim(),
    price: Number(document.getElementById("itemPrice").value),
    image,
    description: document.getElementById("itemDescription").value.trim(),
    halal: true,
  };

  const index = menu.findIndex((entry) => entry.id === id);
  if (index >= 0) menu[index] = item;
  else menu.push(item);

  saveMenu();
  resetForm();
  renderMenu();
  renderAdminList();
}

function populateForm(id) {
  const item = menu.find((entry) => entry.id === id);
  if (!item) return;

  document.getElementById("editingId").value = item.id;
  document.getElementById("itemSection").value = item.section;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemImage").value = item.image || "";
  document.getElementById("itemDescription").value = item.description || "";
}

function deleteItem(id) {
  menu = menu.filter((item) => item.id !== id);
  saveMenu();
  renderMenu();
  renderAdminList();
}

function resetForm() {
  itemForm.reset();
  document.getElementById("editingId").value = "";
  document.getElementById("itemSection").value = activeSection;
}

function formatIQD(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IQD", maximumFractionDigits: 0 }).format(value);
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  document.getElementById("themeToggle").textContent = next === "dark" ? "🌙 Dark" : "☀️ Light";
}
