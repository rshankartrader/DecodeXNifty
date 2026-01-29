// ===== NAVIGATION SYSTEM =====
export function setActivePage(page) {
    // Update navigation buttons in mobile menu
    const mobileNavButtons = document.querySelectorAll('.mobile-menu .nav-button');
    const footerLinks = document.querySelectorAll('.footer-links .nav-link');
    
    // Update mobile navigation buttons
    mobileNavButtons.forEach(button => {
        if (button.getAttribute('data-page') === page) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update footer links
    footerLinks.forEach(link => {
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show selected page
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update browser history
    history.pushState({ page: page }, '', `#${page}`);
}

export function initializeNavigation() {
    // Handle browser back/forward
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            setActivePage(event.state.page);
        }
    });
    
    // Handle initial hash in URL
    if (window.location.hash) {
        const page = window.location.hash.substring(1);
        setActivePage(page);
    }
}
