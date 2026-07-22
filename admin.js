// ==========================================================================
// ADMINISTRATIVE PORTAL INTERACTIONS & SECURITY LITE CONTROL
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initAuthCheck();
});

// 1. Session and Authentication Verification
function initAuthCheck() {
    const sessionUser = sessionStorage.getItem("admin-authenticated-user");
    const loginGate = document.getElementById("login-gate");
    const dashboard = document.getElementById("admin-dashboard");

    if (sessionUser) {
        // Authenticated
        const user = JSON.parse(sessionUser);
        if (loginGate) loginGate.style.display = "none";
        if (dashboard) dashboard.style.display = "block";

        // Setup Header User Information
        const headerUsername = document.getElementById("header-username");
        const headerAvatar = document.getElementById("header-avatar");
        if (headerUsername) headerUsername.textContent = user.name || user.email;
        if (headerAvatar && user.name) {
            headerAvatar.textContent = user.name.charAt(0).toUpperCase();
        }

        // Initialize and Load Data
        loadAdminData();
        renderAdminBookings();
        renderManagers();
    } else {
        // Unauthenticated
        if (loginGate) loginGate.style.display = "block";
        if (dashboard) dashboard.style.display = "none";
    }
}

function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorMsg = document.getElementById("login-error-message");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Fetch managers list
    const managers = JSON.parse(localStorage.getItem("admin-managers")) || [
        { email: "admin@clinica.com", password: "senha123", name: "Administrador Padrão" }
    ];

    const matchingUser = managers.find(m => m.email.toLowerCase() === email && m.password === password);

    if (matchingUser) {
        // Correct Credentials
        sessionStorage.setItem("admin-authenticated-user", JSON.stringify(matchingUser));
        if (errorMsg) errorMsg.style.display = "none";
        
        emailInput.value = "";
        passwordInput.value = "";

        // Recheck Auth and open dashboard
        initAuthCheck();
    } else {
        // Incorrect Credentials
        if (errorMsg) errorMsg.style.display = "block";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

function handleLogout() {
    sessionStorage.removeItem("admin-authenticated-user");
    initAuthCheck();
}

// 2. Tab Navigation
function switchTab(tabName) {
    document.querySelectorAll(".sidebar-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

    const clickedBtn = document.getElementById(`btn-tab-${tabName}`);
    const targetContent = document.getElementById(`tab-${tabName}`);

    if (clickedBtn) clickedBtn.classList.add("active");
    if (targetContent) targetContent.classList.add("active");
}

// 3. Values and FAQ Data Manager
function loadAdminData() {
    const prices = JSON.parse(localStorage.getItem("admin-prices")) || { harmonizacao: 1500, corporal: 800, rejuvenescimento: 1200 };
    const faq = JSON.parse(localStorage.getItem("admin-faq")) || { address: "Av. Paulista, 1000 - Cj. 1201, Jardins, São Paulo - SP", returnPolicy: "A primeira consulta de retorno é gratuita e realizada 15 dias após o procedimento principal para avaliar os resultados e realizar eventuais retoques." };
    const availability = JSON.parse(localStorage.getItem("admin-availability")) || { days: [1, 2, 3, 4, 5], hours: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"] };

    // Prices
    const inputHarmonizacao = document.getElementById("input-price-harmonizacao");
    const inputCorporal = document.getElementById("input-price-corporal");
    const inputRejuvenescimento = document.getElementById("input-price-rejuvenescimento");

    if (inputHarmonizacao) inputHarmonizacao.value = prices.harmonizacao;
    if (inputCorporal) inputCorporal.value = prices.corporal;
    if (inputRejuvenescimento) inputRejuvenescimento.value = prices.rejuvenescimento;

    // FAQ
    const inputAddress = document.getElementById("input-faq-address");
    const inputReturn = document.getElementById("input-faq-return");

    if (inputAddress) inputAddress.value = faq.address;
    if (inputReturn) inputReturn.value = faq.returnPolicy;

    // Availability Days
    for (let i = 1; i <= 6; i++) {
        const chk = document.getElementById(`chk-day-${i}`);
        if (chk) chk.checked = availability.days.includes(i);
    }

    // Availability Hours
    const hoursContainer = document.getElementById("hours-grid-container");
    if (hoursContainer) {
        const allHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
        hoursContainer.innerHTML = "";
        
        allHours.forEach(hour => {
            const label = document.createElement("label");
            label.className = "hour-checkbox-label";
            const checkedStr = availability.hours.includes(hour) ? "checked" : "";
            label.innerHTML = `
                <input type="checkbox" value="${hour}" ${checkedStr} onchange="saveAvailability()"> ${hour}
            `;
            hoursContainer.appendChild(label);
        });
    }
}

function savePrices() {
    const prices = {
        harmonizacao: parseInt(document.getElementById("input-price-harmonizacao").value) || 0,
        corporal: parseInt(document.getElementById("input-price-corporal").value) || 0,
        rejuvenescimento: parseInt(document.getElementById("input-price-rejuvenescimento").value) || 0
    };
    localStorage.setItem("admin-prices", JSON.stringify(prices));
}

function saveFAQ() {
    const faq = {
        address: document.getElementById("input-faq-address").value,
        returnPolicy: document.getElementById("input-faq-return").value
    };
    localStorage.setItem("admin-faq", JSON.stringify(faq));
}

function saveAvailability() {
    const days = [];
    for (let i = 1; i <= 6; i++) {
        const chk = document.getElementById(`chk-day-${i}`);
        if (chk && chk.checked) days.push(i);
    }

    const hours = [];
    const hoursContainer = document.getElementById("hours-grid-container");
    if (hoursContainer) {
        const checkboxes = hoursContainer.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => {
            if (chk.checked) hours.push(chk.value);
        });
    }

    const availability = { days, hours };
    localStorage.setItem("admin-availability", JSON.stringify(availability));
}

// 4. Bookings Manager list
function renderAdminBookings() {
    const bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    const container = document.getElementById("bookings-list-container");

    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `<p class="no-bookings-message" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">Nenhum agendamento ativo.</p>`;
        return;
    }

    container.innerHTML = "";

    const serviceNames = {
        harmonizacao: "Harmonização Facial",
        corporal: "Tratamentos Corporais",
        rejuvenescimento: "Rejuvenescimento Facial"
    };

    bookings.forEach(b => {
        const card = document.createElement("div");
        card.className = "booking-item-card";

        const dateParts = b.date.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        card.innerHTML = `
            <div class="booking-client-info">
                <h4>${b.name}</h4>
                <span>${b.phone} | ${b.email}</span>
            </div>
            <div class="booking-service-badge">
                ${serviceNames[b.service] || b.service}
            </div>
            <div class="booking-time-details">
                <p>${formattedDate}</p>
                <span>às ${b.slot}</span>
            </div>
            <div class="booking-price-details">
                R$ ${b.price}
            </div>
            <div style="text-align: right;">
                <button type="button" class="btn-cancel-booking" onclick="cancelBooking('${b.code}')" style="padding: 4px 8px;">Cancelar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function cancelBooking(code) {
    if (!confirm(`Confirma o cancelamento do agendamento com código ${code}?`)) return;

    let bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    bookings = bookings.filter(b => b.code !== code);
    localStorage.setItem("client-bookings", JSON.stringify(bookings));

    renderAdminBookings();
}

// 5. Manager Users CRUD
function renderManagers() {
    const managers = JSON.parse(localStorage.getItem("admin-managers")) || [];
    const container = document.getElementById("managers-list-container");
    const sessionUser = JSON.parse(sessionStorage.getItem("admin-authenticated-user")) || {};

    if (!container) return;

    container.innerHTML = "";

    managers.forEach(m => {
        const card = document.createElement("div");
        card.className = "manager-card";

        const firstLetter = m.name ? m.name.charAt(0).toUpperCase() : m.email.charAt(0).toUpperCase();
        
        // Hide delete action if manager is currently logged in, or if it is the only manager left
        const isSelf = m.email.toLowerCase() === sessionUser.email.toLowerCase();
        const isOnlyOne = managers.length <= 1;
        const deleteButton = (!isSelf && !isOnlyOne)
            ? `<button type="button" class="btn-remove-manager" onclick="deleteManager('${m.email}')" title="Remover gestor">&times;</button>`
            : '';

        card.innerHTML = `
            <div class="manager-avatar-badge">${firstLetter}</div>
            <div class="manager-profile-details">
                <strong>${m.name || 'Gestor'}</strong>
                <span>${m.email}</span>
            </div>
            ${deleteButton}
        `;
        container.appendChild(card);
    });
}

function addManager(event) {
    event.preventDefault();
    const nameInput = document.getElementById("new-manager-name");
    const emailInput = document.getElementById("new-manager-email");
    const passwordInput = document.getElementById("new-manager-password");
    const errorMsg = document.getElementById("add-manager-error");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const managers = JSON.parse(localStorage.getItem("admin-managers")) || [];
    
    // Check if email already registered
    const emailExists = managers.some(m => m.email.toLowerCase() === email);
    if (emailExists) {
        if (errorMsg) {
            errorMsg.textContent = "Erro: Este e-mail já está cadastrado.";
            errorMsg.style.display = "block";
        }
        return;
    }

    // Add manager
    managers.push({ name, email, password });
    localStorage.setItem("admin-managers", JSON.stringify(managers));

    // Reset Form & UI
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    if (errorMsg) errorMsg.style.display = "none";

    renderManagers();
}

function deleteManager(email) {
    if (!confirm(`Tem certeza que deseja remover o acesso do gestor ${email}?`)) return;

    let managers = JSON.parse(localStorage.getItem("admin-managers")) || [];
    managers = managers.filter(m => m.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem("admin-managers", JSON.stringify(managers));

    renderManagers();
}

// Global functions exposed to window object for inline HTML event handlers
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.switchTab = switchTab;
window.savePrices = savePrices;
window.saveFAQ = saveFAQ;
window.saveAvailability = saveAvailability;
window.cancelBooking = cancelBooking;
window.addManager = addManager;
window.deleteManager = deleteManager;
