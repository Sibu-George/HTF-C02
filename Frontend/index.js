// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    // Get user from localStorage
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      // Redirect to login if no user found
      window.location.href = '/login.html';
      return;
    }
    
    const user = JSON.parse(userJson);
    
    // Set up the UI based on user
    setupUI(user);
    
    // Setup event listeners
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
  });
  
  function setupUI(user) {
    // Setup navigation based on user role
    setupNavigation(user.role);
    
    // Setup user profile
    setupUserProfile(user);
  }
  
  function setupNavigation(role) {
    const navigationContainer = document.getElementById('navigation-links');
    const navigationItems = getNavigationItems(role);
    
    navigationContainer.innerHTML = '';
    
    navigationItems.forEach(item => {
      const li = document.createElement('li');
      
      // Determine if this is the active page
      const isActive = window.location.pathname === item.href;
      
      li.innerHTML = `
        <a 
          href="${item.href}" 
          class="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive 
              ? "bg-blue-800 text-white" 
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }"
        >
          ${item.icon}
          <span class="text-sm font-medium">${item.name}</span>
        </a>
      `;
      
      navigationContainer.appendChild(li);
    });
  }
  
  function getNavigationItems(role) {
    // Define icons as strings
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
      </svg>`,
      logs: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" x2="8" y1="13" y2="13"></line>
        <line x1="16" x2="8" y1="17" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>`,
      reports: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" x2="8" y1="13" y2="13"></line>
        <line x1="16" x2="8" y1="17" y2="17"></line>
        <line x1="10" x2="9" y1="9" y2="9"></line>
      </svg>`,
      settings: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`
    };
  
    const commonItems = [
      { name: 'Dashboard', href: '/index.html', icon: icons.home }
    ];
  
    const adminItems = [
      ...commonItems,
      { name: 'User Management', href: '/users.html', icon: icons.users },
      { name: 'Projects', href: '/projects.html', icon: icons.projects },
      { name: 'Resources', href: '/resources.html', icon: icons.resources },
      { name: 'System Logs', href: '#', icon: icons.logs, onClick: 'showLogsSection()' },
      { name: 'Reports', href: '#', icon: icons.reports, onClick: 'showReportsSection()' },
      { name: 'Settings', href: '#', icon: icons.settings, onClick: 'showSettingsSection()' }
    ];
  
    const managerItems = [
      ...commonItems,
      { name: 'Projects', href: '/projects.html', icon: icons.projects },
      { name: 'Resources', href: '/resources.html', icon: icons.resources },
      { name: 'Tasks', href: '/tasks.html', icon: icons.tasks }
    ];
  
    const engineerItems = [
      ...commonItems,
      { name: 'Tasks', href: '/tasks.html', icon: icons.tasks },
      { name: 'Resources', href: '/resources.html', icon: icons.resources }
    ];
  
    switch (role) {
      case 'admin':
        return adminItems;
      case 'project_manager':
        return managerItems;
      case 'site_supervisor':
      case 'engineer':
      default:
        return engineerItems;
    }
  }
  
  function setupUserProfile(user) {
    const userProfileContainer = document.getElementById('user-profile');
    
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
    // Clear user data
    localStorage.removeItem('user');
    
    // Show toast
    showToast({
      title: "Logged out",
      description: "You have been successfully logged out",
      type: "success"
    });
    
    // Redirect to login
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1000);
  }
  
  function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
  }
  
  // Toast notification function (same as in login.js)
  function showToast({ title, description, type = 'default' }) {
    const toastContainer = document.getElementById('toastContainer');
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
  
  // Dashboard specific functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    
    // Show appropriate dashboard based on user role
    showRoleBasedDashboard(user.role);
    
    // Initialize shared components
    initializeSharedComponents();
    
    // Initialize role-specific components
    initializeRoleSpecificComponents(user.role);

    // Add event listeners for interactive elements
    setupEventListeners();

    // Load dashboard data
    loadDashboardData(user.role);
  });

  function loadDashboardData(role) {
    // In a real application, this would fetch data from an API
    // For now, we'll use placeholder data
    const data = {
      admin: {
        projects: 12,
        resources: 48,
            tasksCompleted: 85,
            carbonFootprint: 2500, // tons of CO2
            resourceEfficiency: 92, // percentage
            costSavings: 150000 // dollars
      },
      project_manager: {
            projects: 5,
            resources: 20,
            tasksCompleted: 75,
            carbonFootprint: 1200,
            resourceEfficiency: 88,
            costSavings: 75000
        },
        site_supervisor: {
            projects: 3,
            resources: 15,
            tasksCompleted: 60,
            carbonFootprint: 800,
            resourceEfficiency: 85,
            costSavings: 45000
        },
        engineer: {
        projects: 4,
            resources: 18,
            tasksCompleted: 70,
            carbonFootprint: 1000,
            resourceEfficiency: 90,
            costSavings: 60000
        }
    };

    // Get the data for the current role
    const userData = data[role] || data.admin;

    // Update dashboard metrics if elements exist
    const activeProjects = document.getElementById('activeProjects');
    const totalResources = document.getElementById('totalResources');
    const tasksCompleted = document.getElementById('tasksCompleted');
    const carbonFootprint = document.getElementById('carbonFootprint');
    const resourceEfficiency = document.getElementById('resourceEfficiency');
    const costSavings = document.getElementById('costSavings');

    if (activeProjects) activeProjects.textContent = userData.projects;
    if (totalResources) totalResources.textContent = userData.resources;
    if (tasksCompleted) tasksCompleted.textContent = `${userData.tasksCompleted}%`;
    if (carbonFootprint) carbonFootprint.textContent = `${userData.carbonFootprint.toLocaleString()} tons`;
    if (resourceEfficiency) resourceEfficiency.textContent = `${userData.resourceEfficiency}%`;
    if (costSavings) costSavings.textContent = `$${userData.costSavings.toLocaleString()}`;
  }

  function initializeCharts() {
    // Executive Dashboard Charts
    initializeProjectStatusChart();
    initializeBudgetSpendChart();
    initializeProgressChart();
    initializeCompletionChart();
    initializeDelayTrendsChart();
    initializeCarbonFootprintChart();
    initializeRiskAlerts();
    initializeProjectMap();

    // Project Manager Dashboard Charts
    initializeGanttChart();
    initializeMaterialUsageChart();
    initializeLaborAllocationChart();
    initializeEquipmentChart();
    initializeScheduleVarianceChart();
    initializeMilestoneProgressChart();
    initializeProjectRisks();
    initializeSupplyChainChart();
  }

  // Executive Dashboard Charts
  function initializeProjectStatusChart() {
    const ctx = document.getElementById('projectStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Not Started', 'On Hold'],
            datasets: [{
                data: [3, 5, 2, 2],
                backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
  }

  function initializeBudgetSpendChart() {
    const ctx = document.getElementById('budgetSpendChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'],
            datasets: [
                {
                    label: 'Budget',
                    data: [5000000, 3000000, 4000000, 2500000, 3500000],
                    backgroundColor: '#3B82F6'
                },
                {
                    label: 'Actual',
                    data: [4500000, 3200000, 3800000, 2600000, 3300000],
                    backgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value/1000000 + 'M';
                        }
                    }
                }
            }
        }
    });
  }

  function initializeProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [
                {
                    label: 'Planned',
                    data: [10, 25, 40, 55, 70, 85],
                    borderColor: '#3B82F6',
                    tension: 0.1
                },
                {
                    label: 'Actual',
                    data: [8, 22, 35, 50, 65, 80],
                    borderColor: '#10B981',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
  }

  function initializeCompletionChart() {
    const ctx = document.getElementById('completionChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5'],
            datasets: [
                {
                    label: 'Estimated',
                    data: ['2024-06-30', '2024-08-15', '2024-09-30', '2024-11-15', '2024-12-31'].map(date => new Date(date).getTime()),
                    backgroundColor: '#3B82F6'
                },
                {
                    label: 'Actual',
                    data: ['2024-07-15', '2024-08-30', '2024-10-15', '2024-11-30', '2025-01-15'].map(date => new Date(date).getTime()),
                    backgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }
            }
        }
    });
  }

  function initializeDelayTrendsChart() {
    const ctx = document.getElementById('delayTrendsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Delayed Tasks',
                data: [5, 8, 12, 6, 9, 7],
                borderColor: '#EF4444',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

  function initializeCarbonFootprintChart() {
    const ctx = document.getElementById('carbonFootprintChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Concrete', 'Steel', 'Wood', 'Equipment', 'Transport'],
            datasets: [{
                label: 'CO2 Emissions (tons)',
                data: [1200, 800, 300, 500, 200],
                backgroundColor: '#6B7280'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

  function initializeRiskAlerts() {
    const riskAlerts = [
        { project: 'Downtown Office Complex', risk: 'High', issues: 5 },
        { project: 'Residential High-Rise', risk: 'Medium', issues: 3 },
        { project: 'Hospital Extension', risk: 'High', issues: 4 }
    ];

    const container = document.getElementById('riskAlerts');
    riskAlerts.forEach(alert => {
        const div = document.createElement('div');
        div.className = `p-3 rounded-lg ${alert.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`;
        div.innerHTML = `
            <div class="font-semibold">${alert.project}</div>
            <div class="text-sm">${alert.issues} open issues</div>
        `;
        container.appendChild(div);
    });
  }

  function initializeProjectMap() {
    const map = L.map('projectMap').setView([40.7128, -74.0060], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const projects = [
        { name: 'Downtown Office Complex', lat: 40.7128, lng: -74.0060 },
        { name: 'Residential High-Rise', lat: 34.0522, lng: -118.2437 },
        { name: 'Hospital Extension', lat: 42.3601, lng: -71.0589 }
    ];

    projects.forEach(project => {
        L.marker([project.lat, project.lng])
            .addTo(map)
            .bindPopup(project.name);
    });
  }

  // Project Manager Dashboard Functions
  function initializeProjectManagerDashboard() {
    initializeGanttChart();
    initializeMaterialUsageChart();
    initializeFormSubmissionChart();
    initializePerformanceTrendsChart();
    initializeRiskDashboard();
    updateActionItems();
  }

  function initializeGanttChart() {
    const ctx = document.getElementById('ganttChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Foundation', 'Structure', 'MEP', 'Interior', 'Finishing'],
        datasets: [{
          label: 'Planned',
          data: [
            { x: '2024-01-01', y: 0, width: 30 },
            { x: '2024-02-01', y: 1, width: 45 },
            { x: '2024-03-15', y: 2, width: 30 },
            { x: '2024-04-15', y: 3, width: 45 },
            { x: '2024-06-01', y: 4, width: 30 }
          ],
          backgroundColor: '#3B82F6'
        }, {
          label: 'Actual',
          data: [
            { x: '2024-01-05', y: 0, width: 30 },
            { x: '2024-02-10', y: 1, width: 45 },
            { x: '2024-03-20', y: 2, width: 30 },
            { x: '2024-04-25', y: 3, width: 45 },
            { x: '2024-06-10', y: 4, width: 30 }
          ],
          backgroundColor: '#10B981'
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month'
            }
          },
          y: {
            ticks: {
              callback: function(value) {
                return ['Foundation', 'Structure', 'MEP', 'Interior', 'Finishing'][value];
              }
            }
          }
        }
      }
    });
  }

  function initializeMaterialUsageChart() {
    const ctx = document.getElementById('materialUsageChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Planned Usage',
          data: [100, 200, 300, 400, 500, 600],
          borderColor: '#3B82F6',
          tension: 0.1
        }, {
          label: 'Actual Usage',
          data: [90, 210, 290, 420, 480, 620],
          borderColor: '#10B981',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Material Units'
            }
          }
        }
      }
    });

    // Update material metrics
    document.getElementById('onTrackMaterials').textContent = '85%';
    document.getElementById('attentionMaterials').textContent = '15%';
  }

  function initializeFormSubmissionChart() {
    const ctx = document.getElementById('formSubmissionChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Forms Submitted',
          data: [12, 19, 15, 25, 22, 8, 3],
          borderColor: '#3B82F6',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Update form completion metrics
    const completionRate = 75;
    document.getElementById('formCompletionRate').textContent = `${completionRate}%`;
    document.getElementById('formCompletionBar').style.width = `${completionRate}%`;
  }

  function initializePerformanceTrendsChart() {
    const ctx = document.getElementById('performanceTrendsChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'On Time Tasks',
          data: [85, 82, 88, 90, 87, 92],
          borderColor: '#3B82F6',
          tension: 0.1
        }, {
          label: 'Delayed Tasks',
          data: [15, 18, 12, 10, 13, 8],
          borderColor: '#F59E0B',
          tension: 0.1
        }, {
          label: 'Critical Tasks',
          data: [5, 8, 6, 4, 7, 3],
          borderColor: '#EF4444',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    // Update performance metrics
    document.getElementById('onTimeTasks').textContent = '92%';
    document.getElementById('delayedTasks').textContent = '8%';
    document.getElementById('criticalTasks').textContent = '3%';
  }

  function initializeRiskDashboard() {
    const risks = [
      {
        type: 'schedule',
        severity: 'high',
        description: 'Foundation work delayed due to weather conditions',
        impact: '2 weeks delay in overall project timeline'
      },
      {
        type: 'budget',
        severity: 'medium',
        description: 'Material costs increased by 15%',
        impact: 'Potential budget overrun of $50,000'
      },
      {
        type: 'resource',
        severity: 'low',
        description: 'Shortage of skilled labor in electrical work',
        impact: 'Minor delays in MEP installation'
      }
    ];

    const container = document.getElementById('riskDashboard');
    container.innerHTML = '';

    risks.forEach(risk => {
      const div = document.createElement('div');
      div.className = `p-4 rounded-lg ${
        risk.severity === 'high' ? 'bg-red-50 text-red-800' :
        risk.severity === 'medium' ? 'bg-yellow-50 text-yellow-800' :
        'bg-green-50 text-green-800'
      }`;
      div.innerHTML = `
        <div class="font-semibold">${risk.type.replace('_', ' ').toUpperCase()}</div>
        <div class="text-sm mt-1">${risk.description}</div>
        <div class="text-xs mt-2">Impact: ${risk.impact}</div>
      `;
      container.appendChild(div);
    });
  }

  function updateActionItems() {
    const actions = [
      {
        type: 'form',
        description: 'Daily progress report for Foundation work is overdue',
        priority: 'high'
      },
      {
        type: 'resource',
        description: 'Additional concrete mixer required for next week',
        priority: 'medium'
      },
      {
        type: 'quality',
        description: 'Inspection report needs review for MEP installation',
        priority: 'low'
      }
    ];

    const container = document.getElementById('actionRequiredList');
    container.innerHTML = '';

    actions.forEach(action => {
      const div = document.createElement('div');
      div.className = `p-4 rounded-lg ${
        action.priority === 'high' ? 'bg-red-50' :
        action.priority === 'medium' ? 'bg-yellow-50' :
        'bg-green-50'
      }`;
      div.innerHTML = `
        <div class="flex justify-between items-center">
          <div>
            <div class="font-semibold">${action.type.replace('_', ' ').toUpperCase()}</div>
            <div class="text-sm mt-1">${action.description}</div>
          </div>
          <button class="px-3 py-1 text-sm bg-blue-800 text-white rounded hover:bg-blue-700">
            Resolve
          </button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  function adjustTimeline(action) {
    const ganttChart = Chart.getChart('ganttChart');
    if (!ganttChart) return;

    const timeScale = ganttChart.options.scales.x;
    switch (action) {
      case 'zoomIn':
        timeScale.time.unit = 'day';
        break;
      case 'zoomOut':
        timeScale.time.unit = 'month';
        break;
      case 'reset':
        timeScale.time.unit = 'week';
        break;
    }
    ganttChart.update();
  }

  function showRiskManagementModal() {
    document.getElementById('riskManagementModal').classList.remove('hidden');
  }

  function closeRiskManagementModal() {
    document.getElementById('riskManagementModal').classList.add('hidden');
  }

  function saveRisk() {
    const type = document.getElementById('riskType').value;
    const severity = document.getElementById('riskSeverity').value;
    const description = document.getElementById('riskDescription').value;
    const mitigation = document.getElementById('riskMitigation').value;

    // In a real application, this would save to a database
    console.log('Saving risk:', { type, severity, description, mitigation });

    closeRiskManagementModal();
    initializeRiskDashboard();
    showToast({
      title: 'Risk Saved',
      description: 'The risk has been added to the dashboard',
      type: 'success'
    });
  }
  
  // Initialize shared components
  function initializeSharedComponents() {
    initializeLiveAlerts();
    initializeSearchableRepository();
    initializeCalendarView();
    initializeResourceOptimizationCharts();
  }

  // Initialize resource optimization charts
  function initializeResourceOptimizationCharts() {
    // Resource Usage vs Efficiency
    const resourceEfficiencyCtx = document.getElementById('resourceEfficiencyChart').getContext('2d');
    new Chart(resourceEfficiencyCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [
                {
                    label: 'Resource Usage',
                    data: [85, 90, 88, 92, 95, 98],
                    borderColor: '#3B82F6',
                    tension: 0.1
                },
                {
                    label: 'Efficiency Target',
                    data: [90, 90, 90, 90, 90, 90],
                    borderColor: '#10B981',
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Carbon Impact by Resource Type
    const carbonImpactCtx = document.getElementById('carbonImpactChart').getContext('2d');
    new Chart(carbonImpactCtx, {
        type: 'bar',
        data: {
            labels: ['Concrete', 'Steel', 'Wood', 'Equipment', 'Transport'],
            datasets: [{
                label: 'CO2 Emissions (tons)',
                data: [1200, 800, 300, 500, 200],
                backgroundColor: [
                    '#6B7280', // Concrete
                    '#4B5563', // Steel
                    '#9CA3AF', // Wood
                    '#D1D5DB', // Equipment
                    '#E5E7EB'  // Transport
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Resource Allocation Optimization
    const resourceAllocationCtx = document.getElementById('resourceAllocationChart').getContext('2d');
    new Chart(resourceAllocationCtx, {
        type: 'doughnut',
        data: {
            labels: ['Labor', 'Materials', 'Equipment', 'Subcontractors'],
            datasets: [{
                data: [35, 30, 20, 15],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
  }

  // Initialize role-specific components
  function initializeRoleSpecificComponents(role) {
    switch(role) {
        case 'admin':
            initializeAdminDashboard();
            break;
        case 'project_manager':
            initializeProjectManagerDashboard();
            break;
        case 'site_supervisor':
            initializeSiteSupervisorDashboard();
            break;
        case 'engineer':
            initializeEngineerDashboard();
            break;
    }
  }

  // Admin Dashboard Components
  function initializeAdminDashboard() {
    // Initialize Project Status Chart
    const projectStatusCtx = document.getElementById('projectStatusChart').getContext('2d');
    new Chart(projectStatusCtx, {
        type: 'bar',
        data: {
            labels: ['Hospital Extension', 'Office Complex', 'Residential Tower', 'Shopping Mall', 'School Renovation'],
            datasets: [
                {
                    label: 'Budget Utilization',
                    data: [75, 60, 45, 80, 55],
                    backgroundColor: '#3B82F6'
                },
                {
                    label: 'Schedule Progress',
                    data: [80, 70, 50, 85, 60],
                    backgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });

    // Initialize User Management Chart
    const userManagementCtx = document.getElementById('userManagementChart').getContext('2d');
    new Chart(userManagementCtx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Inactive', 'Pending', 'Suspended'],
            datasets: [{
                data: [45, 5, 3, 2],
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Initialize Audit Log Chart
    const auditLogCtx = document.getElementById('auditLogChart').getContext('2d');
    new Chart(auditLogCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'User Actions',
                    data: [120, 150, 180, 200, 170, 90, 50],
                    borderColor: '#3B82F6',
                    tension: 0.1
                },
                {
                    label: 'Form Updates',
                    data: [80, 100, 120, 150, 130, 70, 30],
                    borderColor: '#10B981',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    // Setup Export Tools
    setupExportTools();

    // Initialize Logs
    initializeAdminLogs();

    // Add event listeners for interactive elements
    setupAdminEventListeners();
  }

  function setupExportTools() {
    const exportTools = document.getElementById('exportTools');
    if (exportTools) {
        exportTools.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                        <h4 class="font-medium">Project Status Report</h4>
                        <p class="text-sm text-gray-600">Comprehensive project metrics and progress</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="exportReport('project', 'pdf')">PDF</button>
                        <button class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="exportReport('project', 'excel')">Excel</button>
                        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200" onclick="exportReport('project', 'csv')">CSV</button>
                    </div>
                </div>
                <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                        <h4 class="font-medium">User Activity Log</h4>
                        <p class="text-sm text-gray-600">Detailed audit trail of user actions</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="exportReport('audit', 'pdf')">PDF</button>
                        <button class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="exportReport('audit', 'excel')">Excel</button>
                        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200" onclick="exportReport('audit', 'csv')">CSV</button>
                    </div>
                </div>
                <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                    <div>
                        <h4 class="font-medium">Resource Utilization Report</h4>
                        <p class="text-sm text-gray-600">Resource allocation and efficiency metrics</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="exportReport('resource', 'pdf')">PDF</button>
                        <button class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="exportReport('resource', 'excel')">Excel</button>
                        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200" onclick="exportReport('resource', 'csv')">CSV</button>
                    </div>
                </div>
            </div>
        `;
    }
  }

  function setupAdminEventListeners() {
    // Add click handlers for navigation items
    const navigationLinks = document.querySelectorAll('#navigation-links a');
    navigationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('onclick')) {
                e.preventDefault();
                eval(link.getAttribute('onclick'));
            }
        });
    });

    // Add event listeners for log filtering
    const logFilterButtons = document.querySelectorAll('[onclick^="filterLogs"]');
    logFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('onclick').match(/'([^']+)'/)[1];
            filterLogs(level);
        });
    });

    // Add event listeners for export buttons
    const exportButtons = document.querySelectorAll('[onclick^="exportReport"]');
    exportButtons.forEach(button => {
        button.addEventListener('click', () => {
            const [type, format] = button.getAttribute('onclick').match(/'([^']+)'/g).map(match => match.replace(/'/g, ''));
            exportReport(type, format);
        });
    });

    // Add event listeners for log management
    document.getElementById('loadMoreLogs')?.addEventListener('click', loadMoreLogs);
    document.getElementById('exportLogs')?.addEventListener('click', exportLogs);
  }

  // Export Report Function
  function exportReport(type, format) {
    showToast({
        title: "Export Started",
        description: `Generating ${type} report in ${format.toUpperCase()} format...`,
        type: "success"
    });

    // Simulate report generation
    setTimeout(() => {
        showToast({
            title: "Export Complete",
            description: `${type} report has been downloaded`,
            type: "success"
        });
    }, 2000);
  }

  // Admin Dashboard Logs Functions
  function initializeAdminLogs() {
    loadSystemLogs();
    loadUserActivityLogs();
    loadAuditTrail();
    updateLogCounts();
  }

  function loadSystemLogs() {
    const systemLogs = [
        {
            timestamp: '2024-03-20 10:15:23',
            level: 'error',
            message: 'Database connection timeout - Retrying connection...',
            source: 'Database Service'
        },
        {
            timestamp: '2024-03-20 10:14:45',
            level: 'warning',
            message: 'High memory usage detected (85%) - Consider optimizing queries',
            source: 'System Monitor'
        },
        {
            timestamp: '2024-03-20 10:13:12',
            level: 'info',
            message: 'Backup completed successfully - Size: 2.5GB',
            source: 'Backup Service'
        },
        {
            timestamp: '2024-03-20 10:12:30',
            level: 'error',
            message: 'API rate limit exceeded - Service temporarily throttled',
            source: 'API Gateway'
        },
        {
            timestamp: '2024-03-20 10:11:45',
            level: 'info',
            message: 'Cache cleared successfully - Performance optimized',
            source: 'Cache Service'
        },
        {
            timestamp: '2024-03-20 10:10:20',
            level: 'warning',
            message: 'Unusual login pattern detected from IP: 192.168.1.100',
            source: 'Security Monitor'
        }
    ];

    const container = document.getElementById('systemLogs');
    container.innerHTML = '';

    systemLogs.forEach(log => {
        const div = document.createElement('div');
        div.className = `p-4 ${getLogLevelClass(log.level)}`;
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <span class="font-medium">${log.source}</span>
                    <p class="text-sm mt-1">${log.message}</p>
                </div>
                <span class="text-sm text-gray-500">${log.timestamp}</span>
            </div>
        `;
        container.appendChild(div);
    });
  }

  function loadUserActivityLogs() {
    const userLogs = [
        {
            timestamp: '2024-03-20 10:15:23',
            user: 'john.doe',
            action: 'Logged in from new device',
            ip: '192.168.1.1',
            location: 'New York, US'
        },
        {
            timestamp: '2024-03-20 10:14:45',
            user: 'jane.smith',
            action: 'Updated project settings for "Downtown Office Complex"',
            ip: '192.168.1.2',
            location: 'London, UK'
        },
        {
            timestamp: '2024-03-20 10:13:12',
            user: 'admin',
            action: 'Created new user account for "michael.wilson"',
            ip: '192.168.1.3',
            location: 'Sydney, AU'
        },
        {
            timestamp: '2024-03-20 10:12:30',
            user: 'robert.brown',
            action: 'Uploaded new project document: "Site Survey Report.pdf"',
            ip: '192.168.1.4',
            location: 'Toronto, CA'
        },
        {
            timestamp: '2024-03-20 10:11:45',
            user: 'sarah.johnson',
            action: 'Completed daily progress report for "Hospital Extension"',
            ip: '192.168.1.5',
            location: 'Berlin, DE'
        },
        {
            timestamp: '2024-03-20 10:10:20',
            user: 'david.wilson',
            action: 'Approved resource allocation request',
            ip: '192.168.1.6',
            location: 'Singapore, SG'
        }
    ];

    const container = document.getElementById('userActivityLogs');
    container.innerHTML = '';

    userLogs.forEach(log => {
        const div = document.createElement('div');
        div.className = 'p-4 hover:bg-gray-50';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="font-medium">${log.user}</span>
                        <span class="text-xs text-gray-500">${log.location}</span>
                    </div>
                    <p class="text-sm mt-1">${log.action}</p>
                    <span class="text-xs text-gray-500">IP: ${log.ip}</span>
                </div>
                <span class="text-sm text-gray-500">${log.timestamp}</span>
            </div>
        `;
        container.appendChild(div);
    });
  }

  function loadAuditTrail() {
    const auditLogs = [
        {
            timestamp: '2024-03-20 10:15:23',
            entity: 'Project',
            action: 'Modified',
            user: 'john.doe',
            details: 'Updated project timeline for "Downtown Office Complex" - Extended deadline by 2 weeks',
            impact: 'Schedule Change'
        },
        {
            timestamp: '2024-03-20 10:14:45',
            entity: 'User',
            action: 'Created',
            user: 'admin',
            details: 'Created new user account with role: Project Manager',
            impact: 'User Management'
        },
        {
            timestamp: '2024-03-20 10:13:12',
            entity: 'Resource',
            action: 'Deleted',
            user: 'jane.smith',
            details: 'Removed outdated resource: "Crane-001" - Replaced with newer model',
            impact: 'Resource Update'
        },
        {
            timestamp: '2024-03-20 10:12:30',
            entity: 'Document',
            action: 'Uploaded',
            user: 'robert.brown',
            details: 'Added new document: "Safety Inspection Report Q1 2024"',
            impact: 'Documentation'
        },
        {
            timestamp: '2024-03-20 10:11:45',
            entity: 'Budget',
            action: 'Modified',
            user: 'sarah.johnson',
            details: 'Updated project budget - Increased by $50,000 for additional materials',
            impact: 'Financial Change'
        },
        {
            timestamp: '2024-03-20 10:10:20',
            entity: 'Task',
            action: 'Completed',
            user: 'david.wilson',
            details: 'Marked task "Foundation Inspection" as completed',
            impact: 'Progress Update'
        }
    ];

    const container = document.getElementById('auditTrail');
    container.innerHTML = '';

    auditLogs.forEach(log => {
        const div = document.createElement('div');
        div.className = 'p-4 hover:bg-gray-50';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="font-medium">${log.entity}</span>
                        <span class="text-sm text-gray-500">${log.action}</span>
                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">${log.impact}</span>
                    </div>
                    <p class="text-sm mt-1">${log.details}</p>
                    <span class="text-xs text-gray-500">By: ${log.user}</span>
                </div>
                <span class="text-sm text-gray-500">${log.timestamp}</span>
            </div>
        `;
        container.appendChild(div);
    });
  }

  function filterLogs(level) {
    const systemLogs = document.getElementById('systemLogs');
    const logs = systemLogs.querySelectorAll('div');

    logs.forEach(log => {
        if (level === 'all' || log.classList.contains(`bg-${getLogLevelColor(level)}-50`)) {
            log.style.display = 'block';
        } else {
            log.style.display = 'none';
        }
    });

    updateLogCounts();
  }

  function getLogLevelClass(level) {
    const colors = {
        error: 'bg-red-50 text-red-800',
        warning: 'bg-yellow-50 text-yellow-800',
        info: 'bg-blue-50 text-blue-800'
    };
    return colors[level] || 'bg-gray-50 text-gray-800';
  }

  function getLogLevelColor(level) {
    const colors = {
        error: 'red',
        warning: 'yellow',
        info: 'blue'
    };
    return colors[level] || 'gray';
  }

  function updateLogCounts() {
    const visibleLogs = document.querySelectorAll('#systemLogs div[style="display: block"]').length;
    const totalLogs = document.querySelectorAll('#systemLogs div').length;
    
    document.getElementById('logCount').textContent = visibleLogs;
    document.getElementById('totalLogs').textContent = totalLogs;
  }

  function loadMoreLogs() {
    // In a real application, this would fetch more logs from the server
    showToast({
        title: 'Loading More Logs',
        description: 'Fetching additional log entries...',
        type: 'info'
    });
  }

  function exportLogs() {
    // In a real application, this would generate and download a log file
    showToast({
        title: 'Exporting Logs',
        description: 'Preparing log file for download...',
        type: 'info'
    });
  }
  
  // Site Supervisor Dashboard Components
  function initializeSiteSupervisorDashboard() {
    // Daily Resource Usage
    const dailyUsageCtx = document.getElementById('dailyUsageChart').getContext('2d');
    new Chart(dailyUsageCtx, {
        type: 'line',
        data: {
            labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm'],
            datasets: [
                {
                    label: 'Labor Hours',
                    data: [20, 40, 60, 80, 100, 120, 140],
                    borderColor: '#3B82F6',
                    tension: 0.1
                },
                {
                    label: 'Equipment Hours',
                    data: [10, 25, 40, 55, 70, 85, 100],
                    borderColor: '#10B981',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    // Material Consumption
    const materialConsumptionCtx = document.getElementById('materialConsumptionChart').getContext('2d');
    new Chart(materialConsumptionCtx, {
        type: 'bar',
        data: {
            labels: ['Concrete', 'Steel', 'Wood', 'Glass'],
            datasets: [
                {
                    label: 'Planned',
                    data: [100, 100, 100, 100],
                    backgroundColor: '#3B82F6'
                },
                {
                    label: 'Actual',
                    data: [95, 90, 85, 80],
                    backgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
  }

  // Engineer Dashboard Components
  function initializeEngineerDashboard() {
    // Carbon Impact by Design
    const carbonDesignCtx = document.getElementById('carbonDesignChart').getContext('2d');
    new Chart(carbonDesignCtx, {
        type: 'bar',
        data: {
            labels: ['Foundation', 'Structure', 'MEP', 'Envelope', 'Interior'],
            datasets: [
                {
                    label: 'Original Design',
                    data: [1200, 800, 600, 400, 200],
                    backgroundColor: '#3B82F6'
                },
                {
                    label: 'Optimized Design',
                    data: [1000, 700, 500, 350, 150],
                    backgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Carbon Impact (kg CO2)'
                    }
                }
            }
        }
    });

    // Resource Efficiency by System
    const systemEfficiencyCtx = document.getElementById('systemEfficiencyChart').getContext('2d');
    new Chart(systemEfficiencyCtx, {
        type: 'radar',
        data: {
            labels: ['Structural', 'MEP', 'Architectural', 'Civil', 'Sustainability'],
            datasets: [{
                label: 'Efficiency Score',
                data: [85, 90, 80, 75, 95],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
  }
  
  // Add function to show logs section
  function showLogsSection() {
    // Hide all dashboards and sections
    document.getElementById('adminDashboard')?.classList.add('hidden');
    document.getElementById('projectManagerDashboard')?.classList.add('hidden');
    document.getElementById('siteSupervisorDashboard')?.classList.add('hidden');
    document.getElementById('engineerDashboard')?.classList.add('hidden');
    document.getElementById('reportsSection')?.classList.add('hidden');
    document.getElementById('settingsSection')?.classList.add('hidden');

    // Show logs section
    const logsSection = document.getElementById('logsSection');
    if (!logsSection) {
        // Create logs section if it doesn't exist
        const mainContent = document.querySelector('main .container');
        const logsDiv = document.createElement('div');
        logsDiv.id = 'logsSection';
        logsDiv.className = 'space-y-6';
        logsDiv.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">System Logs</h3>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="filterLogs('all')">All</button>
                        <button class="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200" onclick="filterLogs('error')">Errors</button>
                        <button class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200" onclick="filterLogs('warning')">Warnings</button>
                        <button class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="filterLogs('info')">Info</button>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <!-- System Logs -->
                    <div class="border rounded-lg overflow-hidden">
                        <div class="bg-gray-50 p-4 border-b">
                            <h4 class="font-medium">System Logs</h4>
                        </div>
                        <div id="systemLogs" class="divide-y">
                            <!-- Log entries will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- User Activity Logs -->
                    <div class="border rounded-lg overflow-hidden">
                        <div class="bg-gray-50 p-4 border-b">
                            <h4 class="font-medium">User Activity Logs</h4>
                        </div>
                        <div id="userActivityLogs" class="divide-y">
                            <!-- Log entries will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Audit Trail -->
                    <div class="border rounded-lg overflow-hidden">
                        <div class="bg-gray-50 p-4 border-b">
                            <h4 class="font-medium">Audit Trail</h4>
                        </div>
                        <div id="auditTrail" class="divide-y">
                            <!-- Log entries will be populated by JavaScript -->
                        </div>
                    </div>
                </div>

                <div class="mt-4 flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        Showing <span id="logCount">0</span> of <span id="totalLogs">0</span> entries
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200" onclick="loadMoreLogs()">
                            Load More
                        </button>
                        <button class="px-3 py-1 text-sm bg-blue-800 text-white rounded hover:bg-blue-700" onclick="exportLogs()">
                            Export Logs
                        </button>
                    </div>
                </div>
            </div>
        `;
        mainContent.appendChild(logsDiv);
    } else {
        logsSection.classList.remove('hidden');
    }

    // Initialize logs
    initializeAdminLogs();
  }

  function showReportsSection() {
    // Hide all dashboards and sections
    document.getElementById('adminDashboard')?.classList.add('hidden');
    document.getElementById('projectManagerDashboard')?.classList.add('hidden');
    document.getElementById('siteSupervisorDashboard')?.classList.add('hidden');
    document.getElementById('engineerDashboard')?.classList.add('hidden');
    document.getElementById('logsSection')?.classList.add('hidden');
    document.getElementById('settingsSection')?.classList.add('hidden');

    // Show reports section
    const reportsSection = document.getElementById('reportsSection');
    if (!reportsSection) {
        // Create reports section if it doesn't exist
        const mainContent = document.querySelector('main .container');
        const reportsDiv = document.createElement('div');
        reportsDiv.id = 'reportsSection';
        reportsDiv.className = 'space-y-6';
        reportsDiv.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Reports Dashboard</h3>
                
                <!-- Report Categories -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h4 class="font-medium text-blue-800">Project Reports</h4>
                        <p class="text-sm text-blue-600 mt-1">Comprehensive project analysis and metrics</p>
                        <div class="mt-4 space-y-2">
                            <button class="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="generateReport('project_status')">Project Status Report</button>
                            <button class="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="generateReport('project_performance')">Performance Analysis</button>
                            <button class="w-full px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="generateReport('project_risks')">Risk Assessment</button>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h4 class="font-medium text-green-800">Resource Reports</h4>
                        <p class="text-sm text-green-600 mt-1">Resource utilization and efficiency metrics</p>
                        <div class="mt-4 space-y-2">
                            <button class="w-full px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="generateReport('resource_allocation')">Resource Allocation</button>
                            <button class="w-full px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="generateReport('resource_utilization')">Utilization Analysis</button>
                            <button class="w-full px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200" onclick="generateReport('resource_costs')">Cost Analysis</button>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-purple-50 rounded-lg">
                        <h4 class="font-medium text-purple-800">Financial Reports</h4>
                        <p class="text-sm text-purple-600 mt-1">Budget and financial performance analysis</p>
                        <div class="mt-4 space-y-2">
                            <button class="w-full px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200" onclick="generateReport('budget_status')">Budget Status</button>
                            <button class="w-full px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200" onclick="generateReport('expense_analysis')">Expense Analysis</button>
                            <button class="w-full px-3 py-2 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200" onclick="generateReport('roi_analysis')">ROI Analysis</button>
                        </div>
                    </div>
                </div>

                <!-- Report Generation Options -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium mb-4">Report Generation Options</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <select class="w-full px-3 py-2 border rounded-md" id="reportDateRange">
                                <option value="last_week">Last Week</option>
                                <option value="last_month">Last Month</option>
                                <option value="last_quarter">Last Quarter</option>
                                <option value="last_year">Last Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
                            <select class="w-full px-3 py-2 border rounded-md" id="reportFormat">
                                <option value="pdf">PDF</option>
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Recent Reports -->
                <div class="mt-6">
                    <h4 class="font-medium mb-4">Recent Reports</h4>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <span class="font-medium">Project Status Report</span>
                                <p class="text-sm text-gray-600">Generated on 2024-03-20</p>
                            </div>
                            <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="downloadReport('project_status_20240320')">Download</button>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <span class="font-medium">Resource Utilization Analysis</span>
                                <p class="text-sm text-gray-600">Generated on 2024-03-19</p>
                            </div>
                            <button class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200" onclick="downloadReport('resource_utilization_20240319')">Download</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        mainContent.appendChild(reportsDiv);
    } else {
        reportsSection.classList.remove('hidden');
    }
  }

  function showSettingsSection() {
    // Hide all dashboards and sections
    document.getElementById('adminDashboard')?.classList.add('hidden');
    document.getElementById('projectManagerDashboard')?.classList.add('hidden');
    document.getElementById('siteSupervisorDashboard')?.classList.add('hidden');
    document.getElementById('engineerDashboard')?.classList.add('hidden');
    document.getElementById('logsSection')?.classList.add('hidden');
    document.getElementById('reportsSection')?.classList.add('hidden');

    // Show settings section
    const settingsSection = document.getElementById('settingsSection');
    if (!settingsSection) {
        // Create settings section if it doesn't exist
        const mainContent = document.querySelector('main .container');
        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'settingsSection';
        settingsDiv.className = 'space-y-6';
        settingsDiv.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">System Settings</h3>
                
                <!-- General Settings -->
                <div class="mb-6">
                    <h4 class="font-medium mb-4">General Settings</h4>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">System Timezone</label>
                                <p class="text-sm text-gray-500">Set the default timezone for the system</p>
                            </div>
                            <select class="px-3 py-2 border rounded-md" id="systemTimezone">
                                <option value="UTC">UTC</option>
                                <option value="EST">Eastern Time</option>
                                <option value="PST">Pacific Time</option>
                                <option value="GMT">Greenwich Mean Time</option>
                            </select>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Date Format</label>
                                <p class="text-sm text-gray-500">Set the default date format for the system</p>
                            </div>
                            <select class="px-3 py-2 border rounded-md" id="dateFormat">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="mb-6">
                    <h4 class="font-medium mb-4">Notification Settings</h4>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email Notifications</label>
                                <p class="text-sm text-gray-500">Receive email notifications for important updates</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="emailNotifications">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Push Notifications</label>
                                <p class="text-sm text-gray-500">Receive push notifications for urgent updates</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="pushNotifications">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Security Settings -->
                <div class="mb-6">
                    <h4 class="font-medium mb-4">Security Settings</h4>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                                <p class="text-sm text-gray-500">Enable 2FA for additional security</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" id="twoFactorAuth">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Session Timeout</label>
                                <p class="text-sm text-gray-500">Set the duration before automatic logout</p>
                            </div>
                            <select class="px-3 py-2 border rounded-md" id="sessionTimeout">
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Save Settings Button -->
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onclick="saveSettings()">Save Settings</button>
                </div>
            </div>
        `;
        mainContent.appendChild(settingsDiv);
    } else {
        settingsSection.classList.remove('hidden');
    }
  }

  function generateReport(reportType) {
    const dateRange = document.getElementById('reportDateRange').value;
    const format = document.getElementById('reportFormat').value;
    
    showToast({
        title: "Generating Report",
        description: `Preparing ${reportType} report for ${dateRange} in ${format.toUpperCase()} format...`,
        type: "info"
    });

    // Simulate report generation
    setTimeout(() => {
        showToast({
            title: "Report Generated",
            description: `${reportType} report is ready for download`,
            type: "success"
        });
    }, 2000);
  }

  function downloadReport(reportId) {
    showToast({
        title: "Downloading Report",
        description: "Preparing report for download...",
        type: "info"
    });

    // Simulate download
    setTimeout(() => {
        showToast({
            title: "Download Complete",
            description: "Report has been downloaded successfully",
            type: "success"
        });
    }, 1000);
  }

  function saveSettings() {
    const timezone = document.getElementById('systemTimezone').value;
    const dateFormat = document.getElementById('dateFormat').value;
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const pushNotifications = document.getElementById('pushNotifications').checked;
    const twoFactorAuth = document.getElementById('twoFactorAuth').checked;
    const sessionTimeout = document.getElementById('sessionTimeout').value;

    // In a real application, this would save to the server
    showToast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully",
        type: "success"
    });
  }
  
  function showRoleBasedDashboard(role) {
    // Hide all dashboards first
    document.getElementById('adminDashboard')?.classList.add('hidden');
    document.getElementById('projectManagerDashboard')?.classList.add('hidden');
    document.getElementById('siteSupervisorDashboard')?.classList.add('hidden');
    document.getElementById('engineerDashboard')?.classList.add('hidden');
    document.getElementById('logsSection')?.classList.add('hidden');
    document.getElementById('reportsSection')?.classList.add('hidden');
    document.getElementById('settingsSection')?.classList.add('hidden');

    // Show the appropriate dashboard based on role
    switch (role) {
        case 'admin':
            document.getElementById('adminDashboard')?.classList.remove('hidden');
            initializeAdminDashboard();
            break;
        case 'project_manager':
            document.getElementById('projectManagerDashboard')?.classList.remove('hidden');
            initializeProjectManagerDashboard();
            break;
        case 'site_supervisor':
            document.getElementById('siteSupervisorDashboard')?.classList.remove('hidden');
            initializeSiteSupervisorDashboard();
            break;
        case 'engineer':
            document.getElementById('engineerDashboard')?.classList.remove('hidden');
            initializeEngineerDashboard();
            break;
        default:
            // If no role is specified, show admin dashboard
            document.getElementById('adminDashboard')?.classList.remove('hidden');
            initializeAdminDashboard();
    }
}
  