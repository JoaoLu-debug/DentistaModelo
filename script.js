// ==========================================================================
// PREMIUM REFRACTIVE INTERACTION LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    init3DTiltAndSpotlight();
    initDiagnosticSimulator();
    initScrollAnimations();
    initLocalDatabase();
    initBookingWizard();
    initAIChatbot();
    initAdminPanel();
});

// 1. Theme Management (Pearlescent Light vs Midnight Obsidian)
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load preference
    const savedTheme = localStorage.getItem("premium-theme") || "light";
    body.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("premium-theme", newTheme);
        
        // Refresh diagnostic results output layout if active
        calculateDiagnostic();
    });
}

// 2. Mobile Navigation Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    mobileToggle.addEventListener("click", () => {
        mobileToggle.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileToggle.classList.remove("active");
            navMenu.classList.remove("active");
            
            // Set active class
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

// 3. 3D Tilt Cards & Cursor Spotlight Tracking
function init3DTiltAndSpotlight() {
    // Ignore 3D tilt on mobile touch devices for smooth native scrolling
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside element
            const y = e.clientY - rect.top;  // y position inside element
            
            const width = rect.width;
            const height = rect.height;
            
            // Normalized values (-0.5 to 0.5)
            const normX = x / width;
            const normY = y / height;
            
            // Compute rotation values (max 15 degrees)
            const rotateX = (0.5 - normY) * 15;
            const rotateY = (normX - 0.5) * 15;
            
            // Update inline transform style
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Set custom properties for spotlight gradient
            const percentX = (x / width) * 100;
            const percentY = (y / height) * 100;
            card.style.setProperty("--mouse-x", `${percentX}%`);
            card.style.setProperty("--mouse-y", `${percentY}%`);
        });

        card.addEventListener("mouseleave", () => {
            // Smoothly reset transformations when cursor exits
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            card.style.removeProperty("--mouse-x");
            card.style.removeProperty("--mouse-y");
        });
    });
}

// 4. Interactive Skin Diagnostic Simulator
let recommendedTreatments = [];

function initDiagnosticSimulator() {
    const sliderFirmeza = document.getElementById("slider-firmeza");
    const sliderRugas = document.getElementById("slider-rugas");
    const sliderVico = document.getElementById("slider-vico");

    const valFirmeza = document.getElementById("val-firmeza");
    const valRugas = document.getElementById("val-rugas");
    const valVico = document.getElementById("val-vico");

    if (sliderFirmeza && sliderRugas && sliderVico) {
        // Event listeners to update metrics display
        sliderFirmeza.addEventListener("input", (e) => {
            valFirmeza.textContent = `${e.target.value}%`;
            calculateDiagnostic();
        });
        sliderRugas.addEventListener("input", (e) => {
            valRugas.textContent = `${e.target.value}%`;
            calculateDiagnostic();
        });
        sliderVico.addEventListener("input", (e) => {
            valVico.textContent = `${e.target.value}%`;
            calculateDiagnostic();
        });

        // Run initial calculation
        calculateDiagnostic();
    }
}

