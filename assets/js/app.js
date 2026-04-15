import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-AUuHUKSd-keTmcLMGiWEWNoeFTANRaQ",
    authDomain: "domaura-7052e.firebaseapp.com",
    projectId: "domaura-7052e",
    storageBucket: "domaura-7052e.firebasestorage.app",
    messagingSenderId: "159613937767",
    appId: "1:159613937767:web:986b32540f4edf5a068cc2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let allAds = [];
let confirmationResult = null;
let currentUser = null;
let currentServiceFilter = "tous";

const servicePublications = [
    {
        id: "art-1",
        service: "art",
        title: "Tableau Eclat de Douala",
        price: "45,000 FCFA",
        location: "Douala",
        description: "Collection numerique exposee par un artiste local.",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: "deal-1",
        service: "deal",
        title: "Echange smartphone contre velo",
        price: "Deal ouvert",
        location: "Yaounde",
        description: "Publication communautaire pour echange de biens.",
        image: "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: "courses-1",
        service: "courses",
        title: "Course express Bastos - Melen",
        price: "A partir de 2,000 FCFA",
        location: "Yaounde",
        description: "Service de courses rapides pour besoins quotidiens.",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: "location-1",
        service: "location",
        title: "Location sono evenement",
        price: "80,000 FCFA / jour",
        location: "Bafoussam",
        description: "Materiel de sonorisation disponible pour ceremonies.",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80"
    }
];

window.showSec = (id) => {
    document.querySelectorAll(".section").forEach((section) => section.classList.remove("active"));
    document.querySelectorAll(".nav-tabs button").forEach((button) => button.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    const activeButton = document.querySelector(`.nav-tabs button[data-section="${id}"]`);
    if (activeButton) activeButton.classList.add("active");
};

window.showComingSoon = (moduleName) => {
    alert(`Le module ${moduleName} arrive bientot dans DOMAURA.`);
};

window.toggleServicesMenu = () => {
    const menu = document.getElementById("servicesDropdown");
    showSec("secServices");
    menu.classList.toggle("hidden");
};

window.setServiceFilter = (value) => {
    currentServiceFilter = value;
    const select = document.getElementById("serviceFilter");
    if (select) select.value = value;
    setActiveFilterButton(value);
    showSec("secServices");
    const menu = document.getElementById("servicesDropdown");
    if (menu && !menu.classList.contains("hidden")) menu.classList.add("hidden");
    renderNewsFeed();
};

window.openAccount = () => {
    showSec("secEspace");
    const emailField = document.getElementById("email");
    if (emailField) emailField.focus();
};

window.loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
        alert("Erreur Google : " + error.code);
    }
};

window.loginWithEmail = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || password.length < 6) {
        alert("Email et mot de passe (6 car. min) requis.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("Erreur : " + error.code);
        }
    }
};

window.showPhoneInput = () => {
    document.getElementById("authChoice").classList.add("hidden");
    document.getElementById("phoneInputZone").classList.remove("hidden");
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "normal" });
};

window.sendOtp = async () => {
    const phoneNumber = document.getElementById("phoneNumber").value;

    try {
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
        document.getElementById("otpZone").classList.remove("hidden");
        alert("SMS envoyé !");
    } catch (error) {
        alert("Erreur SMS : " + error.code);
    }
};

window.verifyOtp = async () => {
    const code = document.getElementById("otpCode").value;

    try {
        await confirmationResult.confirm(code);
    } catch {
        alert("Code incorrect.");
    }
};

onAuthStateChanged(auth, (user) => {
    const status = document.getElementById("userStatus");
    const choice = document.getElementById("authChoice");
    const dash = document.getElementById("dashboard");
    const phoneZone = document.getElementById("phoneInputZone");
    const createAccountBtn = document.getElementById("createAccountBtn");
    const accountStatus = document.getElementById("accountStatus");
    const accountEmail = document.getElementById("accountEmail");
    const accountPhone = document.getElementById("accountPhone");

    if (user) {
        currentUser = user;
        status.innerText = user.email || user.phoneNumber || "Connecte";
        choice.classList.add("hidden");
        phoneZone.classList.add("hidden");
        dash.classList.remove("hidden");
        if (createAccountBtn) createAccountBtn.classList.add("hidden");
        if (accountStatus) accountStatus.innerText = "Connecte";
        if (accountEmail) accountEmail.innerText = user.email || "-";
        if (accountPhone) accountPhone.innerText = user.phoneNumber || "-";
        renderUserAds();
    } else {
        currentUser = null;
        status.innerText = "Visiteur";
        choice.classList.remove("hidden");
        dash.classList.add("hidden");
        if (createAccountBtn) createAccountBtn.classList.remove("hidden");
        if (accountStatus) accountStatus.innerText = "Visiteur";
        if (accountEmail) accountEmail.innerText = "-";
        if (accountPhone) accountPhone.innerText = "-";
    }
});

window.logout = () => signOut(auth).then(() => location.reload());

