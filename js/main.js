/**
 * Main Application Script
 * Used for any global initialization outside of module scope.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-reset database if it's the old version without images for the demo
    if (localStorage.getItem('book_exchange_version') !== '1.3') {
        localStorage.clear();
        localStorage.setItem('book_exchange_version', '1.3');
        window.location.reload();
    }
    
    // We already initialize Database and UI inside their respective files
    // This file acts as an entry point placeholder for any global level events.
    console.log("Book Exchange System Frontend App Loaded.");
});