function calculateDiagnostic() {
    const firmeza = parseInt(document.getElementById("slider-firmeza").value);
    const rugas = parseInt(document.getElementById("slider-rugas").value);
    const vico = parseInt(document.getElementById("slider-vico").value);

    const resultBox = document.getElementById("treatment-results-box");
    
    // Core decision tree for recommendations
    recommendedTreatments = [];
    
    if (firmeza >= 60) {
        recommendedTreatments.push({
            title: "Bioestimuladores de Colágeno (Radiesse/Sculptra)",
            desc: "Indicado para reestruturar as camadas profundas e combater a flacidez com estímulo de colágeno natural por até 2 anos.",
            tag: "Sustentação"
        });
        recommendedTreatments.push({
            title: "Ultrassom Microfocado (Liftera)",
            desc: "Lifting não-cirúrgico atuando no músculo facial para tração e ancoragem de tecidos.",
            tag: "Tecnologia"
        });
    }
    
    if (rugas >= 50) {
        recommendedTreatments.push({
            title: "Toxina Botulínica Premium",
            desc: "Perfeito para suavizar marcas de expressão e rugas na testa, glabela e olhos de forma natural.",
            tag: "Linhas"
        });
        recommendedTreatments.push({
            title: "Preenchimento com Ácido Hialurônico",
            desc: "Restauração de volumes perdidos (olheiras, malar) e definição do contorno da mandíbula.",
            tag: "Volumização"
        });
    }
    
    if (vico >= 50) {
        recommendedTreatments.push({
            title: "Peeling Químico de Luxo",
            desc: "Renovação celular intensa para uniformizar a textura, clarear manchas e fechar poros.",
            tag: "Textura"
        });
        recommendedTreatments.push({
            title: "Microagulhamento com Drug Delivery",
            desc: "Canalização de ativos rejuvenescedores e ácido hialurônico de baixo peso molecular.",
            tag: "Luminosidade"
        });
    }
    
    // Fallback if all values are low/preventive
    if (recommendedTreatments.length === 0) {
        recommendedTreatments.push({
            title: "Protocolo Preventivo Glow de Colágeno",
            desc: "Uma associação de hidratação injetável profunda (Skinbooster) e peeling superficial iluminador para manter a juventude celular.",
            tag: "Prevenção"
        });
    }

    // Render preview results inside card
    if (resultBox) {
        resultBox.innerHTML = "";
        
        // Render up to 2 items in the small preview box
        recommendedTreatments.slice(0, 2).forEach(treatment => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "result-item";
            itemDiv.innerHTML = `
                <h4>${treatment.title}</h4>
                <p>${treatment.desc}</p>
            `;
            resultBox.appendChild(itemDiv);
        });
    }
}

// 5. Drawer Opening/Closing animations
function openDrawer(id) {
    // Close any other drawers first
    closeAllDrawers();

    const overlay = document.getElementById("drawer-overlay");
    const drawer = document.getElementById(`drawer-${id}`);

    if (overlay && drawer) {
        overlay.classList.add("active");
        drawer.classList.add("active");
        document.body.style.overflow = "hidden"; // disable scroll
    }
}

function closeAllDrawers() {
    const overlay = document.getElementById("drawer-overlay");
    const drawers = document.querySelectorAll(".drawer");

    if (overlay) overlay.classList.remove("active");
    drawers.forEach(drawer => drawer.classList.remove("active"));
    document.body.style.overflow = ""; // restore scroll
}

// Dynamic configuration for full diagnostic drawer report
function openDiagnosticDrawer() {
    const firmeza = document.getElementById("slider-firmeza").value;
    const rugas = document.getElementById("slider-rugas").value;
    const vico = document.getElementById("slider-vico").value;

    const summaryText = document.getElementById("diag-summary-text");
    const detailsList = document.getElementById("diag-details-list");

    if (summaryText && detailsList) {
        summaryText.innerHTML = `Níveis avaliados: Flacidez: <strong>${firmeza}%</strong> | Sinais: <strong>${rugas}%</strong> | Textura: <strong>${vico}%</strong>`;
        
        detailsList.innerHTML = "";
        recommendedTreatments.forEach(t => {
            const detailCard = document.createElement("div");
            detailCard.className = "diag-detail-card";
            detailCard.innerHTML = `
                <span class="drawer-tag">${t.tag}</span>
                <h4>${t.title}</h4>
                <p>${t.desc}</p>
            `;
            detailsList.appendChild(detailCard);
        });

        openDrawer("diagnostic");
    }
}

// Format API string and send structured text to Dra. WhatsApp
function sendDiagnosticToWhatsApp() {
    const firmeza = document.getElementById("slider-firmeza").value;
    const rugas = document.getElementById("slider-rugas").value;
    const vico = document.getElementById("slider-vico").value;
    
    let treatmentsText = recommendedTreatments.map(t => `- ${t.title}`).join("%0A");
    
    let message = `Olá! Fiz a Auto-Avaliação Estética no site e gostaria de agendar uma consulta.%0A%0AMeus resultados indicados:%0A- Flacidez/Sustentação: ${firmeza}%25%0A- Sinais de Idade: ${rugas}%25%0A- Textura/Viço: ${vico}%25%0A%0AIndicação de Tratamentos:%0A${treatmentsText}`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, "_blank");
}

