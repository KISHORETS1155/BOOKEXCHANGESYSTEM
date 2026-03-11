/**
 * Books Module
 * Handles adding, editing, deleting, browsing, and searching books.
 */

const Books = {
    /**
     * Get all books
     */
    getAll: function() {
        return Database.get(DB_KEYS.BOOKS);
    },

    /**
     * Get all available books
     */
    getAvailable: function() {
        const books = this.getAll();
        return books.filter(b => b.status === 'available');
    },

    /**
     * Get books by owner ID
     * @param {string} ownerId 
     */
    getByOwner: function(ownerId) {
        const books = this.getAll();
        return books.filter(b => b.ownerId === ownerId);
    },

    /**
     * Get a specific book by ID
     */
    getById: function(bookId) {
        return Database.findById(DB_KEYS.BOOKS, bookId);
    },

    /**
     * Add a new book
     * @param {Object} bookData 
     */
    add: function(bookData) {
        if (!bookData.title || !bookData.author || !bookData.category) {
            return { success: false, message: "Title, author, and category are required." };
        }

        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: "You must be logged in to add a book." };
        }

        const newBook = {
            id: 'book_' + Database.generateId(),
            title: bookData.title.trim(),
            author: bookData.author.trim(),
            category: bookData.category,
            description: bookData.description ? bookData.description.trim() : "",
            condition: bookData.condition || "Good",
            image: bookData.image ? bookData.image.trim() : "",
            ownerId: currentUser.id,
            status: 'available', // available, pending_exchange, exchanged
            createdAt: new Date().toISOString()
        };

        Database.add(DB_KEYS.BOOKS, newBook);
        return { success: true, message: "Book added successfully.", book: newBook };
    },

    /**
     * Update an existing book
     */
    update: function(bookId, updates) {
        const book = this.getById(bookId);
        if (!book) return { success: false, message: "Book not found." };
        
        const currentUser = Auth.getCurrentUser();
        if (!currentUser || (book.ownerId !== currentUser.id && currentUser.role !== 'admin')) {
            return { success: false, message: "Unauthorized to update this book." };
        }

        // Prevent modification of critical fields
        delete updates.id;
        delete updates.ownerId;
        delete updates.createdAt;

        const updated = Database.update(DB_KEYS.BOOKS, bookId, updates);
        return { success: true, message: "Book updated successfully.", book: updated };
    },

    /**
     * Delete a book
     */
    delete: function(bookId) {
        const book = this.getById(bookId);
        if (!book) return { success: false, message: "Book not found." };

        const currentUser = Auth.getCurrentUser();
        if (!currentUser || (book.ownerId !== currentUser.id && currentUser.role !== 'admin')) {
            return { success: false, message: "Unauthorized to delete this book." };
        }

        // Check if there are active exchange requests for this book
        const requests = Database.get(DB_KEYS.REQUESTS);
        const activeRequests = requests.filter(r => r.bookId === bookId && r.status === 'pending');
        
        if (activeRequests.length > 0) {
            return { success: false, message: "Cannot delete book with pending exchange requests." };
        }

        // Remove from DB
        Database.delete(DB_KEYS.BOOKS, bookId);

        // Cleanup related requests (completed/rejected ones)
        const requestsToRemove = requests.filter(r => r.bookId === bookId);
        requestsToRemove.forEach(r => Database.delete(DB_KEYS.REQUESTS, r.id));

        return { success: true, message: "Book deleted successfully." };
    },

    /**
     * Search books by query
     * @param {string} query 
     * @param {Object} filters { category }
     */
    search: function(query, filters = {}) {
        let books = this.getAvailable();

        // Apply category filter
        if (filters.category && filters.category !== 'All') {
            books = books.filter(b => b.category === filters.category);
        }

        // Apply text query
        if (query && query.trim() !== '') {
            const q = query.toLowerCase().trim();
            books = books.filter(book => 
                book.title.toLowerCase().includes(q) ||
                book.author.toLowerCase().includes(q) ||
                book.category.toLowerCase().includes(q)
            );
        }

        return books;
    },

    /**
     * Get unique categories from all books
     */
    getCategories: function() {
        const books = this.getAll();
        const categories = [...new Set(books.map(b => b.category))];
        return categories.sort();
    }
};
