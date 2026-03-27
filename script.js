const apiURL = 'http://localhost:5000/todos';
const todoList = document.getElementById('todo-list');
const newTodoForm = document.getElementById('new-todo-form');
const newTodoInput = document.getElementById('new-todo-input');

// Function to fetch and display todos
async function fetchTodos() {
	const response = await fetch(apiURL);
	const todos = await response.json();
	todoList.innerHTML = '';
	todos.forEach(todo => addTodoToDOM(todo));
}
// Function to add a single todo item to the DOM
function addTodoToDOM(todo) {
	const li = document.createElement('li');
	li.className = "list-group-item d-flex justify-content-between align-items-center";

	const span = document.createElement('span');
	span.textContent = todo.task;

	if (todo.completed) {
		span.classList.add("text-decoration-line-through", "text-muted");
	}

	const btnGroup = document.createElement('div');
	btnGroup.className = "btn-group btn-group-sm";

	const doneBtn = document.createElement('button');
	doneBtn.className = "btn btn-success";
	doneBtn.textContent = "Done";
	doneBtn.onclick = () => toggleTodoState(todo.id, todo.task, todo.completed);

	const deleteBtn = document.createElement('button');
	deleteBtn.className = "btn btn-danger";
	deleteBtn.textContent = "Delete";
	deleteBtn.onclick = () => deleteTodo(todo.id);

;

	const renameBtn = document.createElement('button');
	renameBtn.className = "btn btn-warning";
	renameBtn.textContent = "Rename";
	renameBtn.onclick = () => renameTodo(todo.id, todo.task, todo.completed);
	
	btnGroup.append(doneBtn, renameBtn, deleteBtn);
	li.append(span, btnGroup)
	todoList.appendChild(li);
}//not a fan of bootstrap, its very overkill for this application
// Function to handle new todo form submission (POST request)
newTodoForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const newTask = newTodoInput.value;
	const newTodo = { task: newTask, completed: false };
	await fetch(apiURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(newTodo),
	});
	newTodoInput.value = '';
	fetchTodos(); // Refresh the list
});

async function toggleTodoState(id, task, value) {
	editTodo(id, task, value ? false : true); //make things easier for now

}
async function renameTodo(id, task, value) {
	name = prompt("What to rename it to?", task);
	editTodo(id, name, value)
}
//function to actually edit a todo (PUT/PATCH request)

async function editTodo(id, name, isDone) {
	updatedTodo = { task: name, completed: isDone};
	await fetch(`${apiURL}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json' //its a json!
		},
		body: JSON.stringify(updatedTodo)
	});
	fetchTodos();
}
// Function to delete a todo (DELETE request)
async function deleteTodo(id) {
	await fetch(`${apiURL}/${id}`, {
		method: 'DELETE',
	});
	fetchTodos(); // Refresh the list
}
// Initial fetch when the page loads
fetchTodos();