window.deleteAccount = async () => {
    if (!currentUser) return;
    const confirmDelete = confirm("Voulez-vous vraiment supprimer votre compte ?");
    if (!confirmDelete) return;
    try {
        await deleteUser(currentUser);
        alert("Compte supprimé.");
        location.reload();
    } catch (error) {
        alert("Erreur : " + error.code);
    }
};

window.publishAd = async () => {
    const titre = document.getElementById("title").value;
    const prix = document.getElementById("price").value;
    const quartier = document.getElementById("neighborhood").value;
    const tel = document.getElementById("whatsapp").value;
    const imageFile = document.getElementById("imageFile").files[0];
    const btn = document.getElementById("btnPublish");

    if (!titre || !prix || !quartier || !imageFile) {
        alert("Remplissez tous les champs.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "⏳ Mise en ligne...";

    try {
        const fd = new FormData();
        fd.append("image", imageFile);

        const res = await fetch("https://api.imgbb.com/1/upload?key=93de062740df77fd3461e203d8184f4a", {
            method: "POST",
            body: fd
        });
        const img = await res.json();

        await addDoc(collection(db, "annonces"), {
            titre,
            prix,
            quartier,
            whatsapp: tel,
            type: document.getElementById("type").value,
            ville: document.getElementById("city").value,
            image: img.data.url,
            createdAt: new Date(),
            uid: auth.currentUser.uid
        });

        alert("Annonce publiée !");
        location.reload();
    } catch {
        alert("Erreur réseau.");
        btn.disabled = false;
        btn.innerText = "Mettre en ligne l'annonce";
    }
};

onSnapshot(query(collection(db, "annonces"), orderBy("createdAt", "desc")), (snap) => {
    allAds = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderNewsFeed();
    renderUserAds();
});

function setActiveFilterButton(value) {
    const buttons = document.querySelectorAll(".filters .filter-btn");
    buttons.forEach((button) => {
        const match = button.getAttribute("onclick").includes(`'${value}'`);
        if (match) button.classList.add("active-filter");
        else button.classList.remove("active-filter");
    });
}

function renderUserAds() {
    const container = document.getElementById("userAds");
    if (!container) return;
    if (!currentUser) {
        container.innerHTML = "<p class=\"muted-text\">Connectez-vous pour voir vos publications.</p>";
        return;
    }
    const userAds = allAds.filter((ad) => ad.uid === currentUser.uid);
    if (!userAds.length) {
        container.innerHTML = "<p class=\"muted-text\">Aucune publication pour le moment.</p>";
        return;
    }
    container.innerHTML = userAds.map((ad) => `
        <div class="card">
            <img src="${ad.image}" onclick="alert('${ad.titre}\\n📍 ${ad.quartier}')">
            <div class="card-content">
                <div class="price">${ad.prix}</div>
                <h3 class="card-title">${ad.titre}</h3>
                <div class="location">📍 ${ad.quartier}, ${ad.ville} • ${ad.type}</div>
            </div>
        </div>
    `).join("");
}

function renderNewsFeed() {
    const container = document.getElementById("newsFeed");
    if (!container) return;

    const searchText = (document.getElementById("newsSearch")?.value || "").trim().toLowerCase();
    const immobiliers = allAds.map((ad) => ({
        id: ad.id,
        service: "immobilier",
        title: ad.titre,
        price: ad.prix,
        location: `${ad.quartier}, ${ad.ville}`,
        description: ad.type,
        image: ad.image,
        whatsapp: ad.whatsapp || ""
    }));

    const merged = [...immobiliers, ...servicePublications];

    const filtered = merged.filter((item) => {
        const byService = currentServiceFilter === "tous" || item.service === currentServiceFilter;
        const bySearch = !searchText ||
            `${item.title} ${item.location} ${item.description} ${item.service}`.toLowerCase().includes(searchText);
        return byService && bySearch;
    });

    if (!filtered.length) {
        container.innerHTML = "<p class=\"muted-text\">Aucune publication pour ce filtre.</p>";
        return;
    }

    container.innerHTML = filtered.map((item) => {
        const label = item.service.charAt(0).toUpperCase() + item.service.slice(1);
        const action = item.service === "immobilier" && item.whatsapp
            ? `<a href="https://wa.me/${item.whatsapp.replace(/\s/g, "")}" class="btn-whatsapp" target="_blank">Contacter</a>`
            : `<button class="btn btn-secondary news-btn" onclick="showComingSoon('${label}')">Consulter</button>`;

        return `
            <article class="news-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="card-content">
                    <span class="news-tag">${label}</span>
                    <h4 class="card-title">${item.title}</h4>
                    <p class="price">${item.price}</p>
                    <p class="location">${item.location}</p>
                    <p class="muted-text">${item.description}</p>
                    ${action}
                </div>
            </article>
        `;
    }).join("");
}

window.renderNewsFeed = renderNewsFeed;

setActiveFilterButton("tous");
renderNewsFeed();

document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("servicesDropdown");
    const trigger = document.getElementById("servicesNavBtn");
    if (!dropdown || !trigger) return;
    if (dropdown.contains(event.target) || trigger.contains(event.target)) return;
    dropdown.classList.add("hidden");
});
