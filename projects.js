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
    loadProjectsData(user);
    
    // Setup event listeners
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Setup tab buttons
    document.querySelectorAll('[data-status]').forEach(button => {
      button.addEventListener('click', handleStatusFilterChange);
    });
    
    // Modal event listeners
    document.getElementById('modal-overlay').addEventListener('click', closeProjectModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeProjectModal);
    document.getElementById('close-modal-button').addEventListener('click', closeProjectModal);
    
    // New project button
    document.getElementById('new-project-btn').addEventListener('click', () => {
      showToast({
        title: "Feature Coming Soon",
        description: "The ability to create new projects will be available soon.",
        type: "default"
      });
    });
  });
  
  // Mock projects data (in a real app, this would be fetched from a backend)
  const mockProjects = [
    { 
      id: 1, 
      name: 'Downtown Office Building', 
      location: 'New York, NY',
      status: 'active',
      progress: 65,
      budget: 4500000,
      startDate: '2024-01-15',
      endDate: '2024-12-30',
      manager: 2,
      description: 'A 12-story office building with modern amenities and sustainable design features.'
    },
    { 
      id: 2, 
      name: 'Seaside Condominiums', 
      location: 'Miami, FL',
      status: 'planning',
      progress: 10,
      budget: 8200000,
      startDate: '2024-05-01',
      endDate: '2025-07-30',
      manager: 2,
      description: 'Luxury condominium complex with 45 units, ocean views, and resort-style amenities.'
    },
    { 
      id: 3, 
      name: 'Highway Bridge Replacement', 
      location: 'Austin, TX',
      status: 'active',
      progress: 45,
      budget: 12500000,
      startDate: '2023-11-01',
      endDate: '2024-09-15',
      manager: 2,
      description: 'Replacement of aging highway bridge with expanded capacity and improved safety features.'
    },
    { 
      id: 4, 
      name: 'Green Energy Data Center', 
      location: 'Portland, OR',
      status: 'on_hold',
      progress: 25,
      budget: 9800000,
      startDate: '2023-08-15',
      endDate: '2024-11-30',
      manager: 2,
      description: 'State-of-the-art data center powered by renewable energy sources and advanced cooling systems.'
    },
    { 
      id: 5, 
      name: 'Hospital Expansion Wing', 
      location: 'Chicago, IL',
      status: 'active',
      progress: 80,
      budget: 15000000,
      startDate: '2023-05-15',
      endDate: '2024-06-30',
      manager: 2,
      description: 'New hospital wing adding 120 beds, advanced imaging facilities, and emergency department expansion.'
    },
    { 
      id: 6, 
      name: 'Historic Downtown Renovation', 
      location: 'Boston, MA',
      status: 'completed',
      progress: 100,
      budget: 3750000,
      startDate: '2023-03-01',
      endDate: '2024-02-28',
      manager: 3,
      description: 'Restoration of historic downtown buildings while preserving architectural heritage.'
    }
  ];
  
  // Filter state
  let searchQuery = '';
  let statusFilter = 'all';
  
  function setupUI(user) {
    // Setup sidebar
    setupSidebar(user);
    
    // Setup user profile
    setupUserProfile(user);
    
    // Show/hide new project button based on user role
    const newProjectBtn = document.getElementById('new-project-btn');
    if (user.role === 'site_engineer') {
      newProjectBtn.classList.add('hidden');
    } else {
      newProjectBtn.classList.remove('hidden');
    }
  }
  
  function loadProjectsData(user) {
    // In a real app, this would fetch data from an API
    // Filter projects based on user role
    let projects = [];
    
    if (user.role === 'project_manager') {
      projects = mockProjects.filter(project => project.manager === user.id);
    } else {
      projects = mockProjects;
    }
    
    // Apply filters for display
    displayFilteredProjects(user);
  }
  
  function displayFilteredProjects(user) {
    let projects = [];
    
    // Filter by user role
    if (user.role === 'project_manager') {
      projects = mockProjects.filter(project => project.manager === user.id);
    } else {
      projects = mockProjects;
    }
    
    // Apply search and status filters
    const filteredProjects = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    renderProjectsGrid(filteredProjects);
  }
  
  function renderProjectsGrid(projects) {
    const container = document.getElementById('projects-container');
    const emptyState = document.getElementById('empty-state');
    
    container.innerHTML = '';
    
    if (projects.length === 0) {
      container.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'rounded-lg border bg-white shadow hover:shadow-md transition-shadow overflow-hidden';
      card.dataset.projectId = project.id;
      
      // Format values
      const formattedBudget = formatCurrency(project.budget);
      const startDate = formatDate(project.startDate);
      const endDate = formatDate(project.endDate);
      
      // Get status badge color
      const statusBadgeClass = getStatusColor(project.status);
      
      // Get progress bar color
      const progressBarColor = getProgressColor(project.progress);
      
      card.innerHTML = `
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="font-medium text-lg">${project.name}</div>
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusBadgeClass}">
              ${project.status.replace('_', ' ')}
            </span>
          </div>
          <div class="text-sm text-gray-500 mb-4">${project.location}</div>
          <div class="flex items-center justify-between mb-1.5">
            <div class="text-sm font-medium">Progress</div>
            <div class="text-sm font-medium">${project.progress}%</div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="h-2 rounded-full ${progressBarColor}" style="width: ${project.progress}%"></div>
          </div>
          <div class="flex justify-between mt-4 text-sm">
            <div class="text-gray-500">Budget: ${formattedBudget}</div>
            <div class="text-gray-500">${startDate} - ${endDate}</div>
          </div>
        </div>
        <div class="border-t p-4">
          <button class="w-full justify-center inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100 h-10 px-4 py-2">
            View Details
          </button>
        </div>
      `;
      
      // Add event listener to the view details button
      const detailsButton = card.querySelector('button');
      detailsButton.addEventListener('click', () => {
        showProjectDetails(project.id);
      });
      
      container.appendChild(card);
    });
  }
  
  function handleSearch(event) {
    searchQuery = event.target.value;
    
    // Get user
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (user) {
      displayFilteredProjects(user);
    }
  }
  
  function handleStatusFilterChange(event) {
    // Get the clicked button
    const button = event.currentTarget;
    statusFilter = button.dataset.status;
    
    // Update active state
    document.querySelectorAll('[data-status]').forEach(btn => {
      if (btn === button) {
        btn.classList.add('bg-white', 'text-gray-900');
      } else {
        btn.classList.remove('bg-white', 'text-gray-900');
      }
    });
    
    // Get user
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (user) {
      displayFilteredProjects(user);
    }
  }
  
  function showProjectDetails(projectId) {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = project.name;
    
    // Format values
    const formattedBudget = formatCurrency(project.budget);
    const startDate = formatDate(project.startDate);
    const endDate = formatDate(project.endDate);
    
    // Get status badge color
    const statusBadgeClass = getStatusColor(project.status);
    
    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">Location</p>
          <p>${project.location}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Status</p>
          <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusBadgeClass}">
            ${project.status.replace('_', ' ')}
          </span>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Start Date</p>
          <p>${startDate}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">End Date</p>
          <p>${endDate}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Budget</p>
          <p>${formattedBudget}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Progress</p>
          <div class="flex items-center">
            <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div class="h-2 rounded-full ${getProgressColor(project.progress)}" style="width: ${project.progress}%"></div>
            </div>
            <span>${project.progress}%</span>
          </div>
        </div>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Description</p>
        <p>${project.description}</p>
      </div>
      
      <div class="mt-6">
        <h4 class="font-medium mb-2">Project Statistics</h4>
        <div class="h-64">
          <canvas id="project-chart"></canvas>
        </div>
      </div>
    `;
    
    // Display the modal
    modal.classList.remove('hidden');
    
    // Create a chart for the project statistics
    setTimeout(() => {
      const ctx = document.getElementById('project-chart').getContext('2d');
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Budget', 'Actual Cost', 'Planned Resources', 'Actual Resources', 'Planned Tasks', 'Completed Tasks'],
          datasets: [{
            label: 'Project Metrics',
            data: [100, Math.round(project.progress * 0.9), 100, Math.round(project.progress * 0.85), 100, project.progress],
            backgroundColor: [
              'rgba(59, 130, 246, 0.5)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(59, 130, 246)',
              'rgb(245, 158, 11)',
              'rgb(245, 158, 11)',
              'rgb(16, 185, 129)',
              'rgb(16, 185, 129)'
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
              max: 100,
              title: {
                display: true,
                text: 'Percentage (%)'
              }
            }
          }
        }
      });
    }, 100);
  }
  
  function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('hidden');
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'on_hold':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getProgressColor(progress) {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-amber-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  }
  
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  // Sample project data
  const projects = [
    {
      id: 1,
      name: "Downtown Office Complex",
      status: "In Progress",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      progress: "45%",
      budget: 25000000,
      location: "New York, NY",
      manager: "Jane Smith",
      description: "A 20-story office building with modern amenities and sustainable design features."
    },
    {
      id: 2,
      name: "Residential High-Rise",
      status: "Planning",
      startDate: "2024-03-01",
      endDate: "2025-06-30",
      progress: "10%",
      budget: 18000000,
      location: "Los Angeles, CA",
      manager: "John Doe",
      description: "Luxury residential tower with 150 units, rooftop amenities, and smart home features."
    },
    {
      id: 3,
      name: "Highway Expansion Project",
      status: "Completed",
      startDate: "2023-06-01",
      endDate: "2024-01-31",
      progress: "100%",
      budget: 35000000,
      location: "Chicago, IL",
      manager: "Mike Johnson",
      description: "Expansion of I-90 highway with additional lanes and improved interchanges."
    },
    {
      id: 4,
      name: "Shopping Mall Renovation",
      status: "On Hold",
      startDate: "2023-09-15",
      endDate: "2024-08-15",
      progress: "30%",
      budget: 12000000,
      location: "Houston, TX",
      manager: "Sarah Williams",
      description: "Complete renovation of existing shopping mall with new stores and modern facilities."
    },
    {
      id: 5,
      name: "Hospital Extension",
      status: "In Progress",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      progress: "60%",
      budget: 45000000,
      location: "Boston, MA",
      manager: "David Brown",
      description: "New wing addition with specialized medical facilities and emergency department."
    }
  ];
  
  // Function to render projects in the table
  function renderProjects() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
  
    projects.forEach(project => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${project.name}</div>
          <div class="text-xs text-gray-500">${project.location}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${getStatusClass(project.status)}">
            ${project.status}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(project.startDate)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDate(project.endDate)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${project.progress}"></div>
            </div>
            <span class="ml-2 text-sm text-gray-500">${project.progress}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button onclick="editProject(${project.id})" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
          <button onclick="deleteProject(${project.id})" class="text-red-600 hover:text-red-900">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Helper function to get status class
  function getStatusClass(status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Function to handle project editing
  function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
      // Show edit modal or form
      showToast(`Editing project: ${project.name}`, 'info');
    }
  }
  
  // Function to handle project deletion
  function deleteProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
      if (confirm(`Are you sure you want to delete ${project.name}?`)) {
        const index = projects.findIndex(p => p.id === id);
        projects.splice(index, 1);
        renderProjects();
        showToast(`Project ${project.name} deleted successfully`, 'success');
      }
    }
  }
  
  // Function to handle adding new project
  document.querySelector('button').addEventListener('click', () => {
    showToast('Add new project functionality will be implemented', 'info');
  });
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
  });
  