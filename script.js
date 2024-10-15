
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

// Function to render list
function renderList() {
    const selectedListIndex = listSelector.value;
    if (selectedListIndex !== '' && selectedListIndex !== 'new') {
        listContainer.innerHTML = '';
        const list = lists[selectedListIndex];
        const listHtml = `
            <div class="mt-1  input-group">
                <input type="text" id="new-item-input" class="form-control" maxlength="30" placeholder="Enter new item">
                <button class="btn btn-primary btn-sm" onclick="addItem(${selectedListIndex})">Add</button>
            </div>
            <ul id="list" class="list-group mt-2">
                ${list.items.map((item, itemIndex) => `
             <li class="list-group-item d-flex align-items-center">
    ${item}
    <div class="ms-auto">
        <button class="btn btn-primary btn-sm me-1" onclick="moveUp(${selectedListIndex}, ${itemIndex})">Up</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem(${selectedListIndex}, ${itemIndex})">Delete</button>
    </div>
</li>
                `).join('')}
            </ul>
            <button class="btn btn-danger w-100 mt-2" onclick="deleteList(${selectedListIndex})">Delete</button>
        `;
        listContainer.insertAdjacentHTML('beforeend', listHtml);
        // Add event listener for enter key press
        const newItemInput = document.getElementById('new-item-input');
        newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addItem(selectedListIndex);
            }
        });
    } else if (selectedListIndex === 'new') {
        const newListHtml = `
            <div class="mt-1  input-group">
                <input type="text" id="new-list-input" class="form-control" maxlength="30" placeholder="Enter new list title">
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
                saveList();
            }
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