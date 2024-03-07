var addSubtaskButton = document.getElementById("addSubtaskButton");
addSubtaskButton.addEventListener("click", createSubtaskTextBox);
var addTaskButton = document.getElementById("addTaskButton");
addTaskButton.addEventListener("click", addTask);
addTaskButton.addEventListener("click", clearModal);
var undoButton = document.getElementById("undoButton");
undoButton.style.display = 'none';
undoButton.addEventListener("click", undo);
addSampleTask();

var stateSaved = false;
var hiddenElement;

/* Restore last deleted/hidden element */
function undo() {
	if (stateSaved) {
		hiddenElement.style.display = 'block';
		stateSaved = false;
		undoButton.style.display = 'none';
	}
}

/* Hide element, allows for undo via undo(). Deletes previous save */
function saveState(elem) {
	if (stateSaved) {
		hiddenElement.remove();
	}
	hiddenElement = elem;
	elem.style.display = 'none';
	stateSaved = true;
	undoButton.style.display = 'block';
}

/* Create subtask textareas for new task entry */
function createSubtaskTextBox() {
	/* create container, new textarea for subtask info entry */
    var textBox = document.createElement("textarea");
    textBox.classList.add("newSubtask", "form-control");
	textBox.placeholder = "New subtask";
	/* add delete button for subtasks */
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
	deleteButton.classList.add("btn", "btn-outline-dark", "delButton");
    deleteButton.addEventListener("click", function() {
        var container = this.parentElement;
        container.parentNode.removeChild(container);
    });
	/* append to container */
    var container = document.createElement("div");
	container.classList.add("subtaskEntry");
    container.appendChild(textBox);
    container.appendChild(deleteButton);
	/* append to new Task modal */
    var newSubtasksDiv = document.getElementById("newSubtasks");
    newSubtasksDiv.appendChild(container);
}

/* Add task using selected / given information */
function addTask() {
	/* get selected priority, create container */
	var selectedPriority = document.getElementById("prioritySelect").value;
	var container = document.createElement("div");
	container.classList.add("container", selectedPriority + "Task", "taskBox");
	var newTask = document.createElement("li");
	newTask.classList.add("list-group-item", "primaryTask");
	var taskDetails = document.getElementById("enterNewTask").value;
	/* get date, append to front if task details */
    var date = document.getElementById("dueDate").value;
    if (date) {
        taskDetails = "Due Date: " + date + "<br>" + taskDetails;
    }
	/* create and append options button*/
    newTask.innerHTML = taskDetails;
	var optionsButton = createOptionsButton(selectedPriority);
	newTask.appendChild(optionsButton);
	//var br = document.createElement("br");
	//newTask.appendChild(br);
	/* create container for subtask list */
	var subTaskContainer = document.createElement("div");
	subTaskContainer.classList.add("container", selectedPriority + "SubTask")
	var subTasksList = document.createElement("ul");
	subTasksList.classList.add("list-group-item");
	//var br = document.createElement("br");
	//subTaskContainer.appendChild(br);
	/* collect subtasks, create list and append */
	var enteredSubtasks = document.querySelectorAll(".newSubtask");
	enteredSubtasks.forEach((enteredSubtasks) => {
		var subDiv = document.createElement("div");
		subDiv.classList.add("subtask", "list-group-item");
		var newSubtaskListItem = document.createElement("li");
		newSubtaskListItem.textContent = enteredSubtasks.value;
		subDiv.append(newSubtaskListItem);
		var subtaskOptions = createSubOptionsButton(selectedPriority);
		newSubtaskListItem.appendChild(subtaskOptions);
		//var br = document.createElement("br");
		//subDiv.appendChild(br);
		subTaskContainer.appendChild(subDiv);
	});
	newTask.appendChild(subTaskContainer);
	container.appendChild(newTask);
	/* append complete container to respective division based on priority */
	if (selectedPriority == "urgent") {
		document.querySelector(".urgentTaskList").appendChild(container);
	} else if (selectedPriority == "important") {
		document.querySelector(".importantTaskList").appendChild(container);
	} else {
		document.querySelector(".regularTaskList").appendChild(container);
	}
}	

/* Creates option button to mark completed / delete main task */
function createOptionsButton(priorityLabel) {
	/* create button, dropdown options */
	var optionsDiv = document.createElement("div");
	optionsDiv.classList.add("btn-group", "dropstart", "float-end", priorityLabel + "TaskButton");
	var optionsButton = document.createElement("button");
	optionsButton.classList.add("btn", "btn-outline-secondary", "dropdown-toggle", "float-end", "btn-sm");
	optionsButton.type = "button";
	optionsButton.setAttribute("data-bs-toggle", "dropdown");
	optionsButton.setAttribute("data-bs-display", "static");
	optionsButton.setAttribute("aria-expanded", "false");
	optionsButton.textContent = "Options";
	var dropdown = document.createElement("ul");
	dropdown.classList.add("dropdown-menu", "dropdown-menu-end", "dropdown-menu-sm-end");
	/* define options, attributes on button */
	var options = [
		{ text: "Completed", href: "#", action: completeTask, action2: addToastComplete },
		{ text: "Remove", href: "#", action: deleteTask, action2: addToastDelete }
	];
	/* for each option, add attributes */
	options.forEach(function (op) {
		var liElement = document.createElement("li");
		var aElement = document.createElement("a");
		aElement.classList.add("dropdown-item");
		aElement.href = op.href;
		aElement.textContent = op.text;
		aElement.addEventListener("click", function(event) {
			op.action();
		});
		aElement.addEventListener("click", function(event) {
			op.action2();
		});
		liElement.appendChild(aElement);
		dropdown.appendChild(liElement);
	});
	/* append button to list item */
	optionsDiv.appendChild(optionsButton);
	optionsDiv.appendChild(dropdown);
	return optionsDiv;
}

