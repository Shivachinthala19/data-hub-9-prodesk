const API_URL = 'http://localhost:5000/posts';

document.addEventListener('DOMContentLoaded', fetchPosts);
document.getElementById('refresh-btn').addEventListener('click', fetchPosts);
document.getElementById('post-form').addEventListener('submit', handleSubmit);
document.getElementById('cancel-btn').addEventListener('click', resetForm);

let isEditing = false;

// Fetch and display all posts
function fetchPosts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(posts => {
            const container = document.getElementById('posts-container');
            container.innerHTML = ''; // clear current list

            if (posts.length === 0) {
                container.innerHTML = '<p>No posts found.</p>';
                return;
            }

            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post-item';
                div.innerHTML = `
                    <h3>Title: ${post.title}</h3>
                    <p><strong>Author:</strong> ${post.author}</p>
                    <p>${post.content}</p>
                    <div class="actions">
                        <button class="edit-btn" onclick="editPost(${post.id})">Edit</button>
                        <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(err => console.error('Error fetching posts:', err));
}

// Handle form submission (POST or PUT)
function handleSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;
    const id = document.getElementById('post-id').value;

    const data = { title, content, author };

    if (isEditing) {
        // PUT request
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => {
                showMessage('Post updated successfully!');
                resetForm();
                fetchPosts();
            });
    } else {
        // POST request
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => {
                showMessage('Post created successfully!');
                resetForm();
                fetchPosts();
            });
    }
}

// Edit a post
function editPost(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(post => {
            document.getElementById('title').value = post.title;
            document.getElementById('content').value = post.content;
            document.getElementById('author').value = post.author;
            document.getElementById('post-id').value = post.id;

            document.getElementById('form-title').innerText = 'Edit Post';
            document.getElementById('submit-btn').innerText = 'Update';
            document.getElementById('cancel-btn').style.display = 'inline-block';

            isEditing = true;
        });
}

// Delete a post
function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                showMessage('Post deleted successfully!');
                fetchPosts();
            });
    }
}

// Reset the form back to create mode
function resetForm() {
    document.getElementById('post-form').reset();
    document.getElementById('post-id').value = '';
    document.getElementById('form-title').innerText = 'Create New Post';
    document.getElementById('submit-btn').innerText = 'Submit';
    document.getElementById('cancel-btn').style.display = 'none';
    isEditing = false;
}

// Display a temporary message
function showMessage(msg) {
    const el = document.getElementById('message');
    el.innerText = msg;
    setTimeout(() => {
        el.innerText = '';
    }, 3000);
}
