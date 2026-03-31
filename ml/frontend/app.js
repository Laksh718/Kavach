const API_BASE = "http://127.0.0.1:8000/api/v1";

// Application State
let state = {
    user: null, // Worker Object
    policy: null, // Policy Object
    payouts: []
};

// DOM Elements
const views = ["auth", "dashboard", "policy"];
const sidebar = document.getElementById("sidebar");

// View Management
function switchView(viewName) {
    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.remove("active");
    });
    document.getElementById(`view-${viewName}`).classList.add("active");

    // Update active state in sidebar
    document.querySelectorAll(".menu-item").forEach(item => {
        if (item.innerText.toLowerCase().includes(viewName)) {
            item.classList.add("active");
        } else if (!item.innerText.includes("Logout")) {
            item.classList.remove("active");
        }
    });

    if (viewName === 'dashboard') {
        fetchDashboardData();
    }
}

// 1. Auth Handle
document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const payload = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        base_income_daily: parseFloat(document.getElementById("base_income").value),
        upi_id: "example@upi" // Dummy
    };

    try {
        // Create Worker
        const resWorker = await fetch(`${API_BASE}/workers/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (!resWorker.ok) throw new Error("Onboarding Failed");
        const worker = await resWorker.json();
        state.user = worker;

        // Auto Create Policy
        const policyPayload = {
            worker_id: worker.id,
            daily_coverage: payload.base_income_daily, // Match target
            rain_threshold_mm: 50.0,
            aqi_threshold: 200.0
        };

        const resPolicy = await fetch(`${API_BASE}/policies/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(policyPayload)
        });
        const policy = await resPolicy.json();
        state.policy = policy;

        // Switch View
        sidebar.style.display = "flex";
        document.getElementById("user-greeting").innerText = `Hello, ${worker.name}`;
        switchView("dashboard");

    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});

// 2. Fetch Dashboard & Payouts
async function fetchDashboardData() {
    if (!state.user) return;

    try {
        // Update stats
        document.getElementById("card-coverage").innerText = `₹${state.policy ? state.policy.daily_coverage : 0}`;
        document.getElementById("card-premium").innerText = `₹${state.policy ? state.policy.weekly_premium : 0}`;

        // Fetch Payouts
        const resPayouts = await fetch(`${API_BASE}/simulate/payouts`);
        const payouts = await resPayouts.json();
        
        // Filter for current user
        const myPayouts = payouts.filter(p => p.worker_id === state.user.id);
        renderPayouts(myPayouts);

    } catch (err) {
        console.error("Dashboard Fetch Error:", err);
    }
}

function renderPayouts(payouts) {
    const tbody = document.querySelector("#payouts-table tbody");
    tbody.innerHTML = ""; // Clear

    if (payouts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">No payouts issued yet. Scanning parameters...</td></tr>`;
        return;
    }

    payouts.forEach(p => {
        const tr = document.createElement("tr");
        const statusClass = p.status === "APPROVED" ? "✅" : "⚠️";
        tr.innerHTML = `
            <td>Parametric Disruption</td>
            <td>₹${p.amount}</td>
            <td>${p.status} ${statusClass}</td>
            <td>${new Date(p.triggered_at).toLocaleTimeString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Continuous Poll Simulation Sensor feeds
setInterval(() => {
    if (state.user) {
        const liveSensor = document.getElementById("live-sensor");
        const isRain = Math.random() > 0.5;
        const value = isRain 
            ? `${(Math.random() * 60).toFixed(1)}mm Rain` 
            : `${(Math.random() * 250).toFixed(0)} AQI`;
            
        liveSensor.innerText = value;
        
        // Refresh payout lists automatically
        fetchDashboardData();
    }
}, 5000);

function logout() {
    state.user = null;
    state.policy = null;
    sidebar.style.display = "none";
    switchView("auth");
}
