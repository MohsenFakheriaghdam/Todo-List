document.addEventListener("DOMContentLoaded", () => {
	/* =========================
	   Mobile Menu
	========================= */

	const hamburgerBtn = document.querySelector(".header__menu-btn");
	const mobileMenu = document.getElementById("mobileMenu");
	const overlay = document.getElementById("overlay");

	if (!hamburgerBtn || !mobileMenu || !overlay) return;

	const openMenu = () => {
		mobileMenu.classList.remove("-translate-x-full");
		mobileMenu.classList.add("translate-x-0");

		overlay.classList.remove("opacity-0", "pointer-events-none");
		overlay.classList.add("opacity-100", "pointer-events-auto");
	};

	const closeMenu = () => {
		mobileMenu.classList.add("-translate-x-full");
		mobileMenu.classList.remove("translate-x-0");

		overlay.classList.add("opacity-0", "pointer-events-none");
		overlay.classList.remove("opacity-100", "pointer-events-auto");
	};

	hamburgerBtn.addEventListener("click", openMenu);
	overlay.addEventListener("click", closeMenu);

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeMenu();
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth >= 769) closeMenu();
	});

	const button = document.getElementById("categoryBtn");
	const content = document.getElementById("content");
	const arrow = document.getElementById("arrow");

	button?.addEventListener("click", () => {
		content.classList.toggle("max-h-80");
		content.classList.toggle("max-h-0");
		content.classList.toggle("mt-5");
		arrow.classList.toggle("rotate-180");
	});
});

/* =========================
   Todo App
========================= */

const inputTodo = document.getElementById("todoInput");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");

let todos = loadFromLocalStorage();
let editingId = null;
let currentFilter = "all";

renderTodos();

todoForm.addEventListener("submit", addNewTodo);

function addNewTodo(event) {
	event.preventDefault();

	if (!inputTodo.value.trim()) return;

	todos.push({
		id: Date.now(),
		title: inputTodo.value,
		createdAt: new Date().toISOString(),
		isCompleted: false,
	});

	inputTodo.value = "";

	saveToLocalStorage();
	renderTodos(currentFilter);
}

function renderTodos(filter = "all") {
	let result = "";

	const filteredTodos = todos.filter((todo) => {
		if (filter === "all") return true;
		if (filter === "done") return todo.isCompleted;
		if (filter === "not-done") return !todo.isCompleted;
	});

	filteredTodos.forEach((todo) => {
		result += `
		<div class="neu-primary flex items-center w-4/5 gap-2 h-24 rounded-md px-3 py-3 lg:w-1/2">
			
			<div class="flex-center">
				<input
					type="checkbox"
					class="check-todo size-5 accent-sky-700"
					data-id="${todo.id}"
					${todo.isCompleted ? "checked" : ""}
				/>
			</div>

			<div class="w-full">
				<div class="flex items-center justify-between">
					<div class="w-full flex flex-col gap-0.5 overflow-hidden">

						${
							editingId === todo.id
								? `<input
									class="edit-input w-full rounded-md border px-2 py-1"
									value="${todo.title}"
									data-id="${todo.id}"
								/>`
								: `<h2 class="text-lg font-bold text-gray-800">${todo.title}</h2>`
						}

						<div class="h-0.5 bg-linear-to-r from-gray-300 to-[#e6e7ee]"></div>
						<span class="text-sm font-bold text-gray-500">
							${new Date(todo.createdAt).toLocaleDateString()}
						</span>
					</div>

					<div class="flex-center gap-4">
						<button class="edit-btn" data-id="${todo.id}">
							<i class="fa-solid fa-pen text-sky-700"></i>
						</button>

						<button class="delete-btn" data-id="${todo.id}">
							<i class="fa-solid fa-trash text-red-600"></i>
						</button>
					</div>

				</div>
			</div>
		</div>`;
	});

	todoList.innerHTML = result;
}

function saveEdit(input) {
	const id = Number(input.dataset.id);
	const todo = todos.find((t) => t.id === id);

	if (!todo) return;

	const value = input.value.trim();
	if (value) todo.title = value;

	editingId = null;

	saveToLocalStorage();
	renderTodos(currentFilter);
}

function saveToLocalStorage() {
	localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFromLocalStorage() {
	const data = localStorage.getItem("todos");
	return data ? JSON.parse(data) : [];
}

/* =========================
   Events (Delegation)
========================= */

todoList.addEventListener("change", (e) => {
	if (!e.target.classList.contains("check-todo")) return;

	const id = Number(e.target.dataset.id);
	const todo = todos.find((t) => t.id === id);

	if (!todo) return;

	todo.isCompleted = e.target.checked;

	saveToLocalStorage();
	renderTodos(currentFilter);
});

todoList.addEventListener("click", (e) => {
	const deleteBtn = e.target.closest(".delete-btn");
	if (deleteBtn) {
		const id = Number(deleteBtn.dataset.id);

		todos = todos.filter((t) => t.id !== id);

		saveToLocalStorage();
		renderTodos(currentFilter);
		return;
	}

	const editBtn = e.target.closest(".edit-btn");
	if (editBtn) {
		editingId = Number(editBtn.dataset.id);
		renderTodos(currentFilter);
	}
});

todoList.addEventListener("keydown", (e) => {
	if (!e.target.classList.contains("edit-input")) return;

	if (e.key === "Enter") saveEdit(e.target);
});

todoList.addEventListener(
	"blur",
	(e) => {
		if (!e.target.classList.contains("edit-input")) return;

		saveEdit(e.target);
	},
	true,
);

/* =========================
   Filters
========================= */

document.getElementById("allFilter").onclick = () => {
	currentFilter = "all";
	renderTodos(currentFilter);
};

document.getElementById("doneFilter").onclick = () => {
	currentFilter = "done";
	renderTodos(currentFilter);
};

document.getElementById("notDoneFilter").onclick = () => {
	currentFilter = "not-done";
	renderTodos(currentFilter);
};
