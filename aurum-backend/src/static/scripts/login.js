// Login JavaScript for Aurum System

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const dashboardModal = document.getElementById('dashboardModal');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Validate token and show dashboard if valid
        validateToken(token);
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            
            // Basic validation
            if (!credentials.email || !credentials.password) {
                showError('Por favor, preencha todos os campos.');
                return;
            }
            
            // Show loading state
            showLoading(true);
            hideError();
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });
                
                const data = await response.json();
                
                if (response.ok && data.message) {
                    // Store token and user info (simulated)
                    localStorage.setItem('authToken', 'dummy-token');
                    localStorage.setItem('userProfile', data.user.profile);
                    localStorage.setItem('username', data.user.username);
                    localStorage.setItem('userEmail', data.user.email);
                    
                    // Show dashboard
                    showDashboard(data.user);
                    
                    // Clear form
                    loginForm.reset();
                } else {
                    showError(data.error || 'Credenciais inválidas. Tente novamente.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Erro de conexão. Tente novamente.');
            } finally {
                showLoading(false);
            }
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Close dashboard when clicking outside
    if (dashboardModal) {
        dashboardModal.addEventListener('click', function(e) {
            if (e.target === dashboardModal) {
                logout();
            }
        });
    }
    
    // Utility functions
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    function hideError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
    
    function showLoading(show) {
        if (loadingMessage) {
            loadingMessage.style.display = show ? 'block' : 'none';
        }
    }
    
    async function validateToken(token) {
        try {
            const response = await fetch("/api/auth/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    showDashboard(data.user);
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token validation error:', error);
            logout();
        }
    }
    
    function showDashboard(user) {
        if (dashboardModal) {
            // Update user info
            const userProfile = document.getElementById('userProfile');
            if (userProfile) {
                userProfile.textContent = `${user.username} (${user.profile})`;
            }
            
            // Show dashboard
            dashboardModal.style.display = 'flex';
            
            // Initialize dashboard functionality
            initializeDashboard();
        }
    }
    
    function logout() {
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        
        // Hide dashboard
        if (dashboardModal) {
            dashboardModal.style.display = 'none';
        }
        
        // Clear any error messages
        hideError();
        showLoading(false);
    }
    
    function initializeDashboard() {
        // This function will be extended by dashboard.js
        // Load initial data for the active section
        const activeSection = document.querySelector('.nav-item.active');
        if (activeSection) {
            const sectionName = activeSection.getAttribute('data-section');
            loadSectionData(sectionName);
        }
    }
    
    // API helper function
    async function apiRequest(endpoint, options = {}) {
        const token = localStorage.getItem('authToken');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(endpoint, finalOptions);
            
            if (response.status === 401) {
                // Token expired or invalid
                logout();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            
            return response;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
    
    // Make apiRequest available globally for dashboard.js
    window.apiRequest = apiRequest;
    window.logout = logout;
    
    // Dispatch a custom event to indicate that login.js has loaded and set up global functions
    const event = new Event("loginLoaded");
    window.dispatchEvent(event);
    
    // Load section data function (will be used by dashboard.js)
    window.loadSectionData = function(sectionName) {
        console.log(`Loading data for section: ${sectionName}`);
        // This will be implemented in dashboard.js
    };
});

