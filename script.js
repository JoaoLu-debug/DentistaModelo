// ==========================================================================
// PREMIUM REFRACTIVE INTERACTION LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    init3DTiltAndSpotlight();
    initDiagnosticSimulator();
    initScrollAnimations();
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
