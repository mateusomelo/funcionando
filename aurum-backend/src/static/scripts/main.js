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
function resizeImage(imgElement, maxWidth, maxHeight) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let width = imgElement.width;
    let height = imgElement.height;

    // Calculate new dimensions, maintaining aspect ratio
    if (maxWidth && width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imgElement, 0, 0, width, height);

    // Return the resized image as a data URL (e.g., PNG)
    return canvas.toDataURL("image/png");
}

// Client Carousel
document.addEventListener("DOMContentLoaded", function() {
    const clients = [
        {
            name: 'BEST GUEST HOTEL',
            //message: 'A Aurum transformou nossa infraestrutura de TI completamente. Agora temos sistemas mais eficientes e seguros que nos permitem focar no crescimento do negócio.',
            image: '/assets/bestguest.png' // Imagem padrão
        },
        {
            name: 'FSMAX SYSTEMS',
            //message: 'Excelente parceria! A consultoria em segurança da informação da Aurum nos ajudou a implementar protocolos robustos que protegem nossos dados críticos.',
            image: '/assets/fsmax.jpeg'
        },
        {
            name: 'MOREIRA FILHO ADVOGADOS',
            //message: 'O desenvolvimento de software personalizado superou nossas expectativas. A equipe da Aurum entendeu perfeitamente nossas necessidades e entregou uma solução excepcional.',
            image: '/assets/moreirafilho.jpeg'
        },
        {
            name: 'ED.HYDE PARK',
            //message: 'Desde que começamos a trabalhar com a Aurum, nossa produtividade aumentou 40%. As soluções integradas realmente fazem a diferença no dia a dia.',
            image: '/assets/edhyde.png'
        },
        {
            name: 'SP CENTRO',
            //message: 'Profissionalismo e qualidade técnica excepcionais. A Aurum não apenas resolve problemas, mas antecipa necessidades futuras do nosso negócio.',
            image: '/assets/spcentro.png'
        },
        {
            name: 'NOVAES & ROSELLI ADVOGADOS',
            //message: 'Profissionalismo e qualidade técnica excepcionais. A Aurum não apenas resolve problemas, mas antecipa necessidades futuras do nosso negócio.',
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
            
            // Create a temporary image element to load the image and then resize it
            const tempImage = new Image();
            tempImage.src = currentClient.image;

            tempImage.onload = () => {
                // Define as dimensões desejadas para a sua logo (ex: 150px de largura, altura automática)
                const resizedDataURL = resizeImage(tempImage, 200, null); 
                clientImageElement.src = resizedDataURL;
                clientImageElement.style.width = '300px'; // Opcional: defina o estilo CSS para garantir o tamanho
                clientImageElement.style.height = '200px'; // Opcional: defina o estilo CSS para garantir o tamanho

                // Add fade in effect after image is loaded and resized
                clientsTextElement.style.opacity = '1';
                clientImageElement.style.opacity = '1';
                clientsTextElement.classList.add('client-fade-in');
                clientImageElement.classList.add('client-fade-in');
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    clientsTextElement.classList.remove('client-fade-in');
                    clientImageElement.classList.remove('client-fade-in');
                }, 500);
            };

            // If image is already in cache, onload might not fire, so check complete property
            if (tempImage.complete) {
                tempImage.onload();
            }
            
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


// Hero Carousel Functionality
let currentHeroSlideIndex = 0;
let heroAutoPlayInterval;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroIndicators = document.querySelectorAll('.hero-indicator');
const heroThumbnails = document.querySelectorAll('.hero-thumbnail');
const totalHeroSlides = heroSlides.length;

// Inicializar carrossel do Hero quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    if (heroSlides.length > 0) {
        initHeroCarousel();
        startHeroAutoPlay();
    }
});

function initHeroCarousel() {
    // Configurar slide inicial
    updateHeroCarousel();
    
    // Adicionar event listeners para pausar/retomar auto-play
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        heroContainer.addEventListener('mouseenter', stopHeroAutoPlay);
        heroContainer.addEventListener('mouseleave', startHeroAutoPlay);
    }
    
    // Adicionar suporte para navegação por teclado
    document.addEventListener('keydown', function(e) {
        // Só funcionar se estivermos na seção hero
        const heroSection = document.querySelector('.hero');
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isHeroVisible) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                changeHeroSlide(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                changeHeroSlide(1);
            }
        }
    });
    
    // Adicionar suporte para touch/swipe em dispositivos móveis
    let startX = 0;
    let endX = 0;
    
    if (heroContainer) {
        heroContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        heroContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleHeroSwipe();
        });
    }
    
    function handleHeroSwipe() {
        const threshold = 50; // Mínimo de pixels para considerar um swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                changeHeroSlide(1); // Swipe para a esquerda - próximo slide
            } else {
                changeHeroSlide(-1); // Swipe para a direita - slide anterior
            }
        }
    }
}

