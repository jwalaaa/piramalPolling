const json = {
    "title": "Survey Socket",
    "logoPosition": "right",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "dropdown",
                    "name": "question1",
                    "title": "Select any one",
                    "choices": [
                        "Item 1",
                        "Item 2",
                        "Item 3"
                    ],
                    "choicesOrder": "asc"
                },
                {
                    "type": "html",
                    "name": "validateButton",
                    "html": `
                        <div id="validateContainer">
                            <button id="validateBtn" style="display:none;" onclick="validateSelection()">Validate</button>
                        </div>
                    `
                },
                {
                    "type": "html",
                    "name": "successMessage",
                    "html": `<div id="successContainer" style="display:none; color:green;">Validation successful!</div>`
                },
                {
                    "type": "html",
                    "name": "retryMessage",
                    "html": `<div id="retryContainer" style="display:none; color:red;">Validation process timed out. Please try again.</div>`
                }
            ]
        }
    ]
};
