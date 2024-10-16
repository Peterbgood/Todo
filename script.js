
// Initialize elements
const listSelector = document.getElementById('list-selector');
const newListInput = document.getElementById('new-list-input');
const listContainer = document.getElementById('list-container');
const addListBtn = document.getElementById('add-list-btn');
const saveListBtn = document.getElementById('save-list-btn');

// Hide the add list button and input by default
addListBtn.style.display = 'none';
newListInput.style.display = 'none';
saveListBtn.style.display = 'none';

// Load lists from local storage
let lists = JSON.parse(localStorage.getItem('lists')) || [];

// Function to render list selector options
function renderListSelector() {
    listSelector.innerHTML = '<option value="">Select a list</option>';
    lists.forEach((list, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = list.title;
        listSelector.appendChild(option);
    });
    const addNewListOption = document.createElement('option');
    addNewListOption.value = 'new';
    addNewListOption.text = 'Add New List';
    listSelector.appendChild(addNewListOption);
    listContainer.innerHTML = '';
    
    // Select the last updated list by default
    const lastSelectedIndex = localStorage.getItem('lastSelectedIndex');
    if (lastSelectedIndex !== null && lists.length > 0) {
        listSelector.value = lastSelectedIndex;
        renderList();
    } else if (lists.length > 0) {
        listSelector.value = 0;
        renderList();
    }
}




/**
 * Render list.
 */
function renderList() {
    const selectedListIndex = listSelector.value;
    if (selectedListIndex !== '' && selectedListIndex !== 'new') {
        listContainer.innerHTML = '';
        const list = lists[selectedListIndex];

        // Create input element separately
        const newItemInput = document.createElement('input');
        newItemInput.type = 'text';
        newItemInput.id = 'new-item-input';
        newItemInput.className = 'form-control';
        newItemInput.placeholder = 'Enter new item';

        // Create add button element separately
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary btn-sm';
        addButton.textContent = 'Add';

        // Create input group container
        const inputGroup = document.createElement('div');
        inputGroup.className = 'mt-1 input-group';
        inputGroup.appendChild(newItemInput);
        inputGroup.appendChild(addButton);

        // Create list element
        const listElement = document.createElement('ul');
        listElement.id = 'list';
        listElement.className = 'list-group mt-2';
        list.items.forEach((item, itemIndex) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item align-items-center text-wrap';
            listItem.dataset.index = itemIndex;
            listItem.textContent = item;

            listItem.style.whiteSpace = 'normal';
            listItem.style.wordWrap = 'break-word';
            listItem.style.width = '100%';
            listItem.style.flexWrap = 'wrap';

            listElement.appendChild(listItem);
        });

        // Create delete list button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger w-100 mt-2';
        deleteButton.textContent = 'Delete';

        // Append elements to listContainer
        listContainer.appendChild(inputGroup);
        listContainer.appendChild(listElement);
        listContainer.appendChild(deleteButton);

        // Add event listener for add button
        addButton.addEventListener('click', () => {
            addItem(selectedListIndex);
            newItemInput.value = '';
            newItemInput.focus();
        });

        // Add event listener for enter key press
        newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addItem(selectedListIndex);
                newItemInput.value = '';
                setTimeout(() => {
                    newItemInput.focus();
                }, 0);
            }
        });

        // Prevent blur
        newItemInput.addEventListener('blur', (e) => {
            e.preventDefault();
            setTimeout(() => {
                newItemInput.focus();
            }, 0);
        });

        // Add event listeners for list items
        const listItems = listElement.children;
        Array.from(listItems).forEach((item) => {
            // Double-click to move up
            let lastClick = 0;
            item.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                if (currentTime - lastClick < 500) {
                    moveUp(selectedListIndex, parseInt(item.dataset.index));
                }
                lastClick = currentTime;
            });

            // Press-and-hold (long press) to delete on mobile
            let timer;
            item.addEventListener('touchstart', () => {
                timer = setTimeout(() => {
                    deleteItem(selectedListIndex, parseInt(item.dataset.index));
                }, 500);
            });
            item.addEventListener('touchend', () => {
                clearTimeout(timer);
            });

            // For desktop delete
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                deleteItem(selectedListIndex, parseInt(item.dataset.index));
            });
        });

        // Delete list button event listener
        deleteButton.addEventListener('click', () => {
            deleteList(selectedListIndex);
        });
    } else if (selectedListIndex === 'new') {
        const newListHtml = `
            <div class="mt-1 input-group">
                <input type="text" id="new-list-input" class="form-control" placeholder="Enter new list title">
                <button class="btn btn-primary btn-sm" id="save-new-list-btn">Save</button>
            </div>
        `;
        listContainer.innerHTML = '';
        listContainer.insertAdjacentHTML('beforeend', newListHtml);

        // Add event listener for save button
        const saveNewListBtn = document.getElementById('save-new-list-btn');
        saveNewListBtn.addEventListener('click', saveList);

        // Add event listener for Enter key press
        const newListInput = document.getElementById('new-list-input');
        newListInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveList();
                newListInput.value = '';
                setTimeout(() => {
                    newListInput.focus();
                }, 0);
            }
        });

                      // Prevent blur
        newListInput.addEventListener('blur', (e) => {
            e.preventDefault();
            setTimeout(() => {
                newListInput.focus();
            }, 0);
        });
    } else {
        // Hide all buttons and inputs when no list is selected
        listContainer.innerHTML = '';
    }
}






// Function to save new list
function saveList() {
    const newListTitle = document.getElementById('new-list-input').value.trim();
    if (newListTitle) {
        lists.push({ title: newListTitle, items: [] });
        localStorage.setItem('lists', JSON.stringify(lists));
        document.getElementById('new-list-input').value = '';
        renderListSelector();
        // Select the newly added list
        listSelector.value = lists.length - 1;
        renderList();
        // Store the index of the selected list in local storage
        localStorage.setItem('lastSelectedIndex', listSelector.value);
    }
}

listSelector.addEventListener('change', () => {
    renderList();
    // Store the index of the selected list in local storage
    if (listSelector.value !== 'new') {
        localStorage.setItem('lastSelectedIndex', listSelector.value);
    }
});

// Function to delete list
function deleteList(index) {
    lists.splice(index, 1);
    localStorage.setItem('lists', JSON.stringify(lists));
    renderListSelector();
}

// Function to add item to list
function addItem(listIndex) {
    const newItemInput = document.getElementById('new-item-input');
    const newItem = newItemInput.value.trim();
    if (newItem) {
        lists[listIndex].items.push(newItem);
        localStorage.setItem('lists', JSON.stringify(lists));
        newItemInput.value = '';
        renderList();
        // Focus on the input element after renderList() has completed
        setTimeout(() => {
            const newInputBox = document.getElementById('new-item-input');
            newInputBox.focus();
            newInputBox.setSelectionRange(0, 0); // Set cursor position
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                // For mobile devices, manually open the keyboard
                newInputBox.click();
                newInputBox.setSelectionRange(0, 0); // Set cursor position
            }
        }, 50); // adjust the delay as needed
    }
}

// Function to delete item from list
function deleteItem(listIndex, itemIndex) {
    lists[listIndex].items.splice(itemIndex, 1);
    localStorage.setItem('lists', JSON.stringify(lists));
    renderList();
}

// Function to move item up
function moveUp(listIndex, itemIndex) {
    if (itemIndex > 0) {
        const item = lists[listIndex].items.splice(itemIndex, 1)[0];
        lists[listIndex].items.splice(itemIndex - 1, 0, item);
        localStorage.setItem('lists', JSON.stringify(lists));
        renderList();
    }
}

renderListSelector();