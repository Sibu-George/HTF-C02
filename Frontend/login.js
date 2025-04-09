// Demo users with their roles and password
const users = [
  {
    email: 'admin@smartresource.com',
    password: 'password',
    role: 'admin',
    dashboardUrl: 'adindex.html'
  },
  {
    email: 'pm@smartresource.com',
    password: 'password',
    role: 'project_manager',
    dashboardUrl: 'pmindex.html'
  },
  {
    email: 'supervisor@smartresource.com',
    password: 'password',
    role: 'supervisor',
    dashboardUrl: 'ssindex.html'
  }
];

// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('errorMessage');
const toastContainer = document.getElementById('toastContainer');

// Event listeners
loginForm.addEventListener('submit', handleLogin);

// Login handler
async function handleLogin(event) {
event.preventDefault();

const email = emailInput.value;
const password = passwordInput.value;

// Show loading state
submitButton.textContent = "Logging in...";
submitButton.disabled = true;

// Hide previous error messages
errorMessage.textContent = '';
errorMessage.classList.add('hidden');

try {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store user info in session storage for persistence
    sessionStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      role: user.role
    }));
    
    // Show success toast
    showToast({
      title: "Login successful",
      description: `Welcome back, ${user.role}!`,
      type: "success"
    });
    
    // Redirect to appropriate dashboard
    window.location.href = user.dashboardUrl;
  } else {
    // Show error
    errorMessage.textContent = 'Invalid email or password';
    errorMessage.classList.remove('hidden');
    
    showToast({
      title: "Login failed",
      description: "Invalid email or password",
      type: "error"
    });
  }
} catch (error) {
  // Show error
  errorMessage.textContent = 'An error occurred during login';
  errorMessage.classList.remove('hidden');
  
  showToast({
    title: "Login error",
    description: "An error occurred during login",
    type: "error"
  });
  
  console.error('Login error:', error);
} finally {
  // Reset button state
  submitButton.textContent = "Login";
  submitButton.disabled = false;
}
}

// Toast notification function (simplified version of React toast)
function showToast({ title, description, type = 'default' }) {
const toast = document.createElement('div');
toast.className = `mb-4 p-4 rounded-md shadow-lg border ${
  type === 'error' ? 'bg-red-50 border-red-400 text-red-800' : 
  type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 
  'bg-white border-gray-200'
} animate-fade-in`;

toast.innerHTML = `
  <div class="flex justify-between">
    <h5 class="font-medium">${title}</h5>
    <button class="text-gray-400 hover:text-gray-600">&times;</button>
  </div>
  <p class="text-sm mt-1">${description}</p>
`;

toastContainer.appendChild(toast);

// Add dismiss functionality
const dismissButton = toast.querySelector('button');
dismissButton.addEventListener('click', () => {
  removeToast(toast);
});

// Auto dismiss after 5 seconds
setTimeout(() => {
  removeToast(toast);
}, 5000);
}

function removeToast(toast) {
toast.classList.add('animate-fade-out');
setTimeout(() => {
  toastContainer.removeChild(toast);
}, 300);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}
.animate-fade-out {
  animation: fadeOut 0.3s ease-in-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
}
`;
document.head.appendChild(style);

// Add role-based access control function for the index pages
function checkPageAccess() {
// Get user from localStorage
const userString = localStorage.getItem('user');
if (!userString) {
  // No user found, redirect to login
  window.location.href = 'login.html';
  return null;
}

try {
  const user = JSON.parse(userString);
  // Make sure we're on the correct page for this user role
  const currentPage = window.location.pathname.split('/').pop();
  
  // Check if user is on the correct page based on their role
  if (user.redirectPage && currentPage !== user.redirectPage) {
    // User is on the wrong index page, redirect to correct one
    console.log(`User is on wrong page. Redirecting to ${user.redirectPage}`);
    window.location.href = user.redirectPage;
    return null;
  }
  
  return user;
} catch (error) {
  console.error('Error parsing user data:', error);
  localStorage.removeItem('user'); // Clear invalid data
  window.location.href = 'login.html';
  return null;
}
}

// You can add this code to each index page to ensure only authorized users can access it
/*
document.addEventListener('DOMContentLoaded', () => {
const user = checkPageAccess();
if (user) {
  // Initialize the page with user data
  console.log(`Welcome, ${user.name} (${user.role})`);
  // Update UI elements with user information
  // example: document.getElementById('userName').textContent = user.name;
}
});
*/

// Initialize the login form
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  
  // Set up form submission handler
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user info in session storage for persistence
      sessionStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        role: user.role
      }));
      
      // Redirect to appropriate dashboard
      window.location.href = user.dashboardUrl;
    } else {
      // Show error message
      errorMessage.textContent = 'Invalid email or password';
      errorMessage.classList.remove('hidden');
    }
  });
  
  // Fill demo credentials when clicking on a demo option
  const demoOptions = document.querySelectorAll('.demo-option');
  demoOptions.forEach(option => {
    option.addEventListener('click', function() {
      const email = this.getAttribute('data-email');
      document.getElementById('email').value = email;
      document.getElementById('password').value = 'password';
      errorMessage.classList.add('hidden');
    });
  });
});