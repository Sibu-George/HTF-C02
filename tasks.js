
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
    loadTasksData(user);
    
    // Setup event listeners
    document.getElementById('logout-button').addEventListener('click', handleLogout);
    document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('priority-filter').addEventListener('change', handlePriorityFilterChange);
    
    // Setup tab buttons
    document.querySelectorAll('[data-status]').forEach(button => {
      button.addEventListener('click', handleStatusFilterChange);
    });
    
    // Modal event listeners
    document.getElementById('modal-overlay').addEventListener('click', closeTaskModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeTaskModal);
    document.getElementById('cancel-update').addEventListener('click', closeTaskModal);
    document.getElementById('save-status-update').addEventListener('click', updateTaskStatus);
    
    // New task button
    document.getElementById('new-task-btn').addEventListener('click', () => {
      showToast({
        title: "Feature Coming Soon",
        description: "The ability to create new tasks will be available soon.",
        type: "default"
      });
    });
  });
  
  // Mock tasks data (in a real app, this would be fetched from a backend)
  const mockTasks = [
    { 
      id: 1, 
      name: 'Foundation Excavation', 
      description: 'Prepare site and excavate foundation according to engineering specifications.',
      status: 'completed',
      priority: 'high',
      projectId: 1,
      startDate: '2024-01-20',
      endDate: '2024-02-05',
      assignedTo: 3
    },
    { 
      id: 2, 
      name: 'Structural Steel Installation', 
      description: 'Install main structural steel components for the office building frame.',
      status: 'in_progress',
      priority: 'high',
      projectId: 1,
      startDate: '2024-02-10',
      endDate: '2024-03-30',
      assignedTo: 3
    },
    { 
      id: 3, 
      name: 'Electrical System Design Review', 
      description: 'Review the electrical system design plans with the engineering team.',
      status: 'not_started',
      priority: 'medium',
      projectId: 1,
      startDate: '2024-03-15',
      endDate: '2024-03-25',
      assignedTo: 3
    },
    { 
      id: 4, 
      name: 'HVAC Installation', 
      description: 'Install heating, ventilation, and air conditioning systems in the office building.',
      status: 'not_started',
      priority: 'medium',
      projectId: 1,
      startDate: '2024-05-01',
      endDate: '2024-06-15',
      assignedTo: 3
    },
    { 
      id: 5, 
      name: 'Site Survey for Condominiums', 
      description: 'Conduct comprehensive site survey for the seaside condominium project.',
      status: 'in_progress',
      priority: 'high',
      projectId: 2,
      startDate: '2024-03-01',
      endDate: '2024-03-20',
      assignedTo: 3
    },
    { 
      id: 6, 
      name: 'Bridge Foundation Preparation', 
      description: 'Prepare and reinforce existing foundation for bridge replacement.',
      status: 'in_progress',
      priority: 'high',
      projectId: 3,
      startDate: '2023-11-10',
      endDate: '2024-01-15',
      assignedTo: 3
    },
    { 
      id: 7, 
      name: 'Bridge Design Review', 
      description: 'Review and approve final design documents for the highway bridge.',
      status: 'completed',
      priority: 'medium',
      projectId: 3,
      startDate: '2023-11-05',
      endDate: '2023-11-30',
      assignedTo: 2
    },
    { 
      id: 8, 
      name: 'Data Center Cooling System Planning', 
      description: 'Design and plan advanced cooling systems for the green energy data center.',
      status: 'delayed',
      priority: 'medium',
      projectId: 4,
      startDate: '2023-09-01',
      endDate: '2023-10-15',
      assignedTo: 3
    },
    { 
      id: 9, 
      name: 'Hospital Wing Electrical Wiring', 
      description: 'Complete electrical wiring for the new hospital expansion wing.',
      status: 'in_progress',
      priority: 'high',
      projectId: 5,
      startDate: '2024-01-20',
      endDate: '2024-03-15',
      assignedTo: 3
    },
    { 
      id: 10, 
      name: 'Historic Building Facade Restoration', 
      description: 'Restore and preserve the historic facades of downtown buildings.',
      status: 'completed',
      priority: 'low',
      projectId: 6,
      startDate: '2023-06-15',
      endDate: '2023-10-30',
      assignedTo: 3
    }
  ];
  
  // Mock projects data for reference
  const mockProjects = [
    { id: 1, name: 'Downtown Office Building', manager: 2 },
    { id: 2, name: 'Seaside Condominiums', manager: 2 },
    { id: 3, name: 'Highway Bridge Replacement', manager: 2 },
    { id: 4, name: 'Green Energy Data Center', manager: 2 },
    { id: 5, name: 'Hospital Expansion Wing', manager: 2 },
    { id: 6, name: 'Historic Downtown Renovation', manager: 3 }
  ];
  
  // Mock users data for reference
  const mockUsers = [
    { id: 1, name: 'Admin User', role: 'admin', avatar: '' },
    { id: 2, name: 'Project Manager', role: 'project_manager', avatar: '' },
    { id: 3, name: 'Site Engineer', role: 'site_engineer', avatar: '' }
  ];
  
  // Filter state
  let searchQuery = '';
  let priorityFilter = 'all';
  let statusFilter = 'all';
  let currentTaskId = null;
  
  function setupUI(user) {
    // Setup sidebar
    setupSidebar(user);
    
    // Setup user profile
    setupUserProfile(user);
    
    // Show/hide new task button based on user role
    const newTaskBtn = document.getElementById('new-task-btn');
    if (user.role === 'site_engineer') {
      newTaskBtn.classList.add('hidden');
    } else {
      newTaskBtn.classList.remove('hidden');
    }
  }
  
  function loadTasksData(user) {
    // In a real app, this would fetch data from an API
    // Apply filters for display
    displayFilteredTasks(user);
    
    // Initialize chart
    initializeTasksChart(user);
  }
  
  function displayFilteredTasks(user) {
    // Filter based on user role
    let tasks = [];
    
    if (user.role === 'site_engineer') {
      tasks = mockTasks.filter(task => task.assignedTo === user.id);
    } else if (user.role === 'project_manager') {
      // Get projects managed by this manager
      const managedProjects = mockProjects.filter(p => p.manager === user.id);
      // Return tasks that belong to these projects
      tasks = mockTasks.filter(task => 
        managedProjects.some(p => p.id === task.projectId)
      );
    } else {
      tasks = mockTasks; // Admin sees all tasks
    }
    
    // Apply search, priority and status filters
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = searchQuery ? 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) 
        : true;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
    
    renderTasksList(filteredTasks);
    updateTasksCounters(tasks);
  }
  
  function renderTasksList(tasks) {
    const container = document.getElementById('tasks-container');
    const emptyState = document.getElementById('empty-state');
    
    container.innerHTML = '';
    
    if (tasks.length === 0) {
      container.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }
    
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    tasks.forEach(task => {
      const card = document.createElement('div');
      card.className = 'rounded-lg border bg-white shadow hover:shadow-md transition-shadow overflow-hidden';
      card.dataset.taskId = task.id;
      
      // Get project name
      const project = mockProjects.find(p => p.id === task.projectId);
      const projectName = project ? project.name : 'Unknown Project';
      
      // Get assigned user
      const assignedUser = mockUsers.find(u => u.id === task.assignedTo);
      
      // Format dates
      const startDate = formatDate(task.startDate);
      const endDate = formatDate(task.endDate);
      
      // Get status and priority badge colors
      const statusBadgeClass = getStatusColor(task.status);
      const priorityBadgeClass = getPriorityColor(task.priority);
      
      card.innerHTML = `
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-medium text-lg">${task.name}</div>
              <div class="text-sm text-gray-500 mt-1">${projectName}</div>
              <div class="text-sm text-gray-500 mt-2">${task.description}</div>
              <div class="flex flex-wrap items-center gap-4 mt-4">
                <div class="flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  <span>${startDate} - ${endDate}</span>
                </div>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusBadgeClass}">
                  ${task.status.replace('_', ' ')}
                </span>
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${priorityBadgeClass}">
                  ${task.priority}
                </span>
              </div>
            </div>
            ${assignedUser ? `
              <div class="flex flex-col items-end">
                <div class="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  ${assignedUser.name.charAt(0)}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  ${assignedUser.name}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="border-t p-2 flex justify-end gap-2">
          <button class="update-status-btn px-3 py-1.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded">Update Status</button>
          <button class="view-details-btn px-3 py-1.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded">View Details</button>
        </div>
      `;
      
      // Add event listeners to the buttons
      const updateStatusBtn = card.querySelector('.update-status-btn');
      updateStatusBtn.addEventListener('click', () => {
        showUpdateStatusModal(task.id);
      });
      
      const viewDetailsBtn = card.querySelector('.view-details-btn');
      viewDetailsBtn.addEventListener('click', () => {
        showTaskDetails(task.id);
      });
      
      container.appendChild(card);
    });
  }
  
  function updateTasksCounters(tasks) {
    // Count tasks by status
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('in-progress-tasks').textContent = 
      tasks.filter(t => t.status === 'in_progress').length;
    document.getElementById('completed-tasks').textContent = 
      tasks.filter(t => t.status === 'completed').length;
    document.getElementById('delayed-tasks').textContent = 
      tasks.filter(t => t.status === 'delayed').length;
  }
  
  function initializeTasksChart(user) {
    // Filter tasks based on user role
    let tasks = [];
    
    if (user.role === 'site_engineer') {
      tasks = mockTasks.filter(task => task.assignedTo === user.id);
    } else if (user.role === 'project_manager') {
      // Get projects managed by this manager
      const managedProjects = mockProjects.filter(p => p.manager === user.id);
      // Return tasks that belong to these projects
      tasks = mockTasks.filter(task => 
        managedProjects.some(p => p.id === task.projectId)
      );
    } else {
      tasks = mockTasks; // Admin sees all tasks
    }
    
    // Count tasks by status
    const notStarted = tasks.filter(t => t.status === 'not_started').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const delayed = tasks.filter(t => t.status === 'delayed').length;
    
    // Count tasks by priority
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;
    
    const ctx = document.getElementById('tasks-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.tasksChart) {
      window.tasksChart.destroy();
    }
    
    window.tasksChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
        datasets: [
          {
            label: 'Task Status',
            data: [notStarted, inProgress, completed, delayed],
            backgroundColor: [
              'rgba(107, 114, 128, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(34, 197, 94, 0.7)',
              'rgba(239, 68, 68, 0.7)'
            ],
            borderColor: [
              'rgb(107, 114, 128)',
              'rgb(59, 130, 246)',
              'rgb(34, 197, 94)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 1
          },
          {
            label: 'Priority Distribution',
            data: [highPriority, mediumPriority, lowPriority, 0],
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
            borderColor: 'rgb(249, 115, 22)',
            borderWidth: 1,
            hidden: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Tasks'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Status'
            }
          }
        }
      }
    });
  }
  
  function handleSearch(event) {
    searchQuery = event.target.value;
    
    // Get user
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (user) {
      displayFilteredTasks(user);
    }
  }
  
  function handlePriorityFilterChange(event) {
    priorityFilter = event.target.value;
    
    // Get user
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (user) {
      displayFilteredTasks(user);
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
      displayFilteredTasks(user);
    }
  }
  
  function showUpdateStatusModal(taskId) {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Save current task ID
    currentTaskId = taskId;
    
    // Get project name
    const project = mockProjects.find(p => p.id === task.projectId);
    const projectName = project ? project.name : 'Unknown Project';
    
    const modal = document.getElementById('task-modal');
    document.getElementById('task-name').textContent = task.name;
    document.getElementById('task-project').textContent = projectName;
    
    // Current status badge
    const currentStatusElement = document.getElementById('current-status');
    currentStatusElement.textContent = task.status.replace('_', ' ');
    currentStatusElement.className = `inline-block rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(task.status)}`;
    
    // Set selected option in status dropdown
    const statusSelect = document.getElementById('status-select');
    statusSelect.value = task.status;
    
    // Clear notes
    document.getElementById('status-notes').value = '';
    
    // Show modal
    modal.classList.remove('hidden');
  }
  
  function updateTaskStatus() {
    if (!currentTaskId) return;
    
    const task = mockTasks.find(t => t.id === currentTaskId);
    if (!task) return;
    
    const newStatus = document.getElementById('status-select').value;
    const notes = document.getElementById('status-notes').value;
    
    // Update task status
    task.status = newStatus;
    
    // Close modal
    closeTaskModal();
    
    // Show success toast
    showToast({
      title: "Status Updated",
      description: `Task "${task.name}" status changed to ${newStatus.replace('_', ' ')}.`,
      type: "success"
    });
    
    // Refresh task list
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    if (user) {
      displayFilteredTasks(user);
      initializeTasksChart(user);
    }
  }
  
  function showTaskDetails(taskId) {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Get project name
    const project = mockProjects.find(p => p.id === task.projectId);
    const projectName = project ? project.name : 'Unknown Project';
    
    // Show toast with task details
    showToast({
      title: task.name,
      description: `${projectName} - ${task.priority} priority, ${task.status.replace('_', ' ')}`,
      type: "default"
    });
  }
  
  function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.add('hidden');
    currentTaskId = null;
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  