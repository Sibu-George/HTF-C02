// Sample user data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    department: "Management",
    phone: "+1 (555) 123-4567",
    lastLogin: "2024-02-15T10:30:00",
    projects: ["Downtown Office Complex", "Residential High-Rise"],
    permissions: ["full_access", "user_management", "project_management"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Project Manager",
    status: "Active",
    department: "Construction",
    phone: "+1 (555) 234-5678",
    lastLogin: "2024-02-15T09:15:00",
    projects: ["Downtown Office Complex", "Shopping Mall Renovation"],
    permissions: ["project_management", "resource_management"]
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Site Engineer",
    status: "Active",
    department: "Engineering",
    phone: "+1 (555) 345-6789",
    lastLogin: "2024-02-14T16:45:00",
    projects: ["Highway Expansion Project"],
    permissions: ["site_management", "quality_control"]
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Project Manager",
    status: "Active",
    department: "Construction",
    phone: "+1 (555) 456-7890",
    lastLogin: "2024-02-15T08:30:00",
    projects: ["Shopping Mall Renovation", "Hospital Extension"],
    permissions: ["project_management", "resource_management"]
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "Site Engineer",
    status: "Inactive",
    department: "Engineering",
    phone: "+1 (555) 567-8901",
    lastLogin: "2024-02-10T11:20:00",
    projects: ["Hospital Extension"],
    permissions: ["site_management", "quality_control"]
  },
  {
    id: 6,
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    role: "Resource Manager",
    status: "Active",
    department: "Operations",
    phone: "+1 (555) 678-9012",
    lastLogin: "2024-02-15T10:00:00",
    projects: ["All Projects"],
    permissions: ["resource_management", "inventory_control"]
  }
];

// Function to render users in the table
function renderUsers() {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${user.name}</div>
        <div class="text-xs text-gray-500">${user.department}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${user.email}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${getRoleClass(user.role)}">
          ${user.role}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${getStatusClass(user.status)}">
          ${user.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
        <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Helper function to get role class
function getRoleClass(role) {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'project manager':
      return 'bg-blue-100 text-blue-800';
    case 'site engineer':
      return 'bg-green-100 text-green-800';
    case 'resource manager':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to get status class
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Function to handle user editing
function editUser(id) {
  const user = users.find(u => u.id === id);
  if (user) {
    // Show edit modal or form
    showToast(`Editing user: ${user.name}`, 'info');
  }
}

// Function to handle user deletion
function deleteUser(id) {
  const user = users.find(u => u.id === id);
  if (user) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      const index = users.findIndex(u => u.id === id);
      users.splice(index, 1);
      renderUsers();
      showToast(`User ${user.name} deleted successfully`, 'success');
    }
  }
}

// Function to handle adding new user
document.querySelector('button').addEventListener('click', () => {
  showToast('Add new user functionality will be implemented', 'info');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderUsers();
}); 