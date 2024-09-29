// Initialize lists container
const listsContainer = document.getElementById('lists-container');

// Initialize new list input and button
const newListInput = document.getElementById('new-list-input');
const addListBtn = document.getElementById('add-list-btn');

// Load lists from local storage
let lists = JSON.parse(localStorage.getItem('lists')) || [];

// Function to render lists
function renderLists() {
    listsContainer.innerHTML = '';
    lists.forEach((list, index) => {
        const listHtml = `
            <div class="card mt-3">
                <div class="card-header">
                    <h5>${list.title}</h5>
                    <button class="btn btn-danger float-end" onclick="deleteList(${index})">Delete List</button>
                </div>
                <div class="card-body">
                    <ul id="list-${index}" class="list-group">
                        ${list.items.map((item, itemIndex) => `
                            <li class="list-group-item">
                                ${item}
                                <button class="btn btn-danger float-end" onclick="deleteItem(${index}, ${itemIndex})">Delete</button>
                                <button class="btn btn-primary float-end me-2" onclick="moveUp(${index}, ${itemIndex})">Up</button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="card-footer">
                    <input type="text" id="new-item-input-${index}" class="form-control" placeholder="Enter new item">
                    <button class="btn btn-primary" onclick="addItem(${index})">Add Item</button>
                </div>
            </div>
        `;
        listsContainer.insertAdjacentHTML('beforeend', listHtml);
    });
}

// Function to add new list
addListBtn.addEventListener('click', () => {
    const newListTitle = newListInput.value.trim();
    if (newListTitle) {
        lists.push({ title: newListTitle, items: [] });
        localStorage.setItem('lists', JSON.stringify(lists));
        newListInput.value = '';
        renderLists();
    }
});

// Function to delete list
function deleteList(index) {
    lists.splice(index, 1);
    localStorage.setItem('lists', JSON.stringify(lists));
    renderLists();
}

// Function to add item to list
function addItem(listIndex) {
    const newItemInput = document.getElementById(`new-item-input-${listIndex}`);
    const newItem = newItemInput.value.trim();
    if (newItem) {
        lists[listIndex].items.push(newItem);
        localStorage.setItem('lists', JSON.stringify(lists));
        newItemInput.value = '';
        renderLists();
    }
}

// Function to delete item from list
function deleteItem(listIndex, itemIndex) {
    lists[listIndex].items.splice(itemIndex, 1);
    localStorage.setItem('lists', JSON.stringify(lists));
    renderLists();
}

// Function to move item up
function moveUp(listIndex, itemIndex) {
    if (itemIndex > 0) {
        const item = lists[listIndex].items.splice(itemIndex, 1)[0];
        lists[listIndex].items.splice(itemIndex - 1, 0, item);
        localStorage.setItem('lists', JSON.stringify(lists));
        renderLists();
    }
}

// Initial render
renderLists();
