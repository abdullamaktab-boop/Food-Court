import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const sections = [
  "Burger Factory",
  "MeatMe Mexicano",
  "PIZZARIA",
  "Baristo",
  "Tablo's Bakery",
];

const starterMenu = [
  { id: "starter-1", section: "Burger Factory", category: "Burgers", name: "Classic Beef Burger", price: 8500, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80", description: "Juicy grilled beef patty, cheddar, lettuce, tomato, and special sauce." },
  { id: "starter-2", section: "Burger Factory", category: "Crispy Chicken", name: "Crispy Chicken Burger", price: 8000, image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=900&q=80", description: "Crunchy fried chicken fillet with pickles and mayo." },
  { id: "starter-3", section: "Burger Factory", category: "Wings", name: "Kentucky Wings", price: 7000, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80", description: "Golden fried wings with house seasoning." },
  { id: "starter-4", section: "Burger Factory", category: "Sides", name: "Rizzo Fries", price: 5000, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80", description: "Crispy fries topped with signature spice blend." },
  { id: "starter-5", section: "MeatMe Mexicano", category: "Tacos", name: "Beef Tacos", price: 7500, image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80", description: "Soft tacos loaded with seasoned beef and fresh toppings." },
  { id: "starter-6", section: "PIZZARIA", category: "Pizzas", name: "Margherita Pizza", price: 11000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80", description: "Classic tomato sauce, mozzarella, and fresh basil." },
  { id: "starter-7", section: "Baristo", category: "Hot Drinks", name: "Cappuccino", price: 4500, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=80", description: "Rich espresso with steamed milk foam." },
  { id: "starter-8", section: "Tablo's Bakery", category: "Desserts", name: "Chocolate Croissant", price: 3500, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80", description: "Buttery flaky croissant filled with dark chocolate." }
];

const firebaseConfig = window.FOOD_COURT_FIREBASE_CONFIG;
const firebaseEnabled = Boolean(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "REPLACE_ME");

const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
const db = firebaseEnabled ? getFirestore(app) : null;
const auth = firebaseEnabled ? getAuth(app) : null;
const storage = firebaseEnabled ? getStorage(app) : null;

const menuCollection = firebaseEnabled ? collection(db, "menuItems") : null;

let activeSection = sections[0];
let menu = [];
let selectedUploadFile = null;
let isAdminAuthenticated = false;

const sectionTabs = document.getElementById("sectionTabs");
const menuContainer = document.getElementById("menuContainer");
const template = document.getElementById("menuCardTemplate");
const adminPanel = document.getElementById("adminPanel");
const adminList = document.getElementById("adminList");
const itemForm = document.getElementById("itemForm");
const imageFileInput = document.getElementById("itemImageFile");
const uploadPreviewWrap = document.getElementById("uploadPreviewWrap");
const uploadPreview = document.getElementById("uploadPreview");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");
const editorSection = document.getElementById("editorSection");

bootstrap();

function bootstrap() {
  renderTabs();
  fillSectionDropdown();
  bindUiEvents();
  if (firebaseEnabled) {
    watchAuth();
    watchMenu();
  } else {
    authStatus.textContent = "Firebase not configured yet. Menu edits are disabled.";
    loginForm.classList.add("hidden");
    editorSection.classList.add("hidden");
    menu = starterMenu;
    renderMenu();
  }
}

function bindUiEvents() {
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("adminToggle").addEventListener("click", () => adminPanel.classList.remove("hidden"));
  document.getElementById("closeAdmin").addEventListener("click", () => adminPanel.classList.add("hidden"));
  document.getElementById("resetForm").addEventListener("click", resetForm);
  document.getElementById("clearUpload").addEventListener("click", clearUpload);

  imageFileInput.addEventListener("change", handleImageUpload);
  itemForm.addEventListener("submit", onSaveItem);
  loginForm.addEventListener("submit", onLogin);
  logoutBtn.addEventListener("click", onLogout);
}

function watchAuth() {
  onAuthStateChanged(auth, (user) => {
    isAdminAuthenticated = Boolean(user);

    if (user) {
      authStatus.textContent = `Signed in as ${user.email}`;
      loginForm.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      editorSection.classList.remove("hidden");
      renderAdminList();
      return;
    }

    authStatus.textContent = "Not signed in";
    loginForm.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    editorSection.classList.add("hidden");
  });
}

function watchMenu() {
  const menuQuery = query(menuCollection, orderBy("section"), orderBy("category"), orderBy("name"));

  onSnapshot(menuQuery, (snapshot) => {
    const cloudItems = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
    menu = cloudItems.length ? cloudItems : starterMenu;

    renderMenu();
    if (isAdminAuthenticated) renderAdminList();
  }, (error) => {
    console.error(error);
    alert("Could not load shared menu. Check Firestore rules and Firebase config.");
    menu = starterMenu;
    renderMenu();
  });
}

async function onLogin(event) {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (!firebaseEnabled) return;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch {
    alert("Login failed. Check email/password and Firebase Auth setup.");
  }
}

async function onLogout() {
  if (!firebaseEnabled) return;
  await signOut(auth);
  resetForm();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose a valid image file.");
    event.target.value = "";
    return;
  }

  selectedUploadFile = file;
  uploadPreview.src = URL.createObjectURL(file);
  uploadPreviewWrap.classList.remove("hidden");
}

function clearUpload() {
  selectedUploadFile = null;
  imageFileInput.value = "";
  uploadPreview.src = "";
  uploadPreviewWrap.classList.add("hidden");
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
        const img = card.querySelector(".menu-card__image");
        img.src = item.image;
        img.alt = item.name;
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

  [...menu].forEach((item) => {
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

async function onSaveItem(event) {
  event.preventDefault();

  if (!firebaseEnabled || !isAdminAuthenticated) {
    alert("Please sign in as admin first.");
    return;
  }

  const id = document.getElementById("editingId").value || crypto.randomUUID();
  const manualImage = document.getElementById("itemImage").value.trim();
  let image = manualImage;

  if (selectedUploadFile) {
    const storageRef = ref(storage, `menu-images/${id}-${Date.now()}-${selectedUploadFile.name}`);
    await uploadBytes(storageRef, selectedUploadFile);
    image = await getDownloadURL(storageRef);
  }

  if (!image) {
    alert("Please provide an image URL or upload an image file.");
    return;
  }

  const item = {
    section: document.getElementById("itemSection").value,
    category: document.getElementById("itemCategory").value.trim(),
    name: document.getElementById("itemName").value.trim(),
    price: Number(document.getElementById("itemPrice").value),
    image,
    description: document.getElementById("itemDescription").value.trim(),
    halal: true,
  };

  await setDoc(doc(db, "menuItems", id), item);
  resetForm();
}

function populateForm(id) {
  const item = menu.find((m) => m.id === id);
  if (!item) return;

  document.getElementById("editingId").value = item.id;
  document.getElementById("itemSection").value = item.section;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemImage").value = item.image || "";
  document.getElementById("itemDescription").value = item.description || "";

  clearUpload();
}

async function deleteItem(id) {
  if (!firebaseEnabled || !isAdminAuthenticated) {
    alert("Please sign in as admin first.");
    return;
  }

  await deleteDoc(doc(db, "menuItems", id));
}

function resetForm() {
  itemForm.reset();
  document.getElementById("editingId").value = "";
  document.getElementById("itemSection").value = activeSection;
  clearUpload();
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
