let users = JSON.parse(localStorage.getItem("users")) || [
    {id: 1, name: "Alice", email:"alice@example.com", role:"admin", isActive: true},
    {id: 2, name: "Bob", email:"bob@example.com", role:"user", isActive: false},
    {id: 3, name: "Charlie", email:"charlie@example.com", role:"user", isActive: true},
    {id: 4, name: "David", email:"david@example.com", role:"guest", isActive: false}
];

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function displayUsers(useArray) {
    const userList = document.getElementById("userList");
    userList.style.display = "block";

    userList.innerHTML = useArray
        .map(user =>
            `<div>
                ID: ${user.id} | Name: ${user.name} | Email: ${user.email} |
                Role: ${user.role} | Status: ${user.isActive}
            </div>`
        )
        .join("");
}

function fetchUsersFromAPI() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true; // simulate success always, can change to false to test error handling

            if (success) {
                resolve([...users]);
            } else {
                reject("Server error");
            }
        }, 1500);
    });
}

function loadUsersAsync() {
    fetchUsersFromAPI()
        .then((data) => {
            displayUsers(data);
        })
        .catch((error) => {
            alert(error);
        })
        .finally(() => {
            console.log("Fetch completed");
        });
}


function filterByRole(role) {
    const filteredUsers = users.filter(user => user.role === role);
    displayUsers(filteredUsers);
    const radioList = document.querySelector(".radioList");
}

const filterButton = document.getElementById("filterbtn");
filterButton.addEventListener("click", () => {
    const radioList = document.querySelector(".radioList");
    radioList.style.display = "block";
});

function getNextUserId() {
    if (users.length === 0) return 1;

    const maxId = Math.max(...users.map(user => user.id));
    return maxId + 1;
}


function addUser(name, email, role, isActive) {
    const newUser = {
        id: getNextUserId(),
        name: name,
        email: email,
        role: role,
        isActive: isActive
    };
    users = [...users, newUser];
    saveUsers();
    loadUsersAsync();
}

function submitUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const isActive = document.getElementById("isActive").checked;

    if(!name || !email || !role) {
        alert("Please fill in all fields.");
        return;
    }

    addUser(name, email, role, isActive);

    // Optional: clear form
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    document.getElementById("isActive").checked = false;

    const form=document.getElementById("addUserForm");
    form.style.display = "none";
}

function deleteUser(id) {
    id = Number(id);

    if (isNaN(id)) {
        alert("Invalid user ID");
        return;
    }

    const userExists = users.some(user => user.id === id);
    if (!userExists) {
        alert("User not found");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    users = users.filter(user => user.id !== id);
    saveUsers();
    loadUsersAsync();
}

function ActiveUsers() {
    const activeUsers = users.filter(user => user.isActive === true);
    displayUsers(activeUsers);
}

function changeStatus(id) {
    id = Number(id);
    if (isNaN(id)) {
        alert("Invalid user ID");
        return;
    }

    const user = users.find(user => user.id === id);
    if (!user) {
        alert("User not found");
        return;
    }
    user.isActive = !user.isActive;
    saveUsers();
    loadUsersAsync();    
}

function hideAddUserForm() {
    const form = document.getElementById("addUserForm");
    form.style.display = "none";
}

function hideFilterOptions() {
    const rl = document.querySelector(".radioList");
    rl.style.display = "none";
}

function hideActiveUsers() {
    const userList = document.getElementById("userList");
    userList.style.display = "none";
}

function eventLoopDemo() {
    // Synchronous code runs first (Call Stack)
    console.log("Synchronous start");

    // setTimeout callback is sent to the Macrotask (Task) Queue
    // Even with 0ms delay, it will NOT run immediately after the synchronous code
    setTimeout(() => {
        console.log("setTimeout callback");
    }, 0);

    // Promise.then() is sent to the Microtask Queue
    // Microtasks have higher priority than setTimeout callbacks
    Promise.resolve().then(() => {
        console.log("Promise then callback");
    });

    // This is still synchronous code, so it runs immediately
    console.log("Synchronous end");
}
eventLoopDemo();
