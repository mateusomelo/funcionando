// Dashboard JavaScript for Aurum System

document.addEventListener("DOMContentLoaded", function() {
    // Wait for login.js to be loaded
    if (typeof initializeDashboard === 'function') {
        initializeDashboard();
    } else {
        // Fallback if login.js is not yet loaded
        window.addEventListener('loginLoaded', initializeDashboard);
    }
});

function initializeDashboard() {
    // Navigation handling
    const navItems = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".dashboard-section");
    
    navItems.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove("active"));
            sections.forEach(section => section.classList.remove("active"));
            
            // Add active class to clicked item
            this.classList.add("active");
            
            // Show corresponding section
            const sectionName = this.getAttribute("data-section");
            const targetSection = document.getElementById(sectionName + "Section");
            if (targetSection) {
                targetSection.classList.add("active");
                loadSectionData(sectionName);
            }
        });
    });
    
    // Form modal handling
    const formsModal = document.getElementById("formsModal");
    const closeFormBtn = document.getElementById("closeFormBtn");
    
    if (closeFormBtn) {
        closeFormBtn.addEventListener("click", function() {
            hideFormModal();
        });
    }
    
    if (formsModal) {
        formsModal.addEventListener("click", function(e) {
            if (e.target === formsModal) {
                hideFormModal();
            }
        });
    }

    // New buttons handling
    document.getElementById("newTicketBtn").addEventListener("click", () => createTicket());
    document.getElementById("newUserBtn").addEventListener("click", () => createUser());
    document.getElementById("newClientBtn").addEventListener("click", () => createClient());
    document.getElementById("newServiceBtn").addEventListener("click", () => createServiceType());

    // Load initial data
    loadTicketStats();
    loadSectionData("tickets");
}

// Load section data based on section name
function loadSectionData(sectionName) {
    switch(sectionName) {
        case "tickets":
            loadTickets();
            break;
        case "users":
            loadUsers();
            break;
        case "clients":
            loadClients();
            break;
        case "services":
            loadServiceTypes();
            break;
        default:
            console.log(`Loading data for section: ${sectionName}`);
    }
}

// Load ticket statistics
async function loadTicketStats() {
    try {
        const response = await apiRequest("/api/tickets/stats");
        if (response.ok) {
            const data = await response.json();
            updateTicketStats(data.stats || data);
        }
    } catch (error) {
        console.error("Error loading ticket stats:", error);
    }
}

// Update ticket statistics in the UI
function updateTicketStats(stats) {
    const totalElement = document.querySelector(".stat-total .stat-number");
    const openElement = document.querySelector(".stat-open .stat-number");
    const progressElement = document.querySelector(".stat-progress .stat-number");
    const closedElement = document.querySelector(".stat-closed .stat-number");
    
    if (totalElement) totalElement.textContent = stats.total || 0;
    if (openElement) openElement.textContent = stats.aberto || stats.abertos || 0;
    if (progressElement) progressElement.textContent = stats.em_andamento || 0;
    if (closedElement) closedElement.textContent = stats.fechado || stats.fechados || 0;
}

// Load tickets
async function loadTickets() {
    try {
        const response = await apiRequest("/api/tickets");
        if (response.ok) {
            const data = await response.json();
            displayTickets(data.tickets || data);
        }
    } catch (error) {
        console.error("Error loading tickets:", error);
        showError("Erro ao carregar chamados");
    }
}

