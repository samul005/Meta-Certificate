// Update timestamp
function updateDateTime() {
    const now = new Date();
    const formatted = now.getUTCFullYear() + '-' + 
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getUTCDate()).padStart(2, '0') + ' ' + 
        String(now.getUTCHours()).padStart(2, '0') + ':' + 
        String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
        String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('currentDateTime').textContent = formatted;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Download handler
async function downloadFile(fileType) {
    const button = event.currentTarget;
    const statusDiv = document.getElementById('downloadStatus');
    const originalText = button.innerHTML;
    
    try {
        button.disabled = true;
        button.innerHTML = '<span class="btn-text">Processing...</span>';
        
        // Simulating file paths - replace these with your actual file paths
        const filePaths = {
            'pdf': 'certificates/meta_certificate.pdf',
            'png': 'certificates/meta_certificate.png'
        };

        // File names for download
        const fileNames = {
            'pdf': `Meta_Certificate_${getCurrentTimestamp()}.pdf`,
            'png': `Meta_Certificate_${getCurrentTimestamp()}.png`
        };

        const response = await fetch(filePaths[fileType]);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileNames[fileType];
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showStatus('success', `${fileType.toUpperCase()} certificate downloaded successfully!`);
    } catch (error) {
        console.error('Download failed:', error);
        showStatus('error', `Failed to download ${fileType.toUpperCase()} certificate. Please try again.`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Helper function to get current timestamp
function getCurrentTimestamp() {
    const now = new Date();
    return now.getUTCFullYear() +
           String(now.getUTCMonth() + 1).padStart(2, '0') +
           String(now.getUTCDate()).padStart(2, '0') +
           String(now.getUTCHours()).padStart(2, '0') +
           String(now.getUTCMinutes()).padStart(2, '0');
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('downloadStatus');
    statusDiv.className = `download-status ${type}`;
    statusDiv.textContent = message;
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusDiv.className = 'download-status';
        statusDiv.textContent = '';
    }, 5000);
}

// Add error handling for file loading
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        showStatus('error', 'Failed to load image resource');
    }
}, true);
