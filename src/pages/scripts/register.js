// Utility function to handle API request errors
function handleRequestError(response) {
    if (!response.ok) {
        return response.json().then(errData => {
            throw new Error(errData.content || 'Unknown error occurred');
        });
    }
    return response.json();
}

// Utility function to validate form input
function validateFormInput(fields) {
    for (const [key, value] of Object.entries(fields)) {
        if (!value.trim()) {
            return `Field "${key}" is required.`;
        }
    }
    return null;
}

// Register request with JSON payload
async function registerRequest(data) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Send as JSON
            },
            body: JSON.stringify(data),  // Convert data to JSON string
        });

        return await handleRequestError(response);  // Handle possible errors
    } catch (error) {
        return { status: 'error', content: error.message };  // Return error message if request fails
    }
}

// Form submit handler
async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const data = {
        username: form.querySelector('#username').value,
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
        firstName: form.querySelector('#firstName').value,
        lastName: form.querySelector('#lastName').value,
        level: form.querySelector('#level').value,
        classe: form.querySelector('#classe').value
    };

    // Validate input
    const validationError = validateFormInput(data);
    if (validationError) {
        displayError(validationError);
        return;
    }

    // Call the register request function
    const response = await registerRequest(data);

    if (response.status === 'error') {
        displayError(response.content);  // Display error message
    } else {
        displaySuccess("Registration successful");  // Display success message
    }
}

// Display error message
function displayError(message) {
    const registerError = document.querySelector(".register-error");
    const registerSuccess = document.querySelector(".register-success");

    registerSuccess.hidden = true;
    registerError.hidden = false;
    registerError.innerHTML = `<b>Errors :</b><br>${message}`;
}

// Display success message
function displaySuccess(message) {
    const registerError = document.querySelector(".register-error");
    const registerSuccess = document.querySelector(".register-success");

    registerError.hidden = true;
    registerSuccess.hidden = false;
    registerSuccess.innerHTML = message;
}

// Add event listener for form submit
document.querySelector(".auth-form").addEventListener("submit", handleSubmit);
