// Utility function to handle API request errors
function handleRequestError(response) {
    if (!response.ok) {
        return response.json().then(errData => {
            console.log(errData);
            
            throw new Error(errData.message || 'An unknown error occurred.');
        });
    }
    return response.json();
}

// Function to handle login request
async function loginRequest(email, password) {
    const data = { email, password };

    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Specify JSON format
            },
            body: JSON.stringify(data),  // Send data as JSON
        });

        return await handleRequestError(response);  // Handle possible errors
    } catch (error) {
        return { status: 'error', content: error.message };  // Return error message if request fails
    }
}

// Function to validate form fields
function validateFormFields(email, password) {
    if (!email || !password) {
        return "Both email and password are required.";
    }
    return null;
}

// Function to handle form submission
async function handleLoginSubmit(event) {
    event.preventDefault();

    const loginForm = event.target;
    const email = loginForm.querySelector("#email").value;
    const password = loginForm.querySelector("#password").value;

    // Validate input fields
    const validationError = validateFormFields(email, password);
    if (validationError) {
        displayError(validationError);  // Display error message if validation fails
        return;
    }

    const response = await loginRequest(email, password);
    handleLoginResponse(response);
}

// Function to display error message
function displayError(message) {
    const loginError = document.querySelector(".login-error");
    const loginSuccess = document.querySelector(".login-success");

    if (loginError) {
        loginError.hidden = false;
        loginError.innerHTML = `<b>Error:</b> ${message}`;
    }

    if (loginSuccess) {
        loginSuccess.hidden = true;
    }
}

// Function to display success message
function displaySuccess(message) {
    const loginError = document.querySelector(".login-error");
    const loginSuccess = document.querySelector(".login-success");

    if (loginError) {
        loginError.hidden = true;
    }

    if (loginSuccess) {
        loginSuccess.hidden = false;
        loginSuccess.innerHTML = message;
    }
}

// Function to handle login response
function handleLoginResponse(response) {
    console.log(response)
    if (response.status === 'error') {
        displayError(response.content);  // Display error message
    } else {
        localStorage.setItem('token', response.token);  // Save the new token
        displaySuccess("Login successful! Redirecting...");  // Display success message
        window.location = "/index.html?registered=true";  // Redirect after successful login
    }
}

// Add event listener to the login form
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", handleLoginSubmit);
});
