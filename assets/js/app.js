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

const PUBLICATIONS_COLLECTION = "annonces";
const SERVICE_LABELS = {
    immobilier: "Immobilier",
    art: "Art",
    deal: "Deal",
    courses: "Courses",
    location: "Location"
};
const SERVICE_RULES = {
    immobilier: {
        hint: "Immobilier : ajoute un quartier, une categorie claire et un prix precis.",
        required: ["area", "category"]
    },
    art: {
        hint: "Art : precise le type d'oeuvre (peinture, design, NFT...) et une description detaillee.",
        required: ["category"]
    },
    deal: {
        hint: "Deal : decris clairement ce que tu proposes et ce que tu recherches.",
        required: ["description"]
    },
    courses: {
        hint: "Courses : indique la zone desservie et le type de course disponible.",
        required: ["area"]
    },
    location: {
        hint: "Location : precise la duree, la zone et le type de bien a louer.",
        required: ["area", "category"]
    }
};

let allPublications = [];
let currentUser = null;
let currentServiceFilter = "tous";
let confirmationResult = null;
let fallbackListenerAttached = false;

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
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || password.length < 6) {
        alert("Email et mot de passe (6 caracteres minimum) requis.");
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
        alert("SMS envoye.");
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
        renderUserAds();
    }
});

window.logout = () => signOut(auth).then(() => location.reload());

window.deleteAccount = async () => {
    if (!currentUser) return;
    const confirmDelete = confirm("Voulez-vous vraiment supprimer votre compte ?");
    if (!confirmDelete) return;

    try {
        await deleteUser(currentUser);
        alert("Compte supprime.");
        location.reload();
    } catch (error) {
        alert("Erreur : " + error.code);
    }
};

