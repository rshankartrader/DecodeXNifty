// Main application entry point
import { initializeUsers, loginUser, loginAdmin, logout, getCurrentUser, updateUserInfo } from './modules/auth.js';
import { initializeNavigation, setActivePage } from './modules/navigation.js';
import { initializeHeader } from './modules/header.js';
import { initializeDataFetcher } from './modules/data-fetcher.js';
import { showNotification } from './modules/notifications.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Check if user is already logged in
    const isLoggedIn = initializeUsers();
    
    if (isLoggedIn) {
        showMainApp();
    } else {
        setupLoginListeners();
    }
    
    // Initialize navigation
    initializeNavigation();
}

function setupLoginListeners() {
    // Tab switching
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabId}LoginForm`).classList.add('active');
        });
    });
}

async function handleUserLogin() {
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    
    const result = await loginUser(email, password);
    
    if (result.success) {
        showMainApp();
        showNotification(`Welcome back, ${result.user.name}!`, 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

function handleAdminLogin() {
    const id = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    const result = loginAdmin(id, password);
    
    if (result.success) {
        showMainApp();
        showNotification('Welcome, Admin Ravi!', 'success');
    } else {
        showNotification(result.message, 'error');
    }
}

function showMainApp() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Load components
    loadHeader();
    loadHomePage();
    loadFooter();
    
    // Update user info
    updateUserInfo();
    
    // Initialize features
    initializeHeader();
    initializeDataFetcher();
}

function loadHeader() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        });
}

function loadHomePage() {
    fetch('pages/home.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('page-content').innerHTML = html;
        });
}

function loadFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        });
}
