// Main JavaScript for Aurum Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showMessage('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-content, .clients-content').forEach(el => {
        observer.observe(el);
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
        });
    }
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message-toast');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-toast message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        animation: 'slideInFromRight 0.3s ease-out'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageEl.style.background = '#10b981';
            break;
        case 'error':
            messageEl.style.background = '#ef4444';
            break;
        case 'warning':
            messageEl.style.background = '#f59e0b';
            break;
        default:
            messageEl.style.background = '#2563eb';
    }
    
    // Add to page
    document.body.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOutToRight 0.3s ease-in';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 300);
    }, 5000);
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutToRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);



// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset form
        this.reset();
    });
}

// Client Carousel
document.addEventListener('DOMContentLoaded', function() {
    const clients = [
        {
            name: 'Best Guest Hotel',
            message: 'A Aurum transformou nossa infraestrutura de TI completamente. Agora temos sistemas mais eficientes e seguros que nos permitem focar no crescimento do negócio.',
            image: '/assets/bestguest.jpeg' // Imagem padrão
        },
        {
            name: 'FsMax Systems',
            message: 'Excelente parceria! A consultoria em segurança da informação da Aurum nos ajudou a implementar protocolos robustos que protegem nossos dados críticos.',
            image: '/assets/fsmax.jpeg'
        },
        {
            name: 'Moreira Filho Advogados',
            message: 'O desenvolvimento de software personalizado superou nossas expectativas. A equipe da Aurum entendeu perfeitamente nossas necessidades e entregou uma solução excepcional.',
            image: '/assets/moreirafilho.jpeg'
        },
        {
            name: 'ED.HYDE PARK',
            message: 'Desde que começamos a trabalhar com a Aurum, nossa produtividade aumentou 40%. As soluções integradas realmente fazem a diferença no dia a dia.',
            image: '/assets/clients_section-CiY21EiB.png'
        },
        {
            name: 'SP Centro',
            message: 'Profissionalismo e qualidade técnica excepcionais. A Aurum não apenas resolve problemas, mas antecipa necessidades futuras do nosso negócio.',
            image: '/assets/spcentro.png'
        },
        {
            name: 'NOVAES & ROSELLI ADVOGADOS',
            message: 'Profissionalismo e qualidade técnica excepcionais. A Aurum não apenas resolve problemas, mas antecipa necessidades futuras do nosso negócio.',
            image: '/assets/novaesroselli.jpeg'
        },

    ];

    let currentIndex = 0;
    const clientNameElement = document.getElementById('client-name');
    const clientMessageElement = document.getElementById('client-message');
    const clientImageElement = document.getElementById('client-image');
    const clientsTextElement = document.querySelector('.clients-text');

    function updateClientInfo() {
        // Add fade out effect
        clientsTextElement.style.opacity = '0';
        clientImageElement.style.opacity = '0';
        
        setTimeout(() => {
            const currentClient = clients[currentIndex];
            clientNameElement.textContent = currentClient.name;
            clientMessageElement.textContent = currentClient.message;
            clientImageElement.src = currentClient.image;
            
            // Add fade in effect
            clientsTextElement.style.opacity = '1';
            clientImageElement.style.opacity = '1';
            clientsTextElement.classList.add('client-fade-in');
            clientImageElement.classList.add('client-fade-in');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                clientsTextElement.classList.remove('client-fade-in');
                clientImageElement.classList.remove('client-fade-in');
            }, 500);
            
            currentIndex = (currentIndex + 1) % clients.length;
        }, 250);
    }

    // Initial update
    if (clientNameElement && clientMessageElement && clientImageElement) {
        updateClientInfo();
        
        // Update every 3 seconds
        setInterval(updateClientInfo, 3000);
    }
});


