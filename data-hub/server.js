const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Database
let blogPosts = [];
let idCounter = 1;

// Phase 1 static endpoints check (as requested for scaffolding)
// Actually we integrate Phase 2 logic directly:

// GET /posts: Serve the entire array payload
app.get('/posts', (req, res) => {
    res.json(blogPosts);
});

// GET /posts/:id: Retrieve specific post by id
app.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = blogPosts.find(p => p.id === id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// POST /posts: Intercept and extract payload from req.body and push to array
app.post('/posts', (req, res) => {
    const newPost = {
        id: idCounter++,
        ...req.body
    };
    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

// PUT /posts/:id: Update existing post
app.put('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = blogPosts.findIndex(p => p.id === id);
    if (index !== -1) {
        blogPosts[index] = { ...blogPosts[index], ...req.body, id };
        res.json(blogPosts[index]);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// DELETE /posts/:id: Filter and remove object matching passed ID
app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = blogPosts.length;
    blogPosts = blogPosts.filter(p => p.id !== id);
    
    if (blogPosts.length < initialLength) {
        res.json({ message: "Post deleted successfully" });
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
