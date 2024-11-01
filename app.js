// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const editorRef = doc(db, "documents", "collaborativeEditor");

const editor = document.getElementById("text-editor");

// Listen for real-time updates
onSnapshot(editorRef, (doc) => {
    const data = doc.data();
    if (data) {
        editor.innerHTML = data.content;
    }
});

// Save content on change
editor.addEventListener("input", async () => {
    await setDoc(editorRef, { content: editor.innerHTML });
});
// Placeholder function for user tracking
function updateUserList(users) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    users.forEach((user) => {
        const userItem = document.createElement("li");
        userItem.textContent = `${user.name} is editing`;
        userList.appendChild(userItem);
    });
}
let undoStack = [];
let redoStack = [];

editor.addEventListener("input", () => {
    undoStack.push(editor.innerHTML);
    redoStack = []; // Clear redo stack on new input
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === 'z') {
        // Undo
        if (undoStack.length > 0) {
            redoStack.push(undoStack.pop());
            editor.innerHTML = undoStack[undoStack.length - 1] || "";
        }
    } else if (e.ctrlKey && e.key === 'y') {
        // Redo
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            editor.innerHTML = undoStack[undoStack.length - 1];
        }
    }
});
editor.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const comment = prompt("Add a comment:");
        if (comment) {
            const commentElement = document.createElement("div");
            commentElement.textContent = `Comment on "${selectedText}": ${comment}`;
            document.getElementById("comments-section").appendChild(commentElement);
        }
    }
});