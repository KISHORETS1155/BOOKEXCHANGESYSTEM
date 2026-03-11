/**
 * UI Module
 * Handles shared UI components like the Navbar, Footer, and Toast notifications.
 */

const UI = {
    /**
     * Initialize Theme
     */
    initTheme: function() {
        // Runs immediately upon script parse
        const savedTheme = localStorage.getItem('book_exchange_theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
    },

    /**
     * Set actual icon depending on theme
     */
    updateThemeIcon: function() {
        const theme = document.documentElement.getAttribute('data-bs-theme');
        const icon = document.querySelector('#themeToggleBtn i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
        }
    },

    /**
     * Toggle Theme
     */
    toggleTheme: function() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('book_exchange_theme', newTheme);
        UI.updateThemeIcon();
    },

    /**
     * Start Fake Realtime Notifications
     */
    startFakeRealtime: function() {
        if (!Auth.isLoggedIn()) return;
        if (window.fakeRealtimeInterval) clearInterval(window.fakeRealtimeInterval);
        
        const events = [
            { t: "New Book Listed", m: "Someone just listed a new book in 'Programming'.", type: "info" },
            { t: "Exchange Complete", m: "A community member just completed a successful book swap!", type: "success" },
            { t: "New Club Activity", m: "A new member joined the 'Sci-Fi Enthusiasts' reading club.", type: "info" },
            { t: "Trending Discussion", m: "A new hot topic was posted in the Community Forum.", type: "warning" }
        ];

        window.fakeRealtimeInterval = setInterval(() => {
            // 25% chance to show a simulated notification every 10 seconds
            if (Math.random() < 0.25) {
                const event = events[Math.floor(Math.random() * events.length)];
                
                // Show red dot indicator
                const dot = document.getElementById('notifDot');
                if (dot) dot.style.display = 'block';
                
                UI.showToast(`[Live] ${event.t}`, event.m, event.type);
            }
        }, 10000);
    },

    /**
     * Render the Navbar based on auth state
     */
    renderNavbar: function() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;

        const isAuth = Auth.isLoggedIn();
        const isAdmin = Auth.isAdmin();
        const theme = document.documentElement.getAttribute('data-bs-theme');
        
        let navHtml = `
            <nav class="navbar navbar-expand-lg sticky-top">
                <div class="container">
                    <a class="navbar-brand" href="index.html">
                        <i class='bx bx-book-reader'></i> BookShare
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link ${location.pathname.includes('index.html') ? 'active' : ''}" href="index.html">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${location.pathname.includes('browse-books') || location.pathname === '/' ? 'active' : ''}" href="browse-books.html">Browse Books</a>
                            </li>
                            
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class='bx bx-compass'></i> Explore
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="recommendations.html"><i class='bx bx-chip text-primary'></i> AI Recommendations</a></li>
                                    <li><a class="dropdown-item" href="community.html"><i class='bx bx-group text-success'></i> Community Forum</a></li>
                                    <li><a class="dropdown-item" href="book-clubs.html"><i class='bx bx-coffee text-warning'></i> Virtual Book Clubs</a></li>
                                    <li><a class="dropdown-item" href="leaderboard.html"><i class='bx bx-trophy text-info'></i> Global Leaderboard</a></li>
                                </ul>
                            </li>
        `;

        if (isAuth) {
            navHtml += `
                            <li class="nav-item">
                                <a class="nav-link ${location.pathname.includes('my-books') ? 'active' : ''}" href="my-books.html">My Books</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${location.pathname.includes('exchange-requests') ? 'active' : ''}" href="exchange-requests.html">Requests</a>
                            </li>
            `;
            if (isAdmin) {
                navHtml += `
                            <li class="nav-item">
                                <a class="nav-link ${location.pathname.includes('admin') ? 'active' : ''} text-danger" href="admin.html">Admin Panel</a>
                            </li>
                `;
            }
        }

        navHtml += `
                        </ul>
                        <div class="d-flex align-items-center gap-3">
                            <button class="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" id="themeToggleBtn" style="width: 36px; height: 36px;" title="Toggle Dark/Light Mode" onclick="UI.toggleTheme()">
                                <i class='bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'} fs-5'></i>
                            </button>
        `;

        if (isAuth) {
            navHtml += `
                            <button class="btn btn-sm btn-light position-relative rounded-circle d-flex align-items-center justify-content-center" id="notifBtn" style="width: 36px; height: 36px; border: 1px solid var(--border-color);" onclick="document.getElementById('notifDot').style.display='none'; UI.showToast('Notifications', 'All caught up!', 'info');">
                                <i class='bx bx-bell fs-5'></i>
                                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" id="notifDot" style="display: none;">
                                    <span class="visually-hidden">New alerts</span>
                                </span>
                            </button>

                            <a href="dashboard.html" class="btn btn-outline-primary">Dashboard</a>
                            <button class="btn btn-primary" onclick="Auth.logout()">Logout</button>
            `;
        } else {
            navHtml += `
                            <a href="login.html" class="btn btn-outline-primary">Login</a>
                            <a href="register.html" class="btn btn-primary">Register</a>
            `;
        }

        navHtml += `
                        </div>
                    </div>
                </div>
            </nav>
        `;

        navbarContainer.innerHTML = navHtml;
    },

    /**
     * Render the Footer
     */
    renderFooter: function() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) return;

        footerContainer.innerHTML = `
            <footer class="mt-auto">
                <div class="container">
                    <div class="row gy-4">
                        <div class="col-md-6 text-center text-md-start">
                            <a href="index.html" class="fs-4 fw-bold text-white text-decoration-none d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                                <i class='bx bx-book-reader'></i> BookShare
                            </a>
                            <p class="text-white-50 mb-0">A powerful offline-capable college project, demonstrating serverless Vanilla JS architecture and modern UX patterns.</p>
                        </div>
                        <div class="col-md-6 text-center text-md-end text-white-50">
                            <p class="mb-2 text-white">Built with HTML, CSS, Vanilla JS, and LocalStorage.</p>
                            <div>
                                <a href="#" class="me-3 fs-4 text-white-50"><i class='bx bxl-github'></i></a>
                                <a href="#" class="fs-4 text-white-50"><i class='bx bxl-linkedin-square' ></i></a>
                            </div>
                        </div>
                    </div>
                    <hr class="border-secondary my-4">
                    <div class="text-center text-white-50 small">
                        &copy; ${new Date().getFullYear()} Book Exchange System. All rights reserved.
                    </div>
                </div>
            </footer>
        `;
    },

    /**
     * Show a global toast notification
     */
    showToast: function(title, message, type = 'info') {
        let toastContainer = document.getElementById('global-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'global-toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '1060';
            document.body.appendChild(toastContainer);
        }

        let icon = "bx-info-circle";
        if (type === 'success') icon = 'bx-check-circle';
        if (type === 'danger') icon = 'bx-error-circle';
        if (type === 'warning') icon = 'bx-error';

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class='bx ${icon} fs-5'></i>
                    <div>
                        <strong>${title}</strong><br>
                        <span class="small">${message}</span>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);
        
        const bsToast = new bootstrap.Toast(toastEl, { delay: type === 'warning' || type === 'info' ? 5000 : 3000 });
        bsToast.show();

        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
};