// 6. Contact Form Submission (tactile responsive state animation)
function handleFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById("contact-form");
    const successMsg = document.getElementById("form-success");
    const submitBtn = document.getElementById("btn-submit-form");

    // Animate button state
    submitBtn.classList.add("btn-loading");
    submitBtn.querySelector("span").textContent = "Enviando...";

    // Simulate server request
    setTimeout(() => {
        form.style.display = "none";
        successMsg.style.display = "block";
    }, 1200);
}

// 7. Scroll Driven Animations
function initScrollAnimations() {
    // Add scroll listener to header to shrink and increase blur on scroll
    const header = document.querySelector(".main-header");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.top = "12px";
            header.style.height = "68px";
            header.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.08)";
        } else {
            header.style.top = "24px";
            header.style.height = "76px";
            header.style.boxShadow = "";
        }
    });
}

// ==========================================================================
// 8. Local Storage Database Management
// ==========================================================================
function initLocalDatabase() {
    // Initial Defaults
    const defaultPrices = {
        harmonizacao: 1500,
        corporal: 800,
        rejuvenescimento: 1200
    };

    const defaultAvailability = {
        days: [1, 2, 3, 4, 5], // Monday - Friday
        hours: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    };

    const defaultFAQ = {
        address: "Av. Paulista, 1000 - Cj. 1201, Jardins, São Paulo - SP",
        returnPolicy: "A primeira consulta de retorno é gratuita e realizada 15 dias após o procedimento principal para avaliar os resultados e realizar eventuais retoques."
    };

    if (!localStorage.getItem("admin-prices")) {
        localStorage.setItem("admin-prices", JSON.stringify(defaultPrices));
    }
    if (!localStorage.getItem("admin-availability")) {
        localStorage.setItem("admin-availability", JSON.stringify(defaultAvailability));
    }
    if (!localStorage.getItem("admin-faq")) {
        localStorage.setItem("admin-faq", JSON.stringify(defaultFAQ));
    }
    if (!localStorage.getItem("client-bookings")) {
        localStorage.setItem("client-bookings", JSON.stringify([]));
    }
    if (!localStorage.getItem("admin-pin")) {
        localStorage.setItem("admin-pin", "1234");
    }

    // Apply active prices to visual cards in wizard
    syncWizardPrices();
}

function syncWizardPrices() {
    const prices = JSON.parse(localStorage.getItem("admin-prices"));
    const priceHarmonizacao = document.getElementById("book-price-harmonizacao");
    const priceCorporal = document.getElementById("book-price-corporal");
    const priceRejuvenescimento = document.getElementById("book-price-rejuvenescimento");

    if (priceHarmonizacao) priceHarmonizacao.textContent = `A partir de R$ ${prices.harmonizacao}`;
    if (priceCorporal) priceCorporal.textContent = `A partir de R$ ${prices.corporal}`;
    if (priceRejuvenescimento) priceRejuvenescimento.textContent = `A partir de R$ ${prices.rejuvenescimento}`;
}

// ==========================================================================
// 9. Online Booking Wizard Logic
// ==========================================================================
let bookingState = {
    step: 1,
    service: 'harmonizacao',
    date: '',
    slot: '',
    price: 1500
};