// Display tickets in the UI
function displayTickets(tickets) {
    const container = document.getElementById("ticketsContainer");
    if (!container) return;
    
    if (!tickets || tickets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">-></div>
                <h3>Nenhum chamado encontrado</h3>
                <p>Clique em "Novo Chamado" para criar seu primeiro ticket</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tickets.map(ticket => `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
            <div class="ticket-header">
                <h4>${ticket.title}</h4>
                <span class="ticket-status status-${ticket.status}">${getStatusLabel(ticket.status)}</span>
            </div>
            <div class="ticket-info">
                <p><strong>Cliente:</strong> ${ticket.client_name || "N/A"}</p>
                <p><strong>Serviço:</strong> ${ticket.service_type_name || "N/A"}</p>
                <p><strong>Prioridade:</strong> ${getPriorityLabel(ticket.priority)}</p>
                <p><strong>Criado em:</strong> ${formatDate(ticket.created_at)}</p>
            </div>
            <div class="ticket-actions">
                <button onclick="viewTicket(${ticket.id})" class="btn-secondary">Ver</button>
                <button onclick="editTicket(${ticket.id})" class="btn-primary">Editar</button>
            </div>
        </div>
    `).join("");
}

// Load users
async function loadUsers() {
    try {
        const response = await apiRequest("/api/users");
        if (response.ok) {
            const data = await response.json();
            displayUsers(data.users || data);
        }
    } catch (error) {
        console.error("Error loading users:", error);
        showError("Erro ao carregar usuários");
    }
}

// Display users in the UI
function displayUsers(users) {
    const container = document.getElementById("usersContainer");
    if (!container) return;
    
    if (!users || users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>Nenhum usuário encontrado</h3>
                <p>Clique em "Novo Usuário" para adicionar usuários</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-info">
                <h4>${user.username}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Cliente:</strong> ${user.client_name || "Nenhum"}</p>
                <span class="user-profile profile-${user.profile}">${getProfileLabel(user.profile)}</span>
            </div>
            <div class="user-actions">
                <button onclick="editUser(${user.id})" class="btn-primary">Editar</button>
                <button onclick="deleteUser(${user.id})" class="btn-danger">Excluir</button>
            </div>
        </div>
    `).join("");
}

// Load clients
async function loadClients() {
    try {
        const response = await apiRequest("/api/clients");
        if (response.ok) {
            const data = await response.json();
            displayClients(data.clients || data);
        }
    } catch (error) {
        console.error("Error loading clients:", error);
        showError("Erro ao carregar clientes");
    }
}

// Display clients in the UI
function displayClients(clients) {
    const container = document.getElementById("clientsContainer");
    if (!container) return;
    
    if (!clients || clients.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏢</div>
                <h3>Nenhum cliente encontrado</h3>
                <p>Clique em "Novo Cliente" para adicionar clientes</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = clients.map(client => `
        <div class="client-card" data-client-id="${client.id}">
            <div class="client-info">
                <h4>${client.name}</h4>
                <p><strong>Email:</strong> ${client.email}</p>
                <p><strong>Empresa:</strong> ${client.company || "N/A"}</p>
                <p><strong>Telefone:</strong> ${client.phone || "N/A"}</p>
            </div>
            <div class="client-actions">
                <button onclick="editClient(${client.id})" class="btn-primary">Editar</button>
                <button onclick="deleteClient(${client.id})" class="btn-danger">Excluir</button>
            </div>
        </div>
    `).join("");
}

// Load service types
async function loadServiceTypes() {
    try {
        const response = await apiRequest("/api/service_types");
        if (response.ok) {
            const data = await response.json();
            displayServiceTypes(data.service_types || data);
        }
    } catch (error) {
        console.error("Error loading service types:", error);
        showError("Erro ao carregar tipos de serviço");
    }
}

// Display service types in the UI
function displayServiceTypes(serviceTypes) {
    const container = document.getElementById("servicesContainer");
    if (!container) return;
    
    if (!serviceTypes || serviceTypes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚙️</div>
                <h3>Nenhum tipo de serviço encontrado</h3>
                <p>Clique em "Novo Tipo de Serviço" para adicionar serviços</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = serviceTypes.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-info">
                <h4>${service.name}</h4>
                <p>${service.description || "Sem descrição"}</p>
            </div>
            <div class="service-actions">
                <button onclick="editServiceType(${service.id})" class="btn-primary">Editar</button>
                <button onclick="deleteServiceType(${service.id})" class="btn-danger">Excluir</button>
            </div>
        </div>
    `).join("");
}

// Utility functions
function getStatusLabel(status) {
    const labels = {
        "aberto": "Aberto",
        "em_andamento": "Em Andamento",
        "fechado": "Fechado"
    };
    return labels[status] || status;
}

function getPriorityLabel(priority) {
    const labels = {
        "baixa": "Baixa",
        "media": "Média",
        "alta": "Alta",
        "urgente": "Urgente"
    };
    return labels[priority] || priority;
}

function getProfileLabel(profile) {
    const labels = {
        "administrador": "Administrador",
        "tecnico": "Técnico",
        "usuario": "Usuário"
    };
    return labels[profile] || profile;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"});
}

function showError(message) {
    // Create or update error message element
    let errorElement = document.getElementById("errorMessage");
    if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.id = "errorMessage";
        errorElement.className = "error-message";
        document.body.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = "block";
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = "none";
    }, 5000);
}