// Auto-initialize Theme synchronously
UI.initTheme();

// Auto-initialize UI components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UI.renderNavbar();
    UI.updateThemeIcon();
    UI.renderFooter();
    UI.startFakeRealtime();
    
    // Attach request event listener globally if .request-btn exists
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('request-btn') || e.target.closest('.request-btn')) {
            const btn = e.target.classList.contains('request-btn') ? e.target : e.target.closest('.request-btn');
            
            if (!Auth.isLoggedIn()) {
                UI.showToast('Please Login', 'You must be logged in to request a book.', 'warning');
                setTimeout(() => { window.location.href = 'login.html'; }, 1500);
                return;
            }
            
            // Check if Exchange module is loaded (meaning it's a page that supports it)
            if (typeof Exchange !== 'undefined') {
                const bookId = btn.getAttribute('data-book-id');
                const result = Exchange.requestBook(bookId);
                
                if (result.success) {
                    UI.showToast('Requested!', result.message, 'success');
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-success');
                    btn.innerHTML = '<i class="bx bx-check"></i> Requested';
                    btn.disabled = true;
                } else {
                    UI.showToast('Error', result.message, 'danger');
                }
            }
        }
    });

    // Make theme update automatically if data-bs-theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "data-bs-theme") {
                UI.updateThemeIcon();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});
