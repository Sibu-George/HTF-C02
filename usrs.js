
// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    // Get user from localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      // Redirect to login if no user found
      window.location.href = '/login.html';
      return;
    }
    
    // Parse user data
    const user = JSON.parse(userJson);
    
    // Only allow admins to access this page
    if (user.role !== 'admin') {
      showToast({
        title: "Access Denied",
        description: "You don't have permission to access User Management. Redirecting to Dashboard.",
        type: "error"
      });
      
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 2000);
      
      return;
    }
    
    // Setup UI components
    setupUI(user);
    loadUsersData();
    
    // Setup event listeners
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('role-filter').addEventListener('change', handleRoleFilterChange);
    
    // Modal event listeners
    document.getElementById('modal-overlay').addEventListener('click', closeUserModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeUserModal);
    document.getElementById('close-modal-button').addEventListener('click', closeUserModal);
    
    // New user button
    document.getElementById('new-user-btn').addEventListener('click', () => {
      showToast({
        title: "Feature Coming Soon",
        description: "The ability to add new users will be available soon.",
        type: "default"
      });
    });
  });
  
  // Mock users data (in a real app, this would be fetched from a backend)
  const mockUsers = [
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@example.com', 
      role: 'admin',
      status: 'active',
      projects: [],
      lastActive: '2024-04-06T15:30:00',
      joinDate: '2023-05-15',
      phone: '+1 (555) 123-4567',
      department: 'Administration'
    },
    { 
      id: 2, 
      name: 'Project Manager', 
      email: 'manager@example.com', 
      role: 'project_manager',
      status: 'active',
      projects: [1, 2, 3, 4, 5],
      lastActive: '2024-04-07T09:45:00',
      joinDate: '2023-07-20',
      phone: '+1 (555) 987-6543',
      department: 'Construction Management'
    },
    { 
      id: 3, 
      name: 'Site Engineer', 
      email: 'engineer@example.com', 
      role: 'site_engineer',
      status: 'active',
      projects: [1, 3, 5],
      lastActive: '2024-04-07T10:15:00',
      joinDate: '2023-09-05',
      phone: '+1 (555) 456-7890',
      department: 'Engineering'
    },
    { 
      id: 4, 
      name: 'Sarah Johnson', 
      email: 'sarah.j@example.com', 
      role: 'project_manager',
      status: 'active',
      projects: [6],
      lastActive: '2024-04-06T16:20:00',
      joinDate: '2023-08-12',
      phone: '+1 (555) 234-5678',
      department: 'Construction Management'
    },
    { 
      id: 5, 
      name: 'Michael Chen', 
      email: 'm.chen@example.com', 
      role: 'site_engineer',
      status: 'inactive',
      projects: [],
      lastActive: '2024-03-15T11:30:00',
      joinDate: '2023-10-18',
      phone: '+1 (555) 345-6789',
      department: 'Engineering'
    },
    { 
      id: 6, 
      name: 'Jessica Williams', 
      email: 'j.williams@example.com', 
      role: 'admin',
      status: 'active',
      projects: [],
      lastActive: '2024-04-07T08:50:00',
      joinDate: '2023-06-10',
      phone: '+1 (555) 456-7890',
      department: 'Administration'
    }
  ];
  
  // Mock projects data for reference
  const mockProjects = [
    { id: 1, name: 'Downtown Office Building', manager: 2 },
    { id: 2, name: 'Seaside Condominiums', manager: 2 },
    { id: 3, name: 'Highway Bridge Replacement', manager: 2 },
    { id: 4, name: 'Green Energy Data Center', manager: 2 },
    { id: 5, name: 'Hospital Expansion Wing', manager: 2 },
    { id: 6, name: 'Historic Downtown Renovation', manager: 4 }
  ];
  
  // Filter state
  let searchQuery = '';
  let roleFilter = 'all';
  
  function setupUI(user) {
    // Setup sidebar
    setupSidebar(user);
    
    // Setup user profile
    setupUserProfile(user);
  }
  
  function loadUsersData() {
    // In a real app, this would fetch data from an API
    // Apply filters for display
    displayFilteredUsers();
    
    // Update summary cards
    updateUsersSummary();
    
    // Initialize chart
    initializeUserActivityChart();
  }
  
  function displayFilteredUsers() {
    // Apply search and role filters
    const filteredUsers = mockUsers.filter(user => {
      const matchesSearch = searchQuery ? 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) 
        : true;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    
    renderUsersTable(filteredUsers);
  }
  
  function renderUsersTable(users) {
    const tableBody = document.getElementById('users-table-body');
    const emptyState = document.getElementById('empty-state');
    
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
      tableBody.parentElement.parentElement.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    tableBody.parentElement.parentElement.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    users.forEach(user => {
      const row = document.createElement('tr');
      row.className = 'border-b hover:bg-gray-50';
      
      // Get assigned projects
      const projectCount = user.projects.length;
      
      // Get status badge class
      const statusBadgeClass = getStatusBadgeClass(user.status);
      
      // Format role for display
      const formattedRole = user.role.replace('_', ' ');
      
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
              ${user.name.charAt(0)}
            </div>
            <div class="ml-3">
              <div class="font-medium">${user.name}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap capitalize">${formattedRole}</td>
        <td class="px-6 py-4 whitespace-nowrap">${projectCount}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusBadgeClass}">
            ${user.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right">
          <button class="view-user-btn text-blue-600 hover:text-blue-800 mr-2">View</button>
          <button class="edit-user-btn text-gray-500 hover:text-gray-700">Edit</button>
        </td>
      `;
      
      // Add event listeners to the buttons
      const viewBtn = row.querySelector('.view-user-btn');
      viewBtn.addEventListener('click', () => {
        showUserDetails(user.id);
      });
      
      const editBtn = row.querySelector('.edit-user-btn');
      editBtn.addEventListener('click', () => {
        showEditUserModal(user.id);
      });
      
      tableBody.appendChild(row);
    });
  }
  
  function updateUsersSummary() {
    // Update total users count
    document.getElementById('total-users').textContent = mockUsers.length;
    
    // Update active projects count
    const activeProjects = mockProjects.filter(p => p.status !== 'completed').length;
    document.getElementById('active-projects').textContent = activeProjects;
  }
  
  function initializeUserActivityChart() {
    // Prepare data
    const roles = {
      admin: mockUsers.filter(u => u.role === 'admin').length,
      project_manager: mockUsers.filter(u => u.role === 'project_manager').length,
      site_engineer: mockUsers.filter(u => u.role === 'site_engineer').length
    };
    
    const statuses = {
      active: mockUsers.filter(u => u.status === 'active').length,
      inactive: mockUsers.filter(u => u.status === 'inactive').length
    };
    
    const ctx = document.getElementById('user-activity-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.userActivityChart) {
      window.userActivityChart.destroy();
    }
    
    window.userActivityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Admin', 'Project Manager', 'Site Engineer', 'Active Users', 'Inactive Users'],
        datasets: [{
          label: 'User Distribution',
          data: [roles.admin, roles.project_manager, roles.site_engineer, statuses.active, statuses.inactive],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Admin - Blue
            'rgba(245, 158, 11, 0.7)',  // Project Manager - Amber
            'rgba(16, 185, 129, 0.7)',  // Site Engineer - Green
            'rgba(34, 197, 94, 0.7)',   // Active Users - Emerald
            'rgba(107, 114, 128, 0.7)'  // Inactive Users - Gray
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)',
            'rgb(34, 197, 94)',
            'rgb(107, 114, 128)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users'
            }
          }
        }
      }
    });
  }
  
  function handleSearch(event) {
    searchQuery = event.target.value;
    displayFilteredUsers();
  }
  
  function handleRoleFilterChange(event) {
    roleFilter = event.target.value;
    displayFilteredUsers();
  }
  
  function showUserDetails(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('user-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = user.name;
    
    // Format dates
    const joinDate = formatDate(user.joinDate);
    const lastActive = formatDateTime(user.lastActive);
    
    // Get status badge class
    const statusBadgeClass = getStatusBadgeClass(user.status);
    
    // Get assigned projects
    const userProjects = mockProjects.filter(p => user.projects.includes(p.id));
    
    modalContent.innerHTML = `
      <div class="flex items-center mb-6">
        <div class="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center text-white text-xl">
          ${user.name.charAt(0)}
        </div>
        <div class="ml-4">
          <h4 class="text-lg font-medium">${user.name}</h4>
          <p class="text-sm text-gray-500">${user.email}</p>
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs mt-1 ${statusBadgeClass}">
            ${user.status}
          </span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">Role</p>
          <p class="capitalize">${user.role.replace('_', ' ')}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Department</p>
          <p>${user.department}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Phone</p>
          <p>${user.phone}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Join Date</p>
          <p>${joinDate}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Last Active</p>
          <p>${lastActive}</p>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="font-medium mb-2">Assigned Projects (${userProjects.length})</h4>
        ${userProjects.length > 0 ? `
          <div class="space-y-2">
            ${userProjects.map(project => `
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span>${project.name}</span>
                <button class="text-xs text-blue-600 hover:text-blue-800">View Project</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-sm text-gray-500 italic">No projects assigned</p>
        `}
      </div>
    `;
    
    // Display the modal
    modal.classList.remove('hidden');
  }
  
  function showEditUserModal(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Show toast as this feature is not implemented
    showToast({
      title: "Feature Coming Soon",
      description: "The ability to edit users will be available soon.",
      type: "default"
    });
  }
  
  function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.add('hidden');
  }
  
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  function formatDateTime(dateTimeString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  }
  