// Common functionality used across all pages

// Common navigation items
const navigationItems = {
  admin: [
    { name: 'Dashboard', href: 'index.html', icon: 'home' },
    { name: 'User Management', href: 'users.html', icon: 'users' },
    { name: 'Projects', href: 'projects.html', icon: 'projects' },
    { name: 'Resources', href: 'resources.html', icon: 'resources' }
  ],
  project_manager: [
    { name: 'Dashboard', href: 'index.html', icon: 'home' },
    { name: 'Projects', href: 'projects.html', icon: 'projects' },
    { name: 'Resources', href: 'resources.html', icon: 'resources' }
  ],
  site_engineer: [
    { name: 'Dashboard', href: 'index.html', icon: 'home' },
    { name: 'Tasks', href: 'tasks.html', icon: 'tasks' },
    { name: 'Resources', href: 'resources.html', icon: 'resources' }
  ]
};

// Icons mapping
const icons = {
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
    <path d="M14 19a6 6 0 0 0-12 0"></path>
    <circle cx="8" cy="9" r="4"></circle>
    <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"></path>
  </svg>`,
  projects: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
    <rect width="16" height="20" x="4" y="2" rx="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <circle cx="10" cy="9" r="2"></circle>
    <path d="M14 9h4"></path>
    <path d="M14 13h4"></path>
    <path d="M6 13h4"></path>
  </svg>`,
  resources: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
    <path d="m2 17 10 4 10-4"></path>
    <path d="m2 12 10 4 10-4"></path>
    <path d="m2 7 10 4 10-4"></path>
  </svg>`,
  tasks: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>`
};

// Common functions
function setupNavigation(role) {
  const navigationContainer = document.getElementById('navigation-links');
  if (!navigationContainer) return;

  const items = navigationItems[role] || navigationItems.site_engineer;
  
  navigationContainer.innerHTML = '';
  
  items.forEach(item => {
    const li = document.createElement('li');
    const isActive = window.location.pathname.endsWith(item.href);
    
    li.innerHTML = `
      <a 
        href="${item.href}" 
        class="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? "bg-blue-800 text-white" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }"
      >
        ${icons[item.icon]}
        <span class="text-sm font-medium">${item.name}</span>
      </a>
    `;
    
    navigationContainer.appendChild(li);
  });
}

function setupUserProfile(user) {
  const userProfileContainer = document.getElementById('user-profile');
  if (!userProfileContainer) return;

  userProfileContainer.innerHTML = `
    <div class="flex-shrink-0">
      <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
        ${user.name.charAt(0) || 'U'}
      </div>
    </div>
    <div class="flex flex-col">
      <span class="text-sm font-medium truncate">${user.name || 'User'}</span>
      <span class="text-xs text-gray-400 capitalize">${user.role.replace('_', ' ')}</span>
    </div>
  `;
}

function handleLogout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('hidden');
  }
}

// Toast notification system
function showToast({ title, description, type = 'default' }) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

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

  const dismissButton = toast.querySelector('button');
  dismissButton.addEventListener('click', () => {
    removeToast(toast);
  });

  setTimeout(() => {
    removeToast(toast);
  }, 5000);
}

function removeToast(toast) {
  toast.classList.add('animate-fade-out');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Add animation styles if not already added
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
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
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the login page
  const isLoginPage = window.location.pathname.endsWith('login.html');
  
  if (!isLoginPage) {
    // Check authentication
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      window.location.href = 'login.html';
      return;
    }

    const user = JSON.parse(userJson);
    
    // Setup navigation and user profile
    setupNavigation(user.role);
    setupUserProfile(user);

    // Setup event listeners
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
  }
});
  