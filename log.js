(function () {
    // Select the existing form
    const existingForm = document.querySelector('.new_time_entry');

    // Create a new form element
    const newForm = document.createElement('form');
    newForm.className = 'new_time_entry';

    // Insert the new form after the existing one
    existingForm.insertAdjacentElement('afterend', newForm);

    // Create a wrapper div element with class "box tabular"
    const boxTabular = document.createElement('div');
    boxTabular.className = 'box tabular';
    newForm.appendChild(boxTabular);

    const padNumber = (number) => {
        return number.toString().padStart(2, '0');
    };

    const wrapElements = (parent, ...children)=> {
        const wrapper = document.createElement('p');
        for (let i in children) {
            wrapper.appendChild(children[i]);
        }
        parent.appendChild(wrapper);
    };

    // Function to create and append elements to the form
    const appendFormElements = (parent) => {
        // Create and append Comment textfield
        const commentLabel = document.createElement('label');
        commentLabel.htmlFor = 'comment';
        commentLabel.innerText = 'Comment:';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.id = 'comment';
        commentInput.name = 'comment';
        wrapElements(parent, commentLabel, commentInput);

        // Create and append Hours number input
        const hoursLabel = document.createElement('label');
        hoursLabel.htmlFor = 'hours';
        hoursLabel.innerText = 'Hours:';

        const hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.id = 'hours';
        hoursInput.name = 'hours';
        hoursInput.min = '0';
        hoursInput.max = '10';
        hoursInput.step = '0.01';
        wrapElements(parent, hoursLabel, hoursInput);

        // Get current year and month
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Create and append Year select
        const yearLabel = document.createElement('label');
        yearLabel.htmlFor = 'year';
        yearLabel.innerText = 'Year:';

        const yearSelect = document.createElement('select');

        [currentYear - 1, currentYear, currentYear + 1].forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.innerText = year;
            if (year === currentYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        });

        yearSelect.id = 'year';
        yearSelect.name = 'year';

        // Create and append Month select
        const monthLabel = document.createElement('label');
        monthLabel.htmlFor = 'month';
        monthLabel.innerText = 'Month:';

        const monthSelect = document.createElement('select');

        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            if (i === currentMonth) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        }

        monthSelect.id = 'month';
        monthSelect.name = 'month';
        wrapElements(parent, yearLabel, yearSelect);
        wrapElements(parent, monthLabel, monthSelect);
    };

    // Add Perform Log button
    const performLogButton = document.createElement('button');
    performLogButton.type = 'button';
    performLogButton.innerText = 'Perform log';
    boxTabular.appendChild(performLogButton);

    // Fill the new form with elements
    appendFormElements(boxTabular);

    // Create controls for the two-dimensional array
    const arrayContainer = document.createElement('div');
    arrayContainer.className = 'array-container';
    boxTabular.appendChild(arrayContainer);

    const addFirstDimButton = document.createElement('button');
    addFirstDimButton.type = 'button';
    addFirstDimButton.innerText = 'Add date';

    // Attach Add date button after the list of dates
    boxTabular.appendChild(addFirstDimButton);

    // Function to create a new first dimension container with controls
    const createFirstDim = () => {
        const firstDimContainer = document.createElement('div');
        firstDimContainer.className = 'first-dim-container';

        const removeFirstDimButton = document.createElement('button');
        removeFirstDimButton.type = 'button';
        removeFirstDimButton.innerText = 'Remove entry';
        firstDimContainer.appendChild(removeFirstDimButton);

        const addSecondDimButton = document.createElement('button');
        addSecondDimButton.type = 'button';
        addSecondDimButton.innerText = 'Convert to range';
        firstDimContainer.appendChild(addSecondDimButton);

        const secondDimContainer = document.createElement('div');
        secondDimContainer.className = 'dimension-container';
        firstDimContainer.appendChild(secondDimContainer);

        arrayContainer.appendChild(firstDimContainer);

        // Add initial input for the first date
        const initialInput = document.createElement('input');
        initialInput.type = 'number';
        initialInput.min = '1';
        initialInput.max = '31';
        initialInput.value = '1';

        const previousContainer = firstDimContainer.previousElementSibling;
        if (previousContainer !== null) {
            const prevInput = previousContainer.lastChild;
            initialInput.value = (parseFloat(prevInput.value) + 1).toFixed(2).toString();
        }

        secondDimContainer.appendChild(initialInput);

        // Event listener for adding second dimension
        addSecondDimButton.addEventListener('click', (e) => {
            if (secondDimContainer.childElementCount < 2) {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '31';
                input.value = (1 + parseFloat(e.currentTarget.parentElement.querySelector('input').value)).toFixed(2).toString();
                if (Number(input.value) <= Number(input.max)) {
                    secondDimContainer.appendChild(input);
                } else {
                    alert('No free available dates for the range.');
                }
                // Hide the button after adding the second input
                addSecondDimButton.style.display = 'none';
            } else {
                alert('You can add a maximum of two items in the second dimension.');
            }
        });

        // Event listener for removing first dimension
        removeFirstDimButton.addEventListener('click', () => {
            arrayContainer.removeChild(firstDimContainer);
        });
    };

    // Event listener for adding first dimension
    addFirstDimButton.addEventListener('click', createFirstDim);

    // Function to open a new tab and return a promise with the tab's document object
    const openTab = (url) => {
        return new Promise((resolve) => {
            const newTab = window.open(url, '_blank');
            const interval = setInterval(() => {
                if (newTab.document.readyState === 'complete') {
                    clearInterval(interval);
                    resolve(newTab);
                }
            }, 100);
        });
    };

    // Function to wait until the expected elements in a document are ready
    const waitForElements = (doc, selectors, timeout) => {
        return new Promise((resolve) => {
            const start = Date.now();
            const interval = setInterval(() => {
                if (selectors.every(selector => doc.querySelector(selector)) || (timeout && (Date.now() - start) / 1000 >= timeout)) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    };

    // Function to fill form elements, trigger click, and close tab upon success notice
    const processEntryInTab = async (entry, url) => {
        const newTab = await openTab(url);
        newTab.addEventListener('load', async (event) => {
            const doc = newTab.document;

            await waitForElements(doc, ['#time_entry_spent_on', '#time_entry_hours', '#time_entry_activity_id', '#time_entry_comments', 'input[name="continue"]'], 9);

            doc.querySelector('#time_entry_spent_on').value = entry.date;
            doc.querySelector('#time_entry_hours').value = entry.hours;
            doc.querySelector('#time_entry_activity_id').value = 9;
            doc.querySelector('#time_entry_comments').value = entry.comment;

            doc.querySelector('input[name="continue"]').click();

            await waitForElements(doc, ['#flash_notice'], 3);

            newTab.close();
        });
        
    };

    // Function to process all log entries one by one
    const processAllEntries = async (entries, url) => {
        for (const entry of entries) {
            await processEntryInTab(entry, url);
        }
    };

    // Event listener for logging the form data
    performLogButton.addEventListener('click', async () => {
        const comment = document.getElementById('comment').value;
        const hours = parseFloat(document.getElementById('hours').value);
        const year = parseInt(document.getElementById('year').value);
        const month = parseInt(document.getElementById('month').value);

        const dates = [];
        document.querySelectorAll('.first-dim-container').forEach(firstDimContainer => {
            const secondDimArray = [];
            firstDimContainer.querySelectorAll('input[type="number"]').forEach(input => {
                secondDimArray.push(parseInt(input.value));
            });
            dates.push(secondDimArray);
        });

        const formData = {
            comment: comment,
            hours: hours,
            year: year,
            month: month,
            dates: dates
        };

        // Generate array of objects
        const logEntries = dates.flatMap(range => {
            if (range.length === 2) {
                const start = range[0];
                const end = range[1];
                return Array(end - start + 1).fill().map((_, idx) => {
                    const day = start + idx;
                    return {
                        date: [year, padNumber(month), padNumber(day)].join('-'),
                        hours: hours,
                        comment: comment
                    };
                });
            } else {
                return range.map(day => {
                    return {
                        date: [year, padNumber(month), padNumber(day)].join('-'),
                        hours: hours,
                        comment: comment
                    };
                });
            }
        });

        // Process each log entry sequentially in a new tab
        const currentUrl = window.location.href;
        await processAllEntries(logEntries, currentUrl);
    });
})();
