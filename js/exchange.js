/**
 * Exchange Module
 * Handles requesting books, accepting/rejecting requests.
 */

const Exchange = {
    /**
     * Get all requests
     */
    getAll: function() {
        return Database.get(DB_KEYS.REQUESTS);
    },

    /**
     * Get requests made by the current user (Outgoing)
     * @param {string} userId 
     */
    getOutgoingRequests: function(userId) {
        const requests = this.getAll();
        return requests.filter(r => r.requesterId === userId);
    },

    /**
     * Get requests received by the current user (Incoming)
     * @param {string} userId 
     */
    getIncomingRequests: function(userId) {
        const requests = this.getAll();
        return requests.filter(r => r.ownerId === userId);
    },

    /**
     * Request a book exchange
     * @param {string} bookId 
     */
    requestBook: function(bookId) {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return { success: false, message: "Please log in to request books." };

        const book = Books.getById(bookId);
        if (!book) return { success: false, message: "Book not found." };
        if (book.ownerId === currentUser.id) return { success: false, message: "You cannot request your own book." };
        if (book.status !== 'available') return { success: false, message: "This book is currently not available." };

        // Check if already requested
        const requests = this.getAll();
        const existingRequest = requests.find(r => r.bookId === bookId && r.requesterId === currentUser.id && r.status === 'pending');
        if (existingRequest) {
            return { success: false, message: "You have already requested this book." };
        }

        const newRequest = {
            id: 'req_' + Database.generateId(),
            bookId: book.id,
            requesterId: currentUser.id,
            ownerId: book.ownerId,
            status: 'pending', // pending, accepted, rejected, completed
            createdAt: new Date().toISOString()
        };

        Database.add(DB_KEYS.REQUESTS, newRequest);
        return { success: true, message: "Exchange request sent successfully!" };
    },

    /**
     * Accept an exchange request
     * @param {string} requestId 
     */
    acceptRequest: function(requestId) {
        const requests = this.getAll();
        const request = requests.find(r => r.id === requestId);
        if (!request) return { success: false, message: "Request not found." };

        const currentUser = Auth.getCurrentUser();
        if (request.ownerId !== currentUser.id && (!currentUser || currentUser.role !== 'admin')) {
            return { success: false, message: "Unauthorized action." };
        }

        // Update request status
        Database.update(DB_KEYS.REQUESTS, requestId, { status: 'accepted' });

        // Reject other pending requests for the same book
        const otherRequests = requests.filter(r => r.bookId === request.bookId && r.id !== requestId && r.status === 'pending');
        otherRequests.forEach(r => {
            Database.update(DB_KEYS.REQUESTS, r.id, { status: 'rejected' });
        });

        // Update book status
        Books.update(request.bookId, { status: 'exchanged' });

        return { success: true, message: "Request accepted successfully." };
    },

    /**
     * Reject an exchange request
     * @param {string} requestId 
     */
    rejectRequest: function(requestId) {
        const requests = this.getAll();
        const request = requests.find(r => r.id === requestId);
        if (!request) return { success: false, message: "Request not found." };

        const currentUser = Auth.getCurrentUser();
        if (request.ownerId !== currentUser.id && (!currentUser || currentUser.role !== 'admin')) {
            return { success: false, message: "Unauthorized action." };
        }

        Database.update(DB_KEYS.REQUESTS, requestId, { status: 'rejected' });
        return { success: true, message: "Request rejected." };
    },

    /**
     * Cancel outgoing request
     */
    cancelRequest: function(requestId) {
        const requests = this.getAll();
        const request = requests.find(r => r.id === requestId);
        if (!request) return { success: false, message: "Request not found." };

        const currentUser = Auth.getCurrentUser();
        if (request.requesterId !== currentUser.id) {
            return { success: false, message: "Unauthorized action." };
        }

        if (request.status !== 'pending') {
            return { success: false, message: "Cannot cancel a request that is already processed." };
        }

        Database.delete(DB_KEYS.REQUESTS, requestId);
        return { success: true, message: "Request cancelled." };
    }
};