function changeHeroSlide(direction) {
    currentHeroSlideIndex += direction;
    
    if (currentHeroSlideIndex >= totalHeroSlides) {
        currentHeroSlideIndex = 0;
    } else if (currentHeroSlideIndex < 0) {
        currentHeroSlideIndex = totalHeroSlides - 1;
    }
    
    updateHeroCarousel();
}

function goToHeroSlide(index) {
    currentHeroSlideIndex = index;
    updateHeroCarousel();
}

function updateHeroCarousel() {
    // Atualizar slides
    heroSlides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentHeroSlideIndex) {
            slide.classList.add('active');
        }
    });
    
    // Atualizar indicadores
    heroIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentHeroSlideIndex) {
            indicator.classList.add('active');
        }
    });
    
    // Atualizar miniaturas
    heroThumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.remove('active');
        if (index === currentHeroSlideIndex) {
            thumbnail.classList.add('active');
        }
    });
    
    // Adicionar animação aos elementos do slide ativo
    const activeSlide = heroSlides[currentHeroSlideIndex];
    if (activeSlide) {
        const heroContent = activeSlide.querySelector('.hero-content');
        const heroImage = activeSlide.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.style.animation = 'none';
            heroContent.offsetHeight; // Trigger reflow
            heroContent.style.animation = 'slideInLeft 0.8s ease-out';
        }
        
        if (heroImage) {
            heroImage.style.animation = 'none';
            heroImage.offsetHeight; // Trigger reflow
            heroImage.style.animation = 'slideInRight 0.8s ease-out';
        }
    }
    
    // Atualizar título da página baseado no slide atual
    updatePageTitle();
}

function updatePageTitle() {
    const activeSlide = heroSlides[currentHeroSlideIndex];
    if (activeSlide) {
        const title = activeSlide.querySelector('.hero-title').textContent;
        const subtitle = activeSlide.querySelector('.hero-subtitle').textContent;
        document.title = `${title} - ${subtitle} | Aurum`;
    }
}

function startHeroAutoPlay() {
    stopHeroAutoPlay(); // Limpar qualquer interval existente
    heroAutoPlayInterval = setInterval(() => {
        changeHeroSlide(1);
    }, 6000); // Muda slide a cada 6 segundos (um pouco mais lento para o hero)
}

function stopHeroAutoPlay() {
    if (heroAutoPlayInterval) {
        clearInterval(heroAutoPlayInterval);
        heroAutoPlayInterval = null;
    }
}

// Pausar auto-play quando a aba não estiver visível
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopHeroAutoPlay();
    } else {
        startHeroAutoPlay();
    }
});

// Pausar auto-play quando o usuário rolar para fora da seção hero
function handleHeroScroll() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isHeroVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isHeroVisible && heroAutoPlayInterval) {
            stopHeroAutoPlay();
        } else if (isHeroVisible && !heroAutoPlayInterval) {
            startHeroAutoPlay();
        }
    }
}

// Adicionar listener para scroll
window.addEventListener('scroll', handleHeroScroll);

// Função para precarregar imagens
function preloadHeroImages() {
    const images = document.querySelectorAll('.hero-slide img');
    images.forEach(img => {
        const imageUrl = img.src;
        const preloadImg = new Image();
        preloadImg.src = imageUrl;
    });
}

// Chamar preload quando necessário
document.addEventListener('DOMContentLoaded', preloadHeroImages);

// Função para adicionar efeito de parallax sutil (opcional)
function addHeroParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero');
        
        if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const parallaxElements = heroSection.querySelectorAll('.hero-image img');
                parallaxElements.forEach(element => {
                    const speed = 0.2; // Efeito sutil
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        }
    });
}

// Ativar parallax (opcional - descomente se desejar)
// addHeroParallax();

// Função para otimizar performance em dispositivos móveis
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduzir frequência de auto-play em mobile
        if (heroAutoPlayInterval) {
            stopHeroAutoPlay();
            heroAutoPlayInterval = setInterval(() => {
                changeHeroSlide(1);
            }, 8000); // 8 segundos em mobile
        }
    }
}

// Chamar otimização quando a janela for redimensionada
window.addEventListener('resize', optimizeForMobile);
document.addEventListener('DOMContentLoaded', optimizeForMobile);

// Adicionar indicador de carregamento para as imagens
function addImageLoadingIndicators() {
    const images = document.querySelectorAll('.hero-slide img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', addImageLoadingIndicators);