// Schema cible (prepare SQL): service, title, price, city, area, category, description, contact, imageUrl, ownerId, createdAt
window.publishAd = async () => {
    const service = document.getElementById("publishService").value;
    const title = document.getElementById("publishTitle").value.trim();
    const price = document.getElementById("publishPrice").value.trim();
    const city = document.getElementById("publishCity").value;
    const area = document.getElementById("publishArea").value.trim();
    const category = document.getElementById("publishCategory").value.trim();
    const description = document.getElementById("publishDescription").value.trim();
    const contact = normalizeContact(document.getElementById("publishContact").value);
    const imageFile = document.getElementById("publishImageFile").files[0];
    const btn = document.getElementById("btnPublish");

    if (!currentUser) {
        alert("Connectez-vous avant de publier.");
        return;
    }

    if (!title || !price || !description || !contact || !imageFile) {
        alert("Veuillez renseigner les champs obligatoires.");
        return;
    }

    const rules = SERVICE_RULES[service];
    if (rules?.required.includes("area") && !area) {
        alert("Ce service demande une zone/quartier.");
        return;
    }
    if (rules?.required.includes("category") && !category) {
        alert("Ce service demande une categorie.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Mise en ligne...";

    try {
        const fd = new FormData();
        fd.append("image", imageFile);
        const uploadRes = await fetch("https://api.imgbb.com/1/upload?key=93de062740df77fd3461e203d8184f4a", {
            method: "POST",
            body: fd
        });
        const uploadData = await uploadRes.json();
        const imageUrl = uploadData?.data?.url;

        if (!imageUrl) {
            throw new Error("IMAGE_UPLOAD_FAILED");
        }

        const payload = {
            service,
            title,
            price,
            city,
            area,
            category,
            description,
            contact,
            imageUrl,
            ownerId: currentUser.uid,
            ownerEmail: currentUser.email || "",
            schemaVersion: 1,
            source: "web",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, PUBLICATIONS_COLLECTION), payload);

        resetPublishForm();
        // Evite l'impression de "publication disparue" si un filtre/recherche etait actif.
        currentServiceFilter = "tous";
        const select = document.getElementById("serviceFilter");
        if (select) select.value = "tous";
        const searchInput = document.getElementById("newsSearch");
        if (searchInput) searchInput.value = "";
        setActiveFilterButton("tous");
        // Affichage optimiste immediat, sans attendre la propagation du listener.
        upsertPublication(normalizePublication(docRef.id, payload));
        alert("Publication enregistree.");
        showSec("secServices");
        document.getElementById("liveUserFeedSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
        renderNewsFeed();
        renderLiveUserFeed();
        renderUserAds();
    } catch (error) {
        alert("Erreur de publication : " + (error.code || error.message || "reseau"));
    } finally {
        btn.disabled = false;
        btn.innerText = "Mettre en ligne l'annonce";
    }
};

attachPublicationsListener();

function attachPublicationsListener() {
    const ref = collection(db, PUBLICATIONS_COLLECTION);
    const ordered = query(ref, orderBy("createdAt", "desc"));

    onSnapshot(ordered, (snap) => {
        hydratePublicationsFromSnapshot(snap);
    }, () => {
        if (fallbackListenerAttached) return;
        fallbackListenerAttached = true;
        onSnapshot(ref, (snap) => {
            hydratePublicationsFromSnapshot(snap);
        });
    });
}

function hydratePublicationsFromSnapshot(snap) {
    allPublications = snap.docs.map((docRef) => normalizePublication(docRef.id, docRef.data()));
    sortPublications();
    renderNewsFeed();
    renderLiveUserFeed();
    renderUserAds();
}

function normalizePublication(id, data) {
    const service = (data.service || "immobilier").toLowerCase();
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

    // Compatibilite avec anciens documents immobiliers deja stockes
    return {
        id,
        service,
        title: data.title || data.titre || "Publication",
        price: data.price || data.prix || "Prix sur demande",
        city: data.city || data.ville || "",
        area: data.area || data.quartier || "",
        category: data.category || data.type || "",
        description: data.description || data.type || "",
        contact: data.contact || data.whatsapp || "",
        imageUrl: data.imageUrl || data.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
        ownerId: data.ownerId || data.uid || "",
        createdAt
    };
}

function upsertPublication(item) {
    const index = allPublications.findIndex((p) => p.id === item.id);
    if (index >= 0) {
        allPublications[index] = item;
    } else {
        allPublications.unshift(item);
    }
    sortPublications();
}

function sortPublications() {
    allPublications.sort((a, b) => {
        const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const db = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return db - da;
    });
}

function setActiveFilterButton(value) {
    const buttons = document.querySelectorAll(".filters .filter-btn");
    buttons.forEach((button) => {
        const isMatch = button.getAttribute("onclick").includes(`'${value}'`);
        if (isMatch) button.classList.add("active-filter");
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

    const userItems = allPublications.filter((item) => item.ownerId === currentUser.uid);
    if (!userItems.length) {
        container.innerHTML = "<p class=\"muted-text\">Aucune publication pour le moment.</p>";
        return;
    }

    container.innerHTML = userItems.map((item) => `
        <article class="news-card">
            <img src="${item.imageUrl}" alt="${item.title}">
            <div class="card-content">
                <span class="news-tag">${serviceLabel(item.service)}</span>
                <h4 class="card-title">${item.title}</h4>
                <p class="price">${item.price}</p>
                <p class="location">${item.area ? `${item.area}, ` : ""}${item.city}</p>
                <p class="muted-text">${item.description}</p>
                <p class="news-time">Publie le ${formatCreatedAt(item.createdAt)}</p>
            </div>
        </article>
    `).join("");
}

function renderNewsFeed() {
    const container = document.getElementById("newsFeed");
    if (!container) return;

    const searchText = (document.getElementById("newsSearch")?.value || "").trim().toLowerCase();
    const filtered = allPublications.filter((item) => {
        const matchesService = currentServiceFilter === "tous" || item.service === currentServiceFilter;
        const blob = `${item.title} ${item.city} ${item.area} ${item.category} ${item.description} ${item.service}`.toLowerCase();
        const matchesSearch = !searchText || blob.includes(searchText);
        return matchesService && matchesSearch;
    });

    if (!filtered.length) {
        container.innerHTML = "<p class=\"muted-text\">Aucune publication pour ce filtre.</p>";
        return;
    }

    container.innerHTML = filtered.map((item) => {
        const contactAction = item.contact
            ? `<a href="${whatsappUrl(item.contact)}" class="btn-whatsapp" target="_blank">Contacter</a>`
            : `<button class="btn btn-secondary news-btn" onclick="showComingSoon('${serviceLabel(item.service)}')">Consulter</button>`;

        return `
            <article class="news-card">
                <img src="${item.imageUrl}" alt="${item.title}">
                <div class="card-content">
                    <span class="news-tag">${serviceLabel(item.service)}</span>
                    <h4 class="card-title">${item.title}</h4>
                    <p class="price">${item.price}</p>
                    <p class="location">${item.area ? `${item.area}, ` : ""}${item.city}</p>
                    <p class="muted-text">${item.description}</p>
                    <p class="news-time">Publie le ${formatCreatedAt(item.createdAt)}</p>
                    ${contactAction}
                </div>
            </article>
        `;
    }).join("");
}

function renderLiveUserFeed() {
    const container = document.getElementById("liveUserFeed");
    const countNode = document.getElementById("liveUserCount");
    if (!container || !countNode) return;

    const userItems = allPublications
        .filter((item) => Boolean(item.ownerId))
        .slice(0, 8);

    countNode.innerText = String(userItems.length);

    if (!userItems.length) {
        container.innerHTML = "<p class=\"muted-text\">Aucune publication utilisateur en direct pour le moment.</p>";
        return;
    }

    container.innerHTML = userItems.map((item) => `
        <article class="live-item">
            <span class="news-tag">${serviceLabel(item.service)}</span>
            <h4 class="live-item-title">${item.title}</h4>
            <p class="live-item-meta">${item.area ? `${item.area}, ` : ""}${item.city}</p>
            <p class="live-item-meta">Publie le ${formatCreatedAt(item.createdAt)}</p>
        </article>
    `).join("");
}

function serviceLabel(serviceKey) {
    return SERVICE_LABELS[serviceKey] || "Service";
}

function resetPublishForm() {
    document.getElementById("publishTitle").value = "";
    document.getElementById("publishPrice").value = "";
    document.getElementById("publishArea").value = "";
    document.getElementById("publishCategory").value = "";
    document.getElementById("publishDescription").value = "";
    document.getElementById("publishContact").value = "";
    document.getElementById("publishImageFile").value = "";
}

function normalizeContact(value) {
    return String(value ?? "").replace(/[^\d]/g, "");
}

function whatsappUrl(contact) {
    const clean = normalizeContact(contact);
    return `https://wa.me/${clean}`;
}

function formatCreatedAt(dateValue) {
    if (!dateValue || !(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
        return "date inconnue";
    }
    return dateValue.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    });
}

function updatePublishHint() {
    const service = document.getElementById("publishService")?.value || "immobilier";
    const hintNode = document.getElementById("publishHint");
    if (!hintNode) return;
    hintNode.innerText = SERVICE_RULES[service]?.hint || "";
}

setActiveFilterButton("tous");
renderNewsFeed();
renderLiveUserFeed();
updatePublishHint();

document.getElementById("publishService")?.addEventListener("change", updatePublishHint);

document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("servicesDropdown");
    const trigger = document.getElementById("servicesNavBtn");
    if (!dropdown || !trigger) return;
    if (dropdown.contains(event.target) || trigger.contains(event.target)) return;
    dropdown.classList.add("hidden");
});