function showSuccess(message) {
    // Create or update success message element
    let successElement = document.getElementById("successMessage");
    if (!successElement) {
        successElement = document.createElement("div");
        successElement.id = "successMessage";
        successElement.className = "success-message";
        document.body.appendChild(successElement);
    }
    
    successElement.textContent = message;
    successElement.style.display = "block";
    
    // Hide after 3 seconds
    setTimeout(() => {
        successElement.style.display = "none";
    }, 3000);
}

// --- Form Handling Functions ---
const formsModal = document.getElementById("formsModal");
const formTitle = document.getElementById("formTitle");
const formContainer = document.getElementById("formContainer");

function showFormModal() {
    formsModal.style.display = "flex";
    formsModal.classList.add("fade-in");
}

function hideFormModal() {
    formsModal.style.display = "none";
    formsModal.classList.remove("fade-in");
    formContainer.innerHTML = ""; // Clear form content
}

async function loadForm(formPath, title, data = null) {
    try {
        const response = await fetch(formPath);
        if (!response.ok) throw new Error(`Failed to load form: ${response.statusText}`);
        const formHtml = await response.text();
        formContainer.innerHTML = formHtml;
        formTitle.textContent = title;
        showFormModal();

        // Populate form if data is provided (for editing)
        if (data) {
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                }
            }
        }

        // Add event listener for cancel button
        const cancelBtn = document.getElementById("cancelFormBtn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", hideFormModal);
        }

        return document.getElementById(formContainer.children[0].id); // Return the form element

    } catch (error) {
        console.error("Error loading form:", error);
        showError("Erro ao carregar formulário.");
        return null;
    }
}

// --- User CRUD ---
async function createUser() {
    const form = await loadForm("/forms/user_form.html", "Criar Novo Usuário");
    if (!form) return;

    // Carregar clientes para o dropdown
    await populateClientDropdownForUser(form.querySelector("#client_id"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData.entries());

        // Converter client_id para inteiro se fornecido
        if (userData.client_id) {
            userData.client_id = parseInt(userData.client_id);
        } else {
            userData.client_id = null;
        }

        try {
            const response = await apiRequest("/api/users", { method: "POST", body: JSON.stringify(userData) });
            if (response.ok) {
                showSuccess("Usuário criado com sucesso!");
                hideFormModal();
                loadUsers();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao criar usuário.");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            showError("Erro de conexão ao criar usuário.");
        }
    });
}

async function editUser(userId) {
    try {
        const response = await apiRequest(`/api/users/${userId}`);
        if (!response.ok) throw new Error("Usuário não encontrado.");
        const userData = await response.json();

        const form = await loadForm("/forms/user_form.html", "Editar Usuário", userData);
        if (!form) return;

        // Carregar clientes para o dropdown e definir o valor selecionado
        await populateClientDropdownForUser(form.querySelector("#client_id"), userData.client_id);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedUserData = Object.fromEntries(formData.entries());

            // Converter client_id para inteiro se fornecido
            if (updatedUserData.client_id) {
                updatedUserData.client_id = parseInt(updatedUserData.client_id);
            } else {
                updatedUserData.client_id = null;
            }

            try {
                const updateResponse = await apiRequest(`/api/users/${userId}`, { method: "PUT", body: JSON.stringify(updatedUserData) });
                if (updateResponse.ok) {
                    showSuccess("Usuário atualizado com sucesso!");
                    hideFormModal();
                    loadUsers();
                } else {
                    const errorData = await updateResponse.json();
                    showError(errorData.error || "Erro ao atualizar usuário.");
                }
            } catch (error) {
                console.error("Error updating user:", error);
                showError("Erro de conexão ao atualizar usuário.");
            }
        });
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        showError(error.message || "Erro ao carregar dados do usuário para edição.");
    }
}

