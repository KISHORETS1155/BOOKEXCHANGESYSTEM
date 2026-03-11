/**
 * Authentication Module
 * Handles login, registration, and session management.
 */

const Auth = {
    SESSION_KEY: 'book_exchange_current_user',
    
    /**
     * Get the currently logged-in user
     * @returns {Object|null} User object or null
     */
    getCurrentUser: function() {
        const userJson = localStorage.getItem(this.SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    },

    /**
     * Check if a user is logged in
     * @returns {boolean}
     */
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Check if current user is admin
     */
    isAdmin: function() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    /**
     * Log in a user
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} {success: boolean, message: string}
     */
    login: function(email, password) {
        if (!email || !password) {
            return { success: false, message: "Email and password are required." };
        }

        const users = Database.get(DB_KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Don't store password in session
            const sessionUser = { ...user };
            delete sessionUser.password;
            
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
            return { success: true, message: "Login successful.", user: sessionUser };
        }
        
        return { success: false, message: "Invalid email or password." };
    },

    /**
     * Register a new user
     * @param {Object} userData {name, email, password}
     * @returns {Object} {success: boolean, message: string}
     */
    register: function(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            return { success: false, message: "All fields are required." };
        }

        if (userData.password.length < 6) {
            return { success: false, message: "Password must be at least 6 characters." };
        }

        const users = Database.get(DB_KEYS.USERS);
        const emailExists = users.some(u => u.email === userData.email);

        if (emailExists) {
            return { success: false, message: "Email is already registered." };
        }

        const newUser = {
            id: 'user_' + Database.generateId(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: 'user', // default role
            joinedDate: new Date().toISOString()
        };

        Database.add(DB_KEYS.USERS, newUser);
        return { success: true, message: "Registration successful. Please login." };
    },

    /**
     * Log out current user
     */
    logout: function() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Route protection middleware-like function
     * Redirects to login if user is not authenticated
     */
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    },

    /**
     * Admin route protection
     */
    requireAdmin: function() {
        this.requireAuth(); // Ensure authenticated first
        if (!this.isAdmin()) {
            window.location.href = 'dashboard.html'; // Redirect non-admins
        }
    },

    /**
     * Redirect authenticated users away from guest pages (login/register)
     */
    requireGuest: function() {
        if (this.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
    }
};
