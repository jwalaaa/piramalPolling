// Initialize the SurveyJS model
const survey = new Survey.Model(json);

// Show or hide the "Validate" button based on the dropdown selection
survey.onValueChanged.add((sender, options) => {
    if (options.name === "question1" && options.value) {
        const validateButton = document.getElementById('validateBtn');
        if (validateButton) {
            validateButton.style.display = 'block';
        }
    } else {
        const validateButton = document.getElementById('validateBtn');
        if (validateButton) {
            validateButton.style.display = 'none';
        }
    }
});

// Handle survey completion
survey.onComplete.add((sender, options) => {
    console.log('Survey completed:', JSON.stringify(sender.data, null, 3));
});

// Render the survey
$("#surveyElement").Survey({ model: survey });

// Function to validate the selection
function validateSelection() {
    const selectedValue = survey.getValue('question1');
    console.log(`Selected Value: ${selectedValue}`);

    if (selectedValue) {
        console.log('Sending validation request');

        // Webhook API call with the validation link
        const webhookUrl = 'https://automation.quickwork.co/staticwebhook/api/http_app/notify/646f45a7262b940cb8de7543/channel_partner_validator';
        const apiBody = {
            channelCode: selectedValue,
            link: "http://127.0.0.1:5500/socket-server/validate.html" // Local validation link
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiBody)
        })
        .then(response => response.text())
        .then(text => {
            console.log('Webhook response text:', text);

            // Start polling for validation result with timeout
            poll(selectedValue);
        })
        .catch(error => {
            console.error('Error in webhook call:', error);
        });
    } else {
        alert('Please select a value before validating.');
    }
}

// Function to poll the database for validation result
function poll(customerId) {
    const apiUrl = `https://apim.quickwork.co/mentortrack/piramal/v1/validation-result?customerId=${16}`;

    // Show loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Set a timeout to cancel polling after 1 minute
    const timeoutId = setTimeout(() => {
        console.log('Polling timed out. Showing retry message.');
        loader.style.display = 'none'; // Hide loader
        showRetryMessage(); // Show retry message on the page
    }, 60000); // 1 minute timeout

    function fetchValidationResult() {
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'apiKey': '2oK4Aa6g89LRzPww4p7C92xcyfbRPn4d',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Polling result:', data);

            if (data.status === "True") {
                // Validation successful
                clearTimeout(timeoutId); // Clear timeout
                loader.style.display = 'none'; // Hide loader
                showSuccessMessage(); // Show success message
            } else {
                console.log('Validation not yet successful, will poll again in 15 seconds.');
                setTimeout(fetchValidationResult, 15000); // Poll again in 15 seconds
            }
        })
        .catch(error => {
            console.error('Error during polling:', error);
            clearTimeout(timeoutId); // Clear timeout on error
            loader.style.display = 'none'; // Hide loader
            showRetryMessage(); // Show retry message on error
        });
    }

    fetchValidationResult(); // Start fetching validation result
}

// Function to show success message
function showSuccessMessage() {
    document.getElementById('successContainer').style.display = 'block'; // Show success message
    document.getElementById('retryContainer').style.display = 'none'; // Hide retry message
    document.getElementById('validateBtn').style.display = 'none'; // Hide validate button
}

// Function to show retry message
function showRetryMessage() {
    document.getElementById('retryContainer').style.display = 'block'; // Show retry message
}

// Function to retry validation
function retryValidation() {
    document.getElementById('retryContainer').style.display = 'none'; // Hide retry message
    document.getElementById('successContainer').style.display = 'none'; // Hide success message
    validateSelection(); // Restart validation process
}