async function deleteUser(userId) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        try {
            const response = await apiRequest(`/api/users/${userId}`, { method: "DELETE" });
            if (response.ok) {
                showSuccess("Usuário excluído com sucesso!");
                loadUsers();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao excluir usuário.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            showError("Erro de conexão ao excluir usuário.");
        }
    }
}

// --- Client CRUD ---
async function createClient() {
    const form = await loadForm("/forms/client_form.html", "Criar Novo Cliente");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const clientData = Object.fromEntries(formData.entries());

        try {
            const response = await apiRequest("/api/clients", { method: "POST", body: JSON.stringify(clientData) });
            if (response.ok) {
                showSuccess("Cliente criado com sucesso!");
                hideFormModal();
                loadClients();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao criar cliente.");
            }
        } catch (error) {
            console.error("Error creating client:", error);
            showError("Erro de conexão ao criar cliente.");
        }
    });
}

async function editClient(clientId) {
    try {
        const response = await apiRequest(`/api/clients/${clientId}`);
        if (!response.ok) throw new Error("Cliente não encontrado.");
        const clientData = await response.json();

        const form = await loadForm("/forms/client_form.html", "Editar Cliente", clientData);
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedClientData = Object.fromEntries(formData.entries());

            try {
                const updateResponse = await apiRequest(`/api/clients/${clientId}`, { method: "PUT", body: JSON.stringify(updatedClientData) });
                if (updateResponse.ok) {
                    showSuccess("Cliente atualizado com sucesso!");
                    hideFormModal();
                    loadClients();
                } else {
                    const errorData = await updateResponse.json();
                    showError(errorData.error || "Erro ao atualizar cliente.");
                }
            } catch (error) {
                console.error("Error updating client:", error);
                showError("Erro de conexão ao atualizar cliente.");
            }
        });
    } catch (error) {
        console.error("Error fetching client for edit:", error);
        showError(error.message || "Erro ao carregar dados do cliente para edição.");
    }
}

async function deleteClient(clientId) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
        try {
            const response = await apiRequest(`/api/clients/${clientId}`, { method: "DELETE" });
            if (response.ok) {
                showSuccess("Cliente excluído com sucesso!");
                loadClients();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao excluir cliente.");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            showError("Erro de conexão ao excluir cliente.");
        }
    }
}

// --- Service Type CRUD ---
async function createServiceType() {
    const form = await loadForm("/forms/service_type_form.html", "Criar Novo Tipo de Serviço");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const serviceTypeData = Object.fromEntries(formData.entries());

        try {
            const response = await apiRequest("/api/service_types", { method: "POST", body: JSON.stringify(serviceTypeData) });
            if (response.ok) {
                showSuccess("Tipo de serviço criado com sucesso!");
                hideFormModal();
                loadServiceTypes();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao criar tipo de serviço.");
            }
        } catch (error) {
            console.error("Error creating service type:", error);
            showError("Erro de conexão ao criar tipo de serviço.");
        }
    });
}

async function editServiceType(serviceTypeId) {
    try {
        const response = await apiRequest(`/api/service_types/${serviceTypeId}`);
        if (!response.ok) throw new Error("Tipo de serviço não encontrado.");
        const serviceTypeData = await response.json();

        const form = await loadForm("/forms/service_type_form.html", "Editar Tipo de Serviço", serviceTypeData);
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedServiceTypeData = Object.fromEntries(formData.entries());

            try {
                const updateResponse = await apiRequest(`/api/service_types/${serviceTypeId}`, { method: "PUT", body: JSON.stringify(updatedServiceTypeData) });
                if (updateResponse.ok) {
                    showSuccess("Tipo de serviço atualizado com sucesso!");
                    hideFormModal();
                    loadServiceTypes();
                } else {
                    const errorData = await updateResponse.json();
                    showError(errorData.error || "Erro ao atualizar tipo de serviço.");
                }
            } catch (error) {
                console.error("Error updating service type:", error);
                showError("Erro de conexão ao atualizar tipo de serviço.");
            }
        });
    } catch (error) {
        console.error("Error fetching service type for edit:", error);
        showError(error.message || "Erro ao carregar dados do tipo de serviço para edição.");
    }
}

