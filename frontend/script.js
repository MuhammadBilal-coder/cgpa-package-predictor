async function getPrediction() {
    const cgpaInput = document.getElementById('cgpa');
    const cgpa = cgpaInput.value;
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const resultText = document.querySelector('.result-text');
    const resultIcon = document.querySelector('.result-icon');
    
    // Reset previous states
    resultDiv.classList.remove('show', 'error', 'warning');
    loadingDiv.classList.remove('show');
    
    // Validation
    if (!cgpa || cgpa <= 0 || cgpa > 4) {
        showError('❌ Please enter a valid CGPA between 0 and 4!');
        shakeInput(cgpaInput);
        return;
    }
    
    // Show loading
    loadingDiv.classList.add('show');
    
    // Wait for animation
    await sleep(1500);
    
    try {
        // API Call
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cgpa: parseFloat(cgpa) })
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        // Hide loading
        loadingDiv.classList.remove('show');
        
        // Show result
        resultIcon.className = 'result-icon fas fa-check-circle';
        resultText.textContent = data.result;
        resultDiv.classList.add('show');
        
        // Celebration effect
        celebrate();
        
    } catch (error) {
        // Hide loading
        loadingDiv.classList.remove('show');
        
        // Show warning
        resultIcon.className = 'result-icon fas fa-exclamation-triangle';
        resultText.textContent = '⚠️ Backend is not running! Please start the API server.';
        resultDiv.classList.add('show', 'warning');
    }
}

// Helper Functions
function showError(message) {
    const resultDiv = document.getElementById('result');
    const resultText = document.querySelector('.result-text');
    const resultIcon = document.querySelector('.result-icon');
    
    resultIcon.className = 'result-icon fas fa-times-circle';
    resultText.textContent = message;
    resultDiv.classList.add('show', 'error');
}

function shakeInput(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function celebrate() {
    console.log('🎉 Prediction successful!');
}

// Enter key support
document.getElementById('cgpa').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getPrediction();
    }
});

// Add focus effect on page load
window.addEventListener('load', function() {
    document.getElementById('cgpa').focus();
});