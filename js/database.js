/**
 * Database Module (LocalStorage wrapper)
 * Acts as the centralized storage layer for the application.
 */

const DB_KEYS = {
    USERS: 'book_exchange_users',
    BOOKS: 'book_exchange_books',
    REQUESTS: 'book_exchange_requests',
    NOTIFICATIONS: 'book_exchange_notifications'
};

const Database = {
    
    /**
     * Initialize the database with demo data if it doesn't exist
     */
    init: function() {
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            this._seedData();
            console.log("Database initialized with seed data.");
        }
    },

    /**
     * Read data from LocalStorage
     * @param {string} key 
     * @returns {Array} Parsed JSON array or empty array
     */
    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Write data to LocalStorage
     * @param {string} key 
     * @param {any} data 
     */
    set: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Generate unique ID
     */
    generateId: function() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    /**
     * Find item by ID
     */
    findById: function(key, id) {
        const items = this.get(key);
        return items.find(item => item.id === id);
    },

    /**
     * Add a new item
     */
    add: function(key, item) {
        const items = this.get(key);
        item.id = item.id || this.generateId();
        item.createdAt = item.createdAt || new Date().toISOString();
        items.push(item);
        this.set(key, items);
        return item;
    },

    /**
     * Update an item by ID
     */
    update: function(key, id, updates) {
        const items = this.get(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            this.set(key, items);
            return items[index];
        }
        return null;
    },

    /**
     * Delete an item by ID
     */
    delete: function(key, id) {
        const items = this.get(key);
        const filtered = items.filter(item => item.id !== id);
        this.set(key, filtered);
        return items.length !== filtered.length; // return true if an item was removed
    },

    /**
     * Internal method to seed demo data
     */
    _seedData: function() {
        // Sample Users
        const users = [
            {
                id: 'user_u1',
                name: 'Alice Smith',
                email: 'alice@example.com',
                password: 'password123', // In a real app, this would be hashed
                role: 'user',
                joinedDate: new Date(Date.now() - 86400000 * 30).toISOString() // 30 days ago
            },
            {
                id: 'user_u2',
                name: 'Bob Johnson',
                email: 'bob@example.com',
                password: 'password123',
                role: 'user',
                joinedDate: new Date(Date.now() - 86400000 * 15).toISOString()
            },
            {
                id: 'user_admin',
                name: 'System Admin',
                email: 'admin@bookexchange.com',
                password: 'admin',
                role: 'admin',
                joinedDate: new Date(Date.now() - 86400000 * 60).toISOString()
            }
        ];

        // Sample Books
        const books = [
            {
                id: 'book_b1',
                title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
                author: 'Robert C. Martin',
                category: 'Programming',
                description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
            },
            {
                id: 'book_b2',
                title: 'Advanced Mathematics',
                author: 'Jane Doe',
                category: 'Mathematics',
                description: 'A deep dive into advanced calculus, algebra, and complex mathematical modeling.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: 'book_b3',
                title: 'Introduction to Scientific Research',
                author: 'Thomas H. Cormen',
                category: 'Science',
                description: 'A comprehensive guide to laboratory practices and experimental science.',
                condition: 'Fair',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
             {
                id: 'book_b4',
                title: 'Electrical and Mechanical Engineering',
                author: 'David Baker',
                category: 'Engineering',
                description: 'Everything you need to know to master the subject - in one book!',
                condition: 'Like New',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
            },
            {
                id: 'book_b5',
                title: 'Memoirs of a Baby',
                author: 'Josephine Daskam',
                category: 'Literature',
                description: 'A captivating classic literature collection featuring memoirs and stories.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
            },
            {
                id: 'book_b6',
                title: 'The Great History Collection',
                author: 'Various Authors',
                category: 'History',
                description: 'Historical records of humankind throughout the ages in a beautiful hardcover.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
            },
            {
                id: 'book_b7',
                title: 'Python Crash Course',
                author: 'Eric Matthes',
                category: 'Programming',
                description: 'A hands-on, project-based introduction to programming.',
                condition: 'Like New',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
            },
            {
                id: 'book_b8',
                title: 'Calculus: Early Transcendentals',
                author: 'James Stewart',
                category: 'Mathematics',
                description: 'Widely renowned for its mathematical precision and accuracy.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
            },
            {
                id: 'book_b9',
                title: 'Astrophysics for People in a Hurry',
                author: 'Neil deGrasse Tyson',
                category: 'Science',
                description: 'What is the nature of space and time? How do we fit within the universe?',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 11).toISOString()
            },
            {
                id: 'book_b10',
                title: 'Structures: Or Why Things Don\'t Fall Down',
                author: 'J.E. Gordon',
                category: 'Engineering',
                description: 'An informal explanation of the basic forces that hold together the ordinary and essential things of this world.',
                condition: 'Fair',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
            },
            {
                id: 'book_b11',
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                category: 'Literature',
                description: 'A classic romantic novel of manners.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
            },
            {
                id: 'book_b12',
                title: 'A People\'s History of the United States',
                author: 'Howard Zinn',
                category: 'History',
                description: 'A scholarly and thoughtful book on American history.',
                condition: 'Like New',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
            },
            {
                id: 'book_b13',
                title: `Automate the Boring Stuff with Python`,
                author: `Al Sweigart`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
            },
            {
                id: 'book_b14',
                title: `Eloquent JavaScript`,
                author: `Marijn Haverbeke`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
            },
            {
                id: 'book_b15',
                title: `Design Patterns`,
                author: `Erich Gamma`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
            },
            {
                id: 'book_b16',
                title: `Refactoring`,
                author: `Martin Fowler`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 17).toISOString()
            },
            {
                id: 'book_b17',
                title: `Head First Design Patterns`,
                author: `Eric Freeman`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
            },
            {
                id: 'book_b18',
                title: `Code Complete`,
                author: `Steve McConnell`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 19).toISOString()
            },
            {
                id: 'book_b19',
                title: `Cracking the Coding Interview`,
                author: `Gayle Laakmann McDowell`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
            },
            {
                id: 'book_b20',
                title: `Grokking Algorithms`,
                author: `Aditya Bhargava`,
                category: 'Programming',
                description: 'A great book about programming. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/PROGRAMING BOOK.jpg',
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
            },
            {
                id: 'book_b21',
                title: `Linear Algebra Done Right`,
                author: `Sheldon Axler`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: 'book_b22',
                title: `Introduction to Real Analysis`,
                author: `Robert G. Bartle`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
            },
            {
                id: 'book_b23',
                title: `Abstract Algebra`,
                author: `David S. Dummit`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
            },
            {
                id: 'book_b24',
                title: `Principles of Mathematical Analysis`,
                author: `Walter Rudin`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: 'book_b25',
                title: `Calculus`,
                author: `Michael Spivak`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
            },
            {
                id: 'book_b26',
                title: `Topology`,
                author: `James Munkres`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
            },
            {
                id: 'book_b27',
                title: `Discrete Mathematics and Its Applications`,
                author: `Kenneth H. Rosen`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
            },
            {
                id: 'book_b28',
                title: `Introduction to the Theory of Computation`,
                author: `Michael Sipser`,
                category: 'Mathematics',
                description: 'A great book about mathematics. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/MATHS.avif',
                createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
            },
            {
                id: 'book_b29',
                title: `A Brief History of Time`,
                author: `Stephen Hawking`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
            },
            {
                id: 'book_b30',
                title: `Cosmos`,
                author: `Carl Sagan`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 11).toISOString()
            },
            {
                id: 'book_b31',
                title: `The Selfish Gene`,
                author: `Richard Dawkins`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
            },
            {
                id: 'book_b32',
                title: `The Origin of Species`,
                author: `Charles Darwin`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 13).toISOString()
            },
            {
                id: 'book_b33',
                title: `QED: The Strange Theory of Light and Matter`,
                author: `Richard Feynman`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
            },
            {
                id: 'book_b34',
                title: `The Double Helix`,
                author: `James D. Watson`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
            },
            {
                id: 'book_b35',
                title: `Silent Spring`,
                author: `Rachel Carson`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
            },
            {
                id: 'book_b36',
                title: `The Elegant Universe`,
                author: `Brian Greene`,
                category: 'Science',
                description: 'A great book about science. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/SCIENCE.jpg',
                createdAt: new Date(Date.now() - 86400000 * 17).toISOString()
            },
            {
                id: 'book_b37',
                title: `The Art of Electronics`,
                author: `Paul Horowitz`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
            },
            {
                id: 'book_b38',
                title: `Introduction to Electrodynamics`,
                author: `David J. Griffiths`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 19).toISOString()
            },
            {
                id: 'book_b39',
                title: `Shigley Mechanical Engineering Design`,
                author: `Richard Budynas`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
            },
            {
                id: 'book_b40',
                title: `Fundamentals of Thermodynamics`,
                author: `Claus Borgnakke`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
            },
            {
                id: 'book_b41',
                title: `Fluid Mechanics`,
                author: `Frank M. White`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: 'book_b42',
                title: `Control Systems Engineering`,
                author: `Norman S. Nise`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
            },
            {
                id: 'book_b43',
                title: `Materials Science and Engineering`,
                author: `William D. Callister`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
            },
            {
                id: 'book_b44',
                title: `Machinery Handbook`,
                author: `Erik Oberg`,
                category: 'Engineering',
                description: 'A great book about engineering. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/ENGNEEERING.jpg',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: 'book_b45',
                title: `1984`,
                author: `George Orwell`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
            },
            {
                id: 'book_b46',
                title: `To Kill a Mockingbird`,
                author: `Harper Lee`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
            },
            {
                id: 'book_b47',
                title: `The Great Gatsby`,
                author: `F. Scott Fitzgerald`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
            },
            {
                id: 'book_b48',
                title: `Moby-Dick`,
                author: `Herman Melville`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
            },
            {
                id: 'book_b49',
                title: `War and Peace`,
                author: `Leo Tolstoy`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
            },
            {
                id: 'book_b50',
                title: `Crime and Punishment`,
                author: `Fyodor Dostoevsky`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 11).toISOString()
            },
            {
                id: 'book_b51',
                title: `The Catcher in the Rye`,
                author: `J.D. Salinger`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
            },
            {
                id: 'book_b52',
                title: `Jane Eyre`,
                author: `Charlotte Brontë`,
                category: 'Literature',
                description: 'A great book about literature. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/LITRACTURE.avif',
                createdAt: new Date(Date.now() - 86400000 * 13).toISOString()
            },
            {
                id: 'book_b53',
                title: `Guns, Germs, and Steel`,
                author: `Jared Diamond`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
            },
            {
                id: 'book_b54',
                title: `SPQR: A History of Ancient Rome`,
                author: `Mary Beard`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
            },
            {
                id: 'book_b55',
                title: `The Guns of August`,
                author: `Barbara W. Tuchman`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
            },
            {
                id: 'book_b56',
                title: `The Rise and Fall of the Third Reich`,
                author: `William L. Shirer`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 17).toISOString()
            },
            {
                id: 'book_b57',
                title: `1776`,
                author: `David McCullough`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
            },
            {
                id: 'book_b58',
                title: `The Silk Roads`,
                author: `Peter Frankopan`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u2',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 19).toISOString()
            },
            {
                id: 'book_b59',
                title: `Bury My Heart at Wounded Knee`,
                author: `Dee Brown`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Excellent',
                ownerId: 'user_admin',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
            },
            {
                id: 'book_b60',
                title: `The Diary of a Young Girl`,
                author: `Anne Frank`,
                category: 'History',
                description: 'A great book about history. Highly recommended read.',
                condition: 'Good',
                ownerId: 'user_u1',
                status: 'available',
                image: 'assets/images/HISTORY.jpg',
                createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
            }
        ];

        // Sample Exchange Requests
        const exchangeRequests = [
            {
                id: 'req_r1',
                bookId: 'book_b3',
                requesterId: 'user_u1',
                ownerId: 'user_u2',
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ];

        this.set(DB_KEYS.USERS, users);
        this.set(DB_KEYS.BOOKS, books);
        this.set(DB_KEYS.REQUESTS, exchangeRequests);
        this.set(DB_KEYS.NOTIFICATIONS, []);
    }
};

// Initialize DB immediately upon loading the script
Database.init();
