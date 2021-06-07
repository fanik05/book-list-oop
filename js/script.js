// Get the ui elements
const form = document.getElementById("book_form");
const title = document.getElementById("title");
const author = document.getElementById("author");
const isbn = document.getElementById("isbn");
const container = document.getElementsByClassName("container")[0];
const bookList = document.getElementById("book_list");

// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class
class UI {
    static addToBookList(book) {
        const list = document.getElementById("book_list");
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>`;
        list.appendChild(row);
    }

    static clearFields() {
        title.value = "";
        author.value = "";
        isbn.value = "";
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, form);

        setTimeout(() => document.getElementsByClassName("alert")[0].remove(), 3000);
    }

    static deleteFromBook(target) {
        if (target.hasAttribute("href")) {
            target.parentElement.parentElement.remove();
            Store.removeBook(target.parentElement.previousElementSibling.textContent.trim());
            UI.showAlert("Book Removed!", "success");
        }
    }
}

// Store books to LS
class Store {
    static getBooks() {
        let books;

        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addToBookList(book));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Add event listener   
form.addEventListener("submit", newBook);
bookList.addEventListener("click", removeBook);
document.addEventListener("DOMContentLoaded", Store.displayBooks());

// Define functions
function newBook(e) {
    if (title.value === "" || author.value === "" || isbn.value === "") {
        ui.showAlert("Please fill all the fields!", "error");
    } else {
        const book = new Book(title.value, author.value, isbn.value);

        UI.addToBookList(book);
        UI.clearFields();
        UI.showAlert("Book Added!", "success");
        Store.addBook(book);
    }

    e.preventDefault();
}

function removeBook(e) {
    UI.deleteFromBook(e.target);

    e.preventDefault();
}