function initBookingWizard() {
    // Set Date input minimum value to today
    const dateInput = document.getElementById("booking-date");
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function updateBookingServiceSelection() {
    const radios = document.getElementsByName("booking-service");
    for (let r of radios) {
        if (r.checked) {
            bookingState.service = r.value;
            break;
        }
    }
}

function goToBookingStep(step) {
    if (step === 2) {
        updateBookingServiceSelection();
        // Check active prices
        const prices = JSON.parse(localStorage.getItem("admin-prices"));
        bookingState.price = prices[bookingState.service];
    }
    
    if (step === 3) {
        // Validation: Date & Time slot must be chosen
        if (!bookingState.date) {
            alert("Por favor, selecione uma data.");
            return;
        }
        if (!bookingState.slot) {
            alert("Por favor, selecione um horário.");
            return;
        }

        // Render Summary Ticket
        const serviceTitles = {
            harmonizacao: "Harmonização Facial",
            corporal: "Tratamentos Corporais",
            rejuvenescimento: "Rejuvenescimento Facial"
        };

        const serviceTitle = document.getElementById("summary-service-title");
        const summaryDatetime = document.getElementById("summary-datetime");
        const summaryPrice = document.getElementById("summary-price");

        if (serviceTitle) serviceTitle.textContent = serviceTitles[bookingState.service];
        if (summaryPrice) summaryPrice.textContent = `R$ ${bookingState.price}`;
        
        // Format Date
        const dateParts = bookingState.date.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        if (summaryDatetime) summaryDatetime.innerHTML = `Agendado para: <strong>${formattedDate} às ${bookingState.slot}</strong>`;
    }

    // Toggle dots
    document.querySelectorAll(".wizard-steps .step").forEach(dot => dot.classList.remove("active", "completed"));
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        if (i < step) {
            dot.classList.add("completed");
        } else if (i === step) {
            dot.classList.add("active");
        }
    }

    // Toggle tabs
    document.querySelectorAll(".wizard-tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById(`booking-step-${step}`).classList.add("active");
    
    bookingState.step = step;
}

function renderAvailableSlots() {
    const dateInput = document.getElementById("booking-date");
    const slotsContainer = document.getElementById("booking-slots-container");
    
    if (!dateInput || !slotsContainer) return;

    bookingState.date = dateInput.value;
    bookingState.slot = ""; // Reset chosen slot

    if (!bookingState.date) {
        slotsContainer.innerHTML = `<p class="no-slots-message">Selecione uma data para ver os horários.</p>`;
        return;
    }

    // Check Day of Week availability
    const selectedDay = new Date(bookingState.date + 'T00:00:00').getDay(); // 0 is Sunday, 1 is Monday, etc.
    const availability = JSON.parse(localStorage.getItem("admin-availability"));
    
    if (!availability.days.includes(selectedDay)) {
        slotsContainer.innerHTML = `<p class="no-slots-message" style="color: #e74c3c;">A clínica não realiza atendimentos online neste dia da semana.</p>`;
        return;
    }

    // Get Booked Hours for this date
    const bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    const bookedSlotsOnDate = bookings
        .filter(b => b.date === bookingState.date)
        .map(b => b.slot);

    slotsContainer.innerHTML = "";

    const availableHours = availability.hours.filter(h => !bookedSlotsOnDate.includes(h));

    if (availableHours.length === 0) {
        slotsContainer.innerHTML = `<p class="no-slots-message" style="color: #e74c3c;">Desculpe, todos os horários deste dia já estão agendados.</p>`;
        return;
    }

    availableHours.forEach(hour => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "slot-btn";
        btn.textContent = hour;
        btn.onclick = () => {
            document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            bookingState.slot = hour;
        };
        slotsContainer.appendChild(btn);
    });
}

function submitBooking(event) {
    event.preventDefault();

    const name = document.getElementById("booking-name").value;
    const phone = document.getElementById("booking-phone").value;
    const email = document.getElementById("booking-email").value;

    if (!name || !phone || !email) {
        alert("Preencha todos os campos.");
        return;
    }

    // Generate random booking code
    const code = "#" + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Create booking object
    const newBooking = {
        code,
        name,
        phone,
        email,
        service: bookingState.service,
        date: bookingState.date,
        slot: bookingState.slot,
        price: bookingState.price
    };

    // Save to Local DB
    const bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    bookings.push(newBooking);
    localStorage.setItem("client-bookings", JSON.stringify(bookings));

    // Render receipt details
    const serviceNames = {
        harmonizacao: "Harmonização Facial",
        corporal: "Tratamentos Corporais",
        rejuvenescimento: "Rejuvenescimento Facial"
    };

    const dateParts = bookingState.date.split('-');
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    document.getElementById("receipt-code").textContent = code;
    document.getElementById("receipt-service").textContent = serviceNames[bookingState.service];
    document.getElementById("receipt-datetime").textContent = `${formattedDate} às ${bookingState.slot}`;
    document.getElementById("receipt-price").textContent = `R$ ${bookingState.price}`;

    // Switch tab to success screen
    document.querySelectorAll(".wizard-tab").forEach(tab => tab.classList.remove("active"));
    document.getElementById("booking-step-success").classList.add("active");

    // Sync admin bookings view
    renderAdminBookings();
    
    // Reset wizard fields
    document.getElementById("booking-form").reset();
    document.getElementById("booking-date").value = "";
    document.getElementById("booking-slots-container").innerHTML = `<p class="no-slots-message">Selecione uma data para ver os horários.</p>`;
}

