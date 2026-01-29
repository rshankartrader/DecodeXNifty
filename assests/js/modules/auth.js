// ===== AUTHENTICATION SYSTEM =====
let currentUser = null;
let users = [];

// Admin credentials
const ADMIN_CREDENTIALS = {
    id: "Ravi@Admin",
    password: "RadheRadhe@2000"
};

// Google Apps Script URL for login authentication
const LOGIN_API_URL = "https://script.google.com/macros/s/AKfycbx75r_4U2RjpihxddZJulj1JkhaizxElBe2rv845586WnOgPbOjXOmVMt1MEfA2OIDt-w/exec";

// Initialize users from localStorage
export function initializeUsers() {
    const savedUsers = localStorage.getItem('decodexmarket_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('decodexmarket_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// User login function - USING GOOGLE APPS SCRIPT
export async function loginUser(email, password) {
    if (!email || !password) {
        return { success: false, message: 'Please enter email and password!' };
    }
    
    try {
        // Send login request to Google Apps Script
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const responseText = await response.text();
        let result;
        
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('JSON parse error:', e);
            throw new Error('Invalid server response');
        }
        
        if (result.success) {
            // Login successful
            currentUser = {
                email: email,
                name: result.name || email.split('@')[0],
                role: result.role || "user",
                hasPurchased: result.purchased || false,
                status: result.status || "active"
            };
            
            // Save to localStorage
            localStorage.setItem('decodexmarket_current_user', JSON.stringify(currentUser));
            
            return { success: true, user: currentUser };
            
        } else {
            return { success: false, message: result.message || 'Invalid credentials' };
        }
        
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Cannot connect to server. Please try again later.' };
    }
}

// Admin login function
export function loginAdmin(id, password) {
    if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            email: ADMIN_CREDENTIALS.id,
            name: "Admin Ravi",
            role: "admin",
            hasPurchased: true,
            status: "active"
        };
        localStorage.setItem('decodexmarket_current_user', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    } else {
        return { success: false, message: 'Invalid admin credentials!' };
    }
}

export function logout() {
    currentUser = null;
    localStorage.removeItem('decodexmarket_current_user');
    return true;
}

export function getCurrentUser() {
    return currentUser;
}

export function updateUserInfo() {
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileUserRole = document.getElementById('mobileUserRole');
    const mobileAvatarIcon = document.getElementById('mobileAvatarIcon');
    
    if (currentUser) {
        // Update header user info
        userNameEl.textContent = currentUser.name;
        userRoleEl.textContent = currentUser.role === "admin" ? "Admin" : "User";
        
        // Update mobile user info
        mobileUserName.textContent = currentUser.name;
        
        // Update role badge and icon based on user role
        let roleDisplay = '';
        let iconClass = '';
        
        if (currentUser.role === "admin") {
            roleDisplay = "Administrator";
            iconClass = "fas fa-user-shield";
        } else if (currentUser.hasPurchased) {
            roleDisplay = "Premium User";
            iconClass = "fas fa-crown";
        } else {
            roleDisplay = "Standard User";
            iconClass = "fas fa-user";
        }
        
        mobileUserRole.textContent = roleDisplay;
        mobileAvatarIcon.className = iconClass;
    }
}
