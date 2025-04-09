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
    
    // Setup UI components
    setupUI(user);
    loadResourcesData();
    
    // Setup event listeners
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('resource-type-filter').addEventListener('change', handleFilterChange);
  });
  
  // Mock resources data (in a real app, this would be fetched from a backend)
  const mockResources = [
    { 
      id: 1, 
      name: 'Construction Worker', 
      type: 'labor', 
      quantity: 12, 
      unit: 'person', 
      cost: 35, 
      availability: 85 
    },
    { 
      id: 2, 
      name: 'Excavator', 
      type: 'equipment', 
      quantity: 3, 
      unit: 'machine', 
      cost: 450, 
      availability: 65 
    },
    { 
      id: 3, 
      name: 'Concrete', 
      type: 'material', 
      quantity: 500, 
      unit: 'kg', 
      cost: 12, 
      availability: 95 
    },
    { 
      id: 4, 
      name: 'Steel Beams', 
      type: 'material', 
      quantity: 120, 
      unit: 'pcs', 
      cost: 250, 
      availability: 70 
    },
    { 
      id: 5, 
      name: 'Project Manager', 
      type: 'labor', 
      quantity: 1, 
      unit: 'person', 
      cost: 75, 
      availability: 100 
    },
    { 
      id: 6, 
      name: 'Cement Mixer', 
      type: 'equipment', 
      quantity: 4, 
      unit: 'machine', 
      cost: 180, 
      availability: 50 
    },
    { 
      id: 7, 
      name: 'Brick', 
      type: 'material', 
      quantity: 3000, 
      unit: 'pcs', 
      cost: 2, 
      availability: 90 
    }
  ];
  
  // Filter state
  let searchQuery = '';
  let resourceTypeFilter = 'all';
  
  function setupUI(user) {
    // Setup sidebar
    setupSidebar(user);
    
    // Setup user profile
    setupUserProfile(user);
  }
  
  function loadResourcesData() {
    // In a real app, this would fetch data from an API
    const resources = mockResources;
    
    // Apply filters for display
    displayFilteredResources();
    
    // Update summary cards
    updateResourceSummary(resources);
    
    // Initialize chart
    initializeResourceChart(resources);
  }
  
  function displayFilteredResources() {
    const filteredResources = mockResources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = resourceTypeFilter === 'all' || resource.type === resourceTypeFilter;
      return matchesSearch && matchesType;
    });
    
    renderResourcesTable(filteredResources);
    updateResourceSummary(filteredResources);
  }
  
  function renderResourcesTable(resources) {
    const tableBody = document.getElementById('resources-table-body');
    const emptyState = document.getElementById('empty-state');
    
    tableBody.innerHTML = '';
    
    if (resources.length === 0) {
      tableBody.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    tableBody.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    resources.forEach(resource => {
      const row = document.createElement('tr');
      row.className = 'border-b hover:bg-gray-50';
      
      // Format values
      const totalCost = formatCurrency(resource.cost * resource.quantity);
      const unitCost = formatCurrency(resource.cost);
      
      // Get type badge color
      const typeBadgeClass = getResourceTypeColor(resource.type);
      
      // Get availability color
      const availabilityColorClass = getAvailabilityColor(resource.availability);
      
      row.innerHTML = `
        <td class="px-6 py-4 font-medium">${resource.name}</td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${typeBadgeClass}">
            ${resource.type}
          </span>
        </td>
        <td class="px-6 py-4 text-right">${resource.quantity} ${resource.unit}</td>
        <td class="px-6 py-4 text-right">${unitCost}</td>
        <td class="px-6 py-4 text-right">${totalCost}</td>
        <td class="px-6 py-4 text-right">
          <span class="${availabilityColorClass}">${resource.availability}%</span>
        </td>
        <td class="px-6 py-4 text-right">
          <button class="text-sm text-blue-600 hover:text-blue-800" data-id="${resource.id}">Details</button>
        </td>
      `;
      
      // Add event listener to the details button
      const detailsButton = row.querySelector('button');
      detailsButton.addEventListener('click', () => {
        showResourceDetails(resource.id);
      });
      
      tableBody.appendChild(row);
    });
  }
  
  function updateResourceSummary(resources) {
    // Update total resources count
    document.getElementById('total-resources').textContent = resources.length;
    
    // Calculate and update total cost
    const totalCost = resources.reduce((sum, resource) => sum + (resource.cost * resource.quantity), 0);
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    
    // Calculate and update average availability
    const avgAvailability = resources.length > 0 
      ? Math.round(resources.reduce((sum, resource) => sum + resource.availability, 0) / resources.length) 
      : 0;
    document.getElementById('avg-availability').textContent = `${avgAvailability}%`;
  }
  
  function initializeResourceChart(resources) {
    // Count resources by type
    const resourceByType = {
      labor: resources.filter(r => r.type === 'labor').length,
      equipment: resources.filter(r => r.type === 'equipment').length,
      material: resources.filter(r => r.type === 'material').length
    };
    
    const ctx = document.getElementById('resource-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.resourceChart) {
      window.resourceChart.destroy();
    }
    
    window.resourceChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Labor', 'Equipment', 'Material'],
        datasets: [{
          data: [resourceByType.labor, resourceByType.equipment, resourceByType.material],
          backgroundColor: ['#93c5fd', '#fcd34d', '#86efac'],
          borderColor: ['#3b82f6', '#f59e0b', '#22c55e'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }
  
  function handleSearch(event) {
    searchQuery = event.target.value;
    displayFilteredResources();
  }
  
  function handleFilterChange(event) {
    resourceTypeFilter = event.target.value;
    displayFilteredResources();
  }
  
  function showResourceDetails(resourceId) {
    const resource = mockResources.find(r => r.id === resourceId);
    if (resource) {
      showToast({
        title: "Resource Details",
        description: `${resource.name} (${resource.type}) - ${resource.quantity} ${resource.unit}`,
        type: "default"
      });
    }
  }
  
  function getResourceTypeColor(type) {
    switch (type) {
      case 'labor':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-amber-100 text-amber-800';
      case 'material':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getAvailabilityColor(availability) {
    if (availability < 30) return 'text-red-500';
    if (availability < 70) return 'text-amber-500';
    return 'text-green-500';
  }
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  // Sample resource data
  const resources = [
    {
      id: 1,
      name: "Excavator CAT 320",
      type: "Equipment",
      status: "Available",
      assignedTo: "Highway Construction"
    },
    {
      id: 2,
      name: "Construction Crew A",
      type: "Labor",
      status: "Assigned",
      assignedTo: "Residential Complex"
    },
    {
      id: 3,
      name: "Steel Beams",
      type: "Material",
      status: "In Transit",
      assignedTo: "Office Building"
    }
  ];
  
  // Function to render resources in the table
  function renderResources() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
  
    resources.forEach(resource => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${resource.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${getTypeClass(resource.type)}">
            ${resource.type}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${getStatusClass(resource.status)}">
            ${resource.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${resource.assignedTo}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button onclick="editResource(${resource.id})" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
          <button onclick="deleteResource(${resource.id})" class="text-red-600 hover:text-red-900">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Helper function to get type class
  function getTypeClass(type) {
    switch (type.toLowerCase()) {
      case 'equipment':
        return 'bg-purple-100 text-purple-800';
      case 'labor':
        return 'bg-blue-100 text-blue-800';
      case 'material':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Helper function to get status class
  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Function to handle resource editing
  function editResource(id) {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      // Show edit modal or form
      showToast(`Editing resource: ${resource.name}`, 'info');
    }
  }
  
  // Function to handle resource deletion
  function deleteResource(id) {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      if (confirm(`Are you sure you want to delete ${resource.name}?`)) {
        const index = resources.findIndex(r => r.id === id);
        resources.splice(index, 1);
        renderResources();
        showToast(`Resource ${resource.name} deleted successfully`, 'success');
      }
    }
  }
  
  // Function to handle adding new resource
  document.querySelector('button').addEventListener('click', () => {
    showToast('Add new resource functionality will be implemented', 'info');
  });
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    renderResources();
  });
  