// ==========================================================================
// 10. AI Chatbot Concierge Logic
// ==========================================================================
function initAIChatbot() {
    const trigger = document.getElementById("chat-trigger");
    const closeBtn = document.getElementById("chat-close-btn");
    const windowEl = document.getElementById("chat-window");

    if (trigger && closeBtn && windowEl) {
        trigger.addEventListener("click", () => {
            windowEl.classList.toggle("active");
            document.getElementById("chat-badge-bubble").style.display = "none"; // hide unread badge
        });

        closeBtn.addEventListener("click", () => {
            windowEl.classList.remove("active");
        });
    }
}

function openBookingFromChat() {
    const windowEl = document.getElementById("chat-window");
    if (windowEl) windowEl.classList.remove("active");
    openDrawer("booking");
}

function sendQuickMessage(text) {
    appendChatMessage(text, "user");
    generateAIResponse(text);
}

function handleChatSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("chat-input-field");
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(text, "user");
    input.value = "";
    generateAIResponse(text);
}

function appendChatMessage(text, sender) {
    const container = document.getElementById("chat-messages");
    if (!container) return;

    const msg = document.createElement("div");
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = `<p>${text}</p>`;
    container.appendChild(msg);

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(query) {
    const container = document.getElementById("chat-messages");
    if (!container) return;

    // Show Typing Indicator
    const typing = document.createElement("div");
    typing.className = "chat-msg bot typing-indicator";
    typing.innerHTML = `<p style="font-style: italic; color: var(--color-text-secondary);">Digitando...</p>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
        // Remove typing indicator
        typing.remove();
        
        const responseText = getAIResponseText(query);
        appendChatMessage(responseText, "bot");
    }, 800);
}

function getAIResponseText(query) {
    const clean = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Fetch local settings
    const prices = JSON.parse(localStorage.getItem("admin-prices"));
    const faq = JSON.parse(localStorage.getItem("admin-faq"));
    const availability = JSON.parse(localStorage.getItem("admin-availability"));

    // Services match
    if (clean.includes("servico") || clean.includes("tratamento") || clean.includes("procedimento") || clean.includes("faz") || clean.includes("oferece")) {
        return `Nossos procedimentos exclusivos de estética incluem:<br>
        1. <strong>Harmonização Facial:</strong> Técnicas sob medida para equilibrar os contornos.<br>
        2. <strong>Tratamentos Corporais:</strong> Redução de medidas e firmeza cutânea.<br>
        3. <strong>Rejuvenescimento Facial:</strong> Foco em viço e produção natural de colágeno.`;
    }

    // Prices match
    if (clean.includes("preco") || clean.includes("custo") || clean.includes("valor") || clean.includes("quanto") || clean.includes("orcamento") || clean.includes("pagar")) {
        if (clean.includes("harmoniza")) {
            return `A <strong>Harmonização Facial</strong> no Seu Site está configurada a partir de R$ ${prices.harmonizacao}. O valor definitivo depende da avaliação.`;
        }
        if (clean.includes("corporal") || clean.includes("corpo")) {
            return `Nossos <strong>Tratamentos Corporais</strong> de alta performance partem de R$ ${prices.corporal}.`;
        }
        if (clean.includes("rejuvenesc") || clean.includes("colageno") || clean.includes("laser") || clean.includes("peeling")) {
            return `O <strong>Rejuvenescimento Facial</strong> está a partir de R$ ${prices.rejuvenescimento} no momento.`;
        }
        return `Aqui estão os valores básicos de nossos tratamentos:<br>
        - Harmonização Facial: A partir de R$ ${prices.harmonizacao}<br>
        - Tratamentos Corporais: A partir de R$ ${prices.corporal}<br>
        - Rejuvenescimento Facial: A partir de R$ ${prices.rejuvenescimento}<br><br>
        Deseja realizar o agendamento de algum deles diretamente? Clique no chip "Agendar Direto" acima!`;
    }

    // Availability / Hours match
    if (clean.includes("horario") || clean.includes("agenda") || clean.includes("data") || clean.includes("dia") || clean.includes("consulta") || clean.includes("marcar") || clean.includes("livre") || clean.includes("vaga")) {
        const daysMap = { 1: "Segunda", 2: "Terça", 3: "Quarta", 4: "Quinta", 5: "Sexta", 6: "Sábado", 0: "Domingo" };
        const activeDays = availability.days.map(d => daysMap[d]).join(", ");
        return `Atendemos nos dias: <strong>${activeDays}</strong>.<br>
        Você pode ver todos os horários livres e escolher o seu diretamente na nossa agenda integrada clicando no botão <strong>'Agendar Direto'</strong> acima!`;
    }

    // Address match
    if (clean.includes("onde") || clean.includes("endereco") || clean.includes("fica") || clean.includes("local") || clean.includes("rua") || clean.includes("bairro") || clean.includes("clinica")) {
        return `Nossa clínica exclusiva está localizada no endereço:<br><strong>${faq.address}</strong>.`;
    }

    // Return policy match
    if (clean.includes("retorno") || clean.includes("retocar") || clean.includes("retoque") || clean.includes("revisao")) {
        return faq.returnPolicy;
    }

    // Greetings
    if (clean.includes("ola") || clean.includes("oi") || clean.includes("bom dia") || clean.includes("boa tarde") || clean.includes("boa noite")) {
        return `Olá! Como posso ajudar você hoje? Posso passar detalhes de serviços, custos, endereço ou ajudar no agendamento.`;
    }

    // Fallback default
    return `Entendi sua dúvida. Como sou uma assistente virtual, consigo passar informações programadas sobre serviços, custos mínimos (Harmonização: R$ ${prices.harmonizacao}), localização ou sobre agendamentos de consulta.<br><br>Gostaria de agendar um horário sem fila? Clique no chip <strong>'Agendar Direto'</strong>!`;
}

// ==========================================================================
// 11. Professional Administrative Control Panel Logic
// ==========================================================================
function initAdminPanel() {
    loadAdminData();
    renderAdminBookings();
    updateAdminPanelVisibility();
}

function updateAdminPanelVisibility() {
    const loginGate = document.getElementById("admin-login-gate");
    const dashboardView = document.getElementById("admin-dashboard-view");
    
    if (!loginGate || !dashboardView) return;

    if (sessionStorage.getItem("admin-authenticated") === "true") {
        loginGate.style.display = "none";
        dashboardView.style.display = "block";
    } else {
        loginGate.style.display = "block";
        dashboardView.style.display = "none";
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const input = document.getElementById("admin-passcode");
    const errorMsg = document.getElementById("admin-login-error");
    
    if (!input) return;

    const enteredPin = input.value;
    const correctPin = localStorage.getItem("admin-pin") || "1234";

    if (enteredPin === correctPin) {
        sessionStorage.setItem("admin-authenticated", "true");
        if (errorMsg) errorMsg.style.display = "none";
        input.value = "";
        updateAdminPanelVisibility();
    } else {
        if (errorMsg) errorMsg.style.display = "block";
        input.value = "";
        input.focus();
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem("admin-authenticated");
    updateAdminPanelVisibility();
}

function switchAdminTab(tabName) {
    document.querySelectorAll(".admin-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".admin-tab-content").forEach(content => content.classList.remove("active"));

    document.getElementById(`btn-tab-${tabName}`).classList.add("active");
    document.getElementById(`admin-tab-${tabName}`).classList.add("active");
}

function loadAdminData() {
    const prices = JSON.parse(localStorage.getItem("admin-prices"));
    const faq = JSON.parse(localStorage.getItem("admin-faq"));
    const availability = JSON.parse(localStorage.getItem("admin-availability"));

    // Populate tab 1: Prices & FAQ
    if (prices) {
        document.getElementById("admin-price-harmonizacao").value = prices.harmonizacao;
        document.getElementById("admin-price-corporal").value = prices.corporal;
        document.getElementById("admin-price-rejuvenescimento").value = prices.rejuvenescimento;
    }
    if (faq) {
        document.getElementById("admin-faq-endereco").value = faq.address;
        document.getElementById("admin-faq-retorno").value = faq.returnPolicy;
    }

    // Populate tab 2: Availability
    if (availability) {
        // days checkboxes (1 to 6)
        for (let i = 1; i <= 6; i++) {
            const chk = document.getElementById(`check-day-${i}`);
            if (chk) chk.checked = availability.days.includes(i);
        }

        // hours rendering
        const hoursContainer = document.getElementById("admin-hours-container");
        if (hoursContainer) {
            const allHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
            hoursContainer.innerHTML = "";
            
            allHours.forEach(hour => {
                const label = document.createElement("label");
                label.className = "hour-checkbox-label";
                const checkedStr = availability.hours.includes(hour) ? "checked" : "";
                label.innerHTML = `
                    <input type="checkbox" value="${hour}" ${checkedStr} onchange="saveAdminAvailability()"> ${hour}
                `;
                hoursContainer.appendChild(label);
            });
        }
    }
}

function saveAdminPrices() {
    const prices = {
        harmonizacao: parseInt(document.getElementById("admin-price-harmonizacao").value) || 0,
        corporal: parseInt(document.getElementById("admin-price-corporal").value) || 0,
        rejuvenescimento: parseInt(document.getElementById("admin-price-rejuvenescimento").value) || 0
    };

    localStorage.setItem("admin-prices", JSON.stringify(prices));
    
    // Sync UI elements
    syncWizardPrices();
}

// Global functions exposed to window object for inline HTML event handlers
window.openBookingFromChat = openBookingFromChat;
window.sendQuickMessage = sendQuickMessage;
window.handleChatSubmit = handleChatSubmit;
window.updateBookingServiceSelection = updateBookingServiceSelection;
window.goToBookingStep = goToBookingStep;
window.renderAvailableSlots = renderAvailableSlots;
window.submitBooking = submitBooking;
window.switchAdminTab = switchAdminTab;
window.saveAdminPrices = saveAdminPrices;
window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;

function saveAdminFAQ() {
    const faq = {
        address: document.getElementById("admin-faq-endereco").value,
        returnPolicy: document.getElementById("admin-faq-retorno").value
    };

    localStorage.setItem("admin-faq", JSON.stringify(faq));
}

function saveAdminAvailability() {
    const days = [];
    for (let i = 1; i <= 6; i++) {
        const chk = document.getElementById(`check-day-${i}`);
        if (chk && chk.checked) days.push(i);
    }

    const hours = [];
    const hoursContainer = document.getElementById("admin-hours-container");
    if (hoursContainer) {
        const checkboxes = hoursContainer.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(chk => {
            if (chk.checked) hours.push(chk.value);
        });
    }

    const availability = { days, hours };
    localStorage.setItem("admin-availability", JSON.stringify(availability));
    
    // Refresh client booking options grid if open
    renderAvailableSlots();
}

function renderAdminBookings() {
    const bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    const container = document.getElementById("admin-bookings-container");
    
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = `<p class="no-bookings-message">Nenhum agendamento realizado até o momento.</p>`;
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
        card.className = "admin-booking-card";
        
        // Format Date
        const dateParts = b.date.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        card.innerHTML = `
            <div class="admin-booking-header">
                <strong>${b.name}</strong>
                <span>${b.code}</span>
            </div>
            <div class="admin-booking-details">
                <p><strong>Procedimento:</strong> ${serviceNames[b.service]}</p>
                <p><strong>Horário:</strong> ${formattedDate} às ${b.slot}</p>
                <p><strong>Contato:</strong> ${b.phone} | ${b.email}</p>
                <p><strong>Valor:</strong> R$ ${b.price}</p>
            </div>
            <div class="admin-booking-footer">
                <button type="button" class="btn-cancel-booking" onclick="cancelBooking('${b.code}')">Cancelar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function cancelBooking(code) {
    if (!confirm(`Deseja cancelar o agendamento ${code}?`)) return;

    let bookings = JSON.parse(localStorage.getItem("client-bookings")) || [];
    bookings = bookings.filter(b => b.code !== code);
    localStorage.setItem("client-bookings", JSON.stringify(bookings));

    // Refresh UI
    renderAdminBookings();
    renderAvailableSlots();
}

window.saveAdminFAQ = saveAdminFAQ;
window.saveAdminAvailability = saveAdminAvailability;
window.cancelBooking = cancelBooking;
