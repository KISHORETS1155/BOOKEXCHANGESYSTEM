/**
 * Admin Module
 * Handles administrative actions such as deleting users and globally viewing system state.
 */

const Admin = {
    /**
     * Get system statistics
     */
    getStats: function() {
        const users = Database.get(DB_KEYS.USERS);
        const books = Database.get(DB_KEYS.BOOKS);
        const requests = Database.get(DB_KEYS.REQUESTS);

        return {
            totalUsers: users.length,
            totalBooks: books.length,
            totalExchanges: requests.filter(r => r.status === 'accepted').length,
            pendingRequests: requests.filter(r => r.status === 'pending').length
        };
    },

    /**
     * Get all users
     */
    getAllUsers: function() {
        return Database.get(DB_KEYS.USERS);
    },

    /**
     * Delete a user completely from the system
     * @param {string} userId 
     */
    deleteUser: function(userId) {
        if (!Auth.isAdmin()) return { success: false, message: "Unauthorized." };

        const user = Database.findById(DB_KEYS.USERS, userId);
        if (!user) return { success: false, message: "User not found." };
        if (user.role === 'admin') return { success: false, message: "Cannot delete an admin." };

        // 1. Delete user's books
        const books = Database.get(DB_KEYS.BOOKS);
        const userBooks = books.filter(b => b.ownerId === userId);
        userBooks.forEach(b => Books.delete(b.id)); // Using Books.delete also cleans requests for that book

        // 2. Delete user's outgoing requests
        const requests = Database.get(DB_KEYS.REQUESTS);
        const userRequests = requests.filter(r => r.requesterId === userId);
        userRequests.forEach(r => Database.delete(DB_KEYS.REQUESTS, r.id));

        // 3. Delete user
        Database.delete(DB_KEYS.USERS, userId);

        return { success: true, message: `User ${user.name} and all associated data deleted.` };
    },

    /**
     * Delete a book (Admin override)
     * @param {string} bookId 
     */
    deleteBook: function(bookId) {
        if (!Auth.isAdmin()) return { success: false, message: "Unauthorized." };

        // We can just use the Books module because it checks if the current user is an admin
        return Books.delete(bookId);
    }
};
