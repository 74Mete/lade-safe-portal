function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        document.getElementById('message').innerText = data.message;
      } else {
        localStorage.setItem('user', data.username);
        localStorage.setItem('role', data.role);
        window.location.href = data.role === 'admin' ? 'admin.html' : 'dashboard.html';
      }
    });
}

function uploadFile() {
  const file = document.getElementById('file').files[0];
  const customer = document.getElementById('customer').value;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('customer', customer);

  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('uploadMessage').innerText = data.message;
    });
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

if (window.location.pathname.includes('dashboard.html')) {
  const username = localStorage.getItem('user');
  if (!username) return window.location.href = 'login.html';

  document.getElementById('user').innerText = username;

  fetch('/api/files/' + username)
    .then(res => res.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      files.forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${file.url}" target="_blank">${file.name}</a>`;
        fileList.appendChild(li);
      });
    });
}