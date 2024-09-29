// Initialize lists container
// Initialize lists container
// Initialize lists container
// Initialize lists container
// Initialize lists container
const listSelector = document.getElementById('list-selector');
const newListInput = document.getElementById('new-list-input');
const addListBtn = document.getElementById('add-list-btn');
const saveListBtn = document.getElementById('save-list-btn');
const listContainer = document.getElementById('list-container');

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
    listContainer.innerHTML = '';
    // Select the first list by default
    if (lists.length > 0) {
        listSelector.value = 0;
        renderList();
    }
}

// Function to render list
function renderList() {
    const selectedListIndex = listSelector.value;
    if (selectedListIndex !== '') {
        listContainer.innerHTML = '';
        const list = lists[selectedListIndex];
        const listHtml = `
            <div class="mt-3 input-group">
                <input type="text" id="new-item-input" class="form-control" placeholder="Enter new item">
                <button class="btn btn-primary btn-sm" onclick="addItem(${selectedListIndex})">Add</button>
            </div>
            <ul id="list" class="list-group mt-2">
                ${list.items.map((item, itemIndex) => `
                   <li class="list-group-item d-flex align-items-center">
    ${item}
    <button class="btn btn-danger btn-sm ms-auto float-end " onclick="deleteItem(${selectedListIndex}, ${itemIndex})">Delete</button>
    <button class="btn btn-primary btn-sm ms-auto float-end " onclick="moveUp(${selectedListIndex}, ${itemIndex})">Up</button>
</li>
                `).join('')}
            </ul>
            <button class="btn btn-danger w-100 mt-2" onclick="deleteList(${selectedListIndex})">Delete List</button>
        `;
        listContainer.insertAdjacentHTML('beforeend', listHtml);
        // Add event listener for enter key press
        const newItemInput = document.getElementById('new-item-input');
        newItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addItem(selectedListIndex);
            }
        });
    }
}

// Function to add new list
saveListBtn.addEventListener('click', () => {
    const newListTitle = newListInput.value.trim();
    if (newListTitle) {
        lists.push({ title: newListTitle, items: [] });
        localStorage.setItem('lists', JSON.stringify(lists));
        newListInput.value = '';
        renderListSelector();
        // Hide the modal
        const modal = document.getElementById('addListModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    }
});

listSelector.addEventListener('change', renderList);

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