async function deleteServiceType(serviceTypeId) {
    if (confirm("Tem certeza que deseja excluir este tipo de serviço?")) {
        try {
            const response = await apiRequest(`/api/service_types/${serviceTypeId}`, { method: "DELETE" });
            if (response.ok) {
                showSuccess("Tipo de serviço excluído com sucesso!");
                loadServiceTypes();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao excluir tipo de serviço.");
            }
        } catch (error) {
            console.error("Error deleting service type:", error);
            showError("Erro de conexão ao excluir tipo de serviço.");
        }
    }
}

// --- Ticket CRUD ---
async function createTicket() {
    const form = await loadForm("/forms/ticket_form.html", "Criar Novo Chamado");
    if (!form) return;

    // Load clients and service types for dropdowns
    await populateClientDropdown(form.querySelector("#ticketClient"));
    await populateServiceTypeDropdown(form.querySelector("#ticketServiceType"));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const ticketData = Object.fromEntries(formData.entries());

        // Convert client_id and service_type_id to integers
        ticketData.client_id = parseInt(ticketData.client_id);
        ticketData.service_type_id = parseInt(ticketData.service_type_id);

        try {
            const response = await apiRequest("/api/tickets", { method: "POST", body: JSON.stringify(ticketData) });
            if (response.ok) {
                showSuccess("Chamado criado com sucesso!");
                hideFormModal();
                loadTickets();
                loadTicketStats();
            } else {
                const errorData = await response.json();
                showError(errorData.error || "Erro ao criar chamado.");
            }
        } catch (error) {
            console.error("Error creating ticket:", error);
            showError("Erro de conexão ao criar chamado.");
        }
    });
}

async function editTicket(ticketId) {
    try {
        const response = await apiRequest(`/api/tickets/${ticketId}`);
        if (!response.ok) throw new Error("Chamado não encontrado.");
        const ticketData = await response.json();

        const form = await loadForm("/forms/ticket_form.html", "Editar Chamado", ticketData);
        if (!form) return;

        // Load clients and service types for dropdowns and set selected values
        await populateClientDropdown(form.querySelector("#ticketClient"), ticketData.client_id);
        await populateServiceTypeDropdown(form.querySelector("#ticketServiceType"), ticketData.service_type_id);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const updatedTicketData = Object.fromEntries(formData.entries());

            // Convert client_id and service_type_id to integers
            updatedTicketData.client_id = parseInt(updatedTicketData.client_id);
            updatedTicketData.service_type_id = parseInt(updatedTicketData.service_type_id);

            try {
                const updateResponse = await apiRequest(`/api/tickets/${ticketId}`, { method: "PUT", body: JSON.stringify(updatedTicketData) });
                if (updateResponse.ok) {
                    showSuccess("Chamado atualizado com sucesso!");
                    hideFormModal();
                    loadTickets();
                    loadTicketStats();
                } else {
                    const errorData = await updateResponse.json();
                    showError(errorData.error || "Erro ao atualizar chamado.");
                }
            } catch (error) {
                console.error("Error updating ticket:", error);
                showError("Erro de conexão ao atualizar chamado.");
            }
        });
    } catch (error) {
        console.error("Error fetching ticket for edit:", error);
        showError(error.message || "Erro ao carregar dados do chamado para edição.");
    }
}