/* Creates option button to mark completed / delete subtask */
function createSubOptionsButton(priorityLabel) {
	/* create button, dropdown options */
	var optionsDiv = document.createElement("div");
	optionsDiv.classList.add("btn-group", "dropstart", "float-end", priorityLabel + "SubtaskButton");
	var optionsButton = document.createElement("button");
	optionsButton.classList.add("btn", "btn-outline-secondary", "dropdown-toggle", "float-end", "btn-sm");
	optionsButton.type = "button";
	optionsButton.setAttribute("data-bs-toggle", "dropdown");
	optionsButton.setAttribute("data-bs-display", "static");
	optionsButton.setAttribute("aria-expanded", "false");
	optionsButton.textContent = "Options";
	var dropdown = document.createElement("ul");
	dropdown.classList.add("dropdown-menu", "dropdown-menu-end", "dropdown-menu-sm-end");
	/* define options, attributes on button */
	var options = [
		{ text: "Completed", href: "#", action: completeSubTask, action2: addToastComplete },
		{ text: "Remove", href: "#", action: deleteSubTask, action2: addToastDelete }
	];
	/* for each option, add attributes */
	options.forEach(function (op) {
		var liElement = document.createElement("li");
		var aElement = document.createElement("a");
		aElement.classList.add("dropdown-item");
		aElement.href = op.href;
		aElement.textContent = op.text;
		aElement.addEventListener("click", function(event) {
			op.action();
		});
		aElement.addEventListener("click", function(event) {
			op.action2();
		});
		liElement.appendChild(aElement);
		dropdown.appendChild(liElement);
	});
	/* append button to list item */
	optionsDiv.appendChild(optionsButton);
	optionsDiv.appendChild(dropdown);
	return optionsDiv;
}

/* Clear input modal after submitting info, task creation */
function clearModal() {
    var newSubtasksDiv = document.getElementById("newSubtasks");
    while (newSubtasksDiv.firstChild) {
        newSubtasksDiv.removeChild(newSubtasksDiv.firstChild);
    }
	document.getElementById("enterNewTask").value = "";
	document.getElementById("prioritySelect").value = "regular";
	document.getElementById("dueDate").value = "";
}

/* Mark main task completion*/
function completeTask() {
    var listItem = event.target.closest("li");
    var optionsDiv = event.target.closest(".list-group-item");
	saveState(optionsDiv);
}

/* Mark subtask completion*/
function completeSubTask() {
	var listItem = event.target.closest("li");
    var optionsDiv = event.target.closest(".subtask");
	saveState(optionsDiv);
}

/* Mark main task deletion*/
function deleteTask() {
	var listItem = event.target.closest("li");
    var optionsDiv = event.target.closest(".list-group-item");
	saveState(optionsDiv);
}

/* Mark subtask deletion*/
function deleteSubTask() {
	var listItem = event.target.closest("li");
    var optionsDiv = event.target.closest(".subtask");
	saveState(optionsDiv);
}

const toastComplete = document.getElementById('completedToast');
const toastCompleteBootstrap = bootstrap.Toast.getOrCreateInstance(toastComplete);
const toastDelete = document.getElementById('deletedToast');
const toastDeleteBootstrap = bootstrap.Toast.getOrCreateInstance(toastDelete);

function addToastComplete() {
	toastCompleteBootstrap.show();
}

function addToastDelete() {
	toastDeleteBootstrap.show();
}

/* Add sample task to page */
function addSampleTask() {
	var selectedPriority = "regular"; /* Sample task priority */
	var container = document.createElement("div");
	container.classList.add("container", selectedPriority + "Task", "taskBox");
	var newTask = document.createElement("li");
	newTask.classList.add("list-group-item", "primaryTask");
	var taskDetails = 'This is a sample task. Press the "Add New Task" button to get started.'; /* Sample task details */
    newTask.innerHTML = taskDetails;
	var optionsButton = createOptionsButton(selectedPriority);
	newTask.appendChild(optionsButton);
	var subTaskContainer = document.createElement("div");
	subTaskContainer.classList.add("container", selectedPriority + "SubTask")
	var subTasksList = document.createElement("ul");
	subTasksList.classList.add("list-group-item");
	var subDiv = document.createElement("div");
	subDiv.classList.add("subtask", "list-group-item");
	var newSubtaskListItem = document.createElement("li");
	newSubtaskListItem.textContent = "You can remove tasks and subtasks with the options button."; /* Sample subtask details*/
	subDiv.append(newSubtaskListItem);
	var subtaskOptions = createSubOptionsButton(selectedPriority);
	newSubtaskListItem.appendChild(subtaskOptions);
	subTaskContainer.appendChild(subDiv);
	newTask.appendChild(subTaskContainer);
	container.appendChild(newTask);
	document.querySelector(".regularTaskList").appendChild(container); /* Append to regular list */
}	