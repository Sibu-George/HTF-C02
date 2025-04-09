// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminLogs();
});

// Initialize all log sections
function initializeAdminLogs() {
    loadSystemLogs();
    loadUserActivityLogs();
    loadAuditTrail();
    updateLogCounts();
}

// Load system logs
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

// Load user activity logs
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

// Load audit trail
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

// Filter logs by level
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

// Get CSS class for log level
function getLogLevelClass(level) {
    const colors = {
        error: 'bg-red-50 text-red-800',
        warning: 'bg-yellow-50 text-yellow-800',
        info: 'bg-blue-50 text-blue-800'
    };
    return colors[level] || 'bg-gray-50 text-gray-800';
}

// Get color for log level
function getLogLevelColor(level) {
    const colors = {
        error: 'red',
        warning: 'yellow',
        info: 'blue'
    };
    return colors[level] || 'gray';
}

// Update log counts
function updateLogCounts() {
    const visibleLogs = document.querySelectorAll('#systemLogs div[style="display: block"]').length;
    const totalLogs = document.querySelectorAll('#systemLogs div').length;
    
    document.getElementById('logCount').textContent = visibleLogs;
    document.getElementById('totalLogs').textContent = totalLogs;
}

// Load more logs
function loadMoreLogs() {
    showToast({
        title: 'Loading More Logs',
        description: 'Fetching additional log entries...',
        type: 'info'
    });
}

// Export logs
function exportLogs() {
    showToast({
        title: 'Exporting Logs',
        description: 'Preparing log file for download...',
        type: 'info'
    });
}

// Show toast notification
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
            <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <p class="text-sm mt-1">${description}</p>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
} 