async function viewTicket(ticketId) {
    try {
        const response = await apiRequest(`/api/tickets/${ticketId}`);
        if (!response.ok) throw new Error("Chamado não encontrado.");
        const ticket = await response.json();

        const modalContent = `
            <div class="ticket-view-modal">
                <h3>Detalhes do Chamado #${ticket.id}</h3>
                <p><strong>Título:</strong> ${ticket.title}</p>
                <p><strong>Descrição:</strong> ${ticket.description}</p>
                <p><strong>Cliente:</strong> ${ticket.client_name || "N/A"}</p>
                <p><strong>Tipo de Serviço:</strong> ${ticket.service_type_name || "N/A"}</p>
                <p><strong>Prioridade:</strong> ${getPriorityLabel(ticket.priority)}</p>
                <p><strong>Status:</strong> ${getStatusLabel(ticket.status)}</p>
                <p><strong>Criado em:</strong> ${formatDate(ticket.created_at)}</p>
                <p><strong>Última Atualização:</strong> ${formatDate(ticket.updated_at)}</p>
                
                <h4>Respostas:</h4>
                <div class="ticket-responses-container">
                    ${ticket.responses && ticket.responses.length > 0 ? 
                        ticket.responses.map(res => `
                            <div class="response-card ${res.is_internal ? 'internal' : ''}">
                                <p><strong>${res.username}:</strong> ${res.message}</p>
                                <small>${formatDate(res.created_at)} ${res.is_internal ? '(Interno)' : ''}</small>
                            </div>
                        `).join('')
                        : '<p>Nenhuma resposta ainda.</p>'
                    }
                </div>
                
                <form id="responseForm" class="response-form">
                    <textarea id="responseMessage" placeholder="Adicionar resposta..." required></textarea>
                    <label><input type="checkbox" id="isInternal"> Resposta Interna</label>
                    <button type="submit" class="btn btn-primary">Enviar Resposta</button>
                </form>
            </div>
        `;

        formContainer.innerHTML = modalContent;
        formTitle.textContent = `Chamado #${ticket.id}`; // Update modal title
        showFormModal();

        // Handle response submission
        const responseForm = document.getElementById("responseForm");
        responseForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const message = document.getElementById("responseMessage").value;
            const isInternal = document.getElementById("isInternal").checked;

            try {
                const response = await apiRequest(`/api/tickets/${ticket.id}/responses`, { 
                    method: "POST", 
                    body: JSON.stringify({ message, is_internal: isInternal })
                });
                if (response.ok) {
                    showSuccess("Resposta adicionada com sucesso!");
                    viewTicket(ticket.id); // Reload ticket to show new response
                } else {
                    const errorData = await response.json();
                    showError(errorData.error || "Erro ao adicionar resposta.");
                }
            } catch (error) {
                console.error("Error adding response:", error);
                showError("Erro de conexão ao adicionar resposta.");
            }
        });

        // Add event listener for cancel button
        const cancelBtn = document.getElementById("closeFormBtn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", hideFormModal);
        }

    } catch (error) {
        console.error("Error viewing ticket:", error);
        showError(error.message || "Erro ao carregar detalhes do chamado.");
    }
}

// Helper to populate client dropdown
async function populateClientDropdown(selectElement, selectedId = null) {
    try {
        const response = await apiRequest("/api/clients");
        if (response.ok) {
            const clients = await response.json();
            selectElement.innerHTML = 
                clients.map(client => `<option value="${client.id}">${client.name}</option>`).join("");
            if (selectedId) {
                selectElement.value = selectedId;
            }
        }
    } catch (error) {
        console.error("Error populating clients:", error);
        showError("Erro ao carregar clientes para o formulário.");
    }
}

// Helper to populate service type dropdown
async function populateServiceTypeDropdown(selectElement, selectedId = null) {
    try {
        const response = await apiRequest("/api/service_types");
        if (response.ok) {
            const serviceTypes = await response.json();
            selectElement.innerHTML = 
                serviceTypes.map(service => `<option value="${service.id}">${service.name}</option>`).join("");
            if (selectedId) {
                selectElement.value = selectedId;
            }
        }
    } catch (error) {
        console.error("Error populating service types:", error);
        showError("Erro ao carregar tipos de serviço para o formulário.");
    }
}

// Helper to populate client dropdown for user forms
async function populateClientDropdownForUser(selectElement, selectedId = null) {
    try {
        const response = await apiRequest("/api/clients");
        if (response.ok) {
            const clients = await response.json();
            selectElement.innerHTML = '<option value="">Nenhum cliente</option>' +
                clients.map(client => `<option value="${client.id}">${client.name}</option>`).join("");
            if (selectedId) {
                selectElement.value = selectedId;
            }
        }
    } catch (error) {
        console.error("Error populating clients for user form:", error);
        showError("Erro ao carregar clientes para o formulário.");
    }
}

// Make functions available globally
window.loadSectionData = loadSectionData;
window.viewTicket = viewTicket;
window.editTicket = editTicket;
window.createUser = createUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.createClient = createClient;
window.editClient = editClient;
window.deleteClient = deleteClient;
window.createServiceType = createServiceType;
window.editServiceType = editServiceType;
window.deleteServiceType = deleteServiceType;
window.createTicket = createTicket;

