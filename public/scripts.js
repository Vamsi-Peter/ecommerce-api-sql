// ✅ Load token from localStorage
let token = localStorage.getItem('token') || '';

const showMessage = (elementId, message, type = 'info') => {
  const el = document.getElementById(elementId);
  el.style.color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'black';
  el.innerText = message;
};

// ✅ Register Function
async function register() {
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;

  if (!username || !email || !password) {
    return showMessage('registerStatus', '❌ All fields are required', 'error');
  }

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();

    if (data.message?.toLowerCase().includes('success')) {
      showMessage('registerStatus', '✅ Registered successfully!', 'success');
    } else {
      showMessage('registerStatus', `❌ ${data.message || 'Registration failed'}`, 'error');
    }
  } catch (err) {
    showMessage('registerStatus', `❌ Error: ${err.message}`, 'error');
  }
}

// ✅ Login Function
async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    return showMessage('loginStatus', '❌ Email and password are required', 'error');
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      token = data.token;
      localStorage.setItem('token', token);
      showMessage('loginStatus', '✅ Login successful', 'success');
    } else {
      showMessage('loginStatus', `❌ ${data.message || 'Login failed'}`, 'error');
    }
  } catch (err) {
    showMessage('loginStatus', `❌ Error: ${err.message}`, 'error');
  }
}

// ✅ Logout Function
function logout() {
  token = '';
  localStorage.removeItem('token');
  alert('You have been logged out.');
  showMessage('loginStatus', '👋 Logged out');
}

// ✅ Fetch Products
async function fetchProducts() {
  const list = document.getElementById('productList');
  list.innerHTML = '<li>⏳ Loading products...</li>';

  try {
    const res = await fetch('/api/products');
    const data = await res.json();

    list.innerHTML = '';

    const products = data.products || data;

    if (!products || products.length === 0) {
      list.innerHTML = '<li>No products available</li>';
      return;
    }

    products.forEach(p => {
      const li = document.createElement('li');
      li.innerText = `${p.id} - ${p.name} - ₹${p.price}`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = `<li>❌ Error loading products</li>`;
    console.error(err);
  }
}

// ✅ Add to Cart
async function addToCart() {
  const productId = document.getElementById('productId').value;
  const quantity = document.getElementById('quantity').value;

  if (!token) {
    return showMessage('cartStatus', '❌ Please login first', 'error');
  }

  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });

    const data = await res.json();
    showMessage('cartStatus', data.message || '✅ Item added to cart', 'success');
  } catch (err) {
    showMessage('cartStatus', `❌ Error: ${err.message}`, 'error');
  }
}

// ✅ View Cart
async function viewCart() {
  const list = document.getElementById('cartItems');
  list.innerHTML = '';

  if (!token) {
    list.innerHTML = '<li>❌ Please login to view cart</li>';
    return;
  }

  try {
    const res = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!data.cartItems || data.cartItems.length === 0) {
      list.innerHTML = '<li>🛒 Cart is empty</li>';
      return;
    }

    data.cartItems.forEach(item => {
      const li = document.createElement('li');
      li.innerText = `${item.Product.name} x ${item.quantity}`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = '<li>❌ Failed to fetch cart</li>';
  }
}

// ✅ Place Order
async function placeOrder() {
  if (!token) {
    return showMessage('orderStatus', '❌ Please login to place an order', 'error');
  }

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    showMessage('orderStatus', data.message || '✅ Order placed!', 'success');
  } catch (err) {
    showMessage('orderStatus', `❌ Error: ${err.message}`, 'error');
  }
}

