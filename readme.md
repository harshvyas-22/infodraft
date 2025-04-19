# InfoDraft

InfoDraft is a document management and editing application that allows users to create, edit, and manage documents seamlessly. It features a rich text editor, user authentication, and document storage using MongoDB Atlas.

---

## Features

- **User Authentication**: Secure login and signup functionality.
- **Rich Text Editor**: Create and edit documents with a feature-rich text editor.
- **Document Management**: View, search, and manage all your documents.
- **Cloud Storage**: Documents are stored securely in MongoDB Atlas.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## Tech Stack

### Frontend:

- **React.js**: For building the user interface.
- **Tailwind CSS**: For styling the application.
- **React Router**: For navigation between pages.
- **Jodit Pro**: For the rich text editor.

### Backend:

- **Node.js**: For building the server-side logic.
- **Express.js**: For handling API routes.
- **Mongoose**: For interacting with MongoDB.

### Database:

- **MongoDB Atlas**: Cloud-based NoSQL database for storing user and document data.

### Other Tools:

- **dotenv**: For managing environment variables.
- **bcryptjs**: For hashing passwords.
- **jsonwebtoken**: For user authentication.
- **CORS**: For handling cross-origin requests.

---

## How It Works

1. **User Authentication**:

   - Users can sign up with their email, username, and password.
   - Login functionality ensures secure access to the application.

2. **Document Creation**:

   - Users can create new documents by providing a title.
   - The document content can be edited using the rich text editor.

3. **Document Management**:

   - All documents are listed on the homepage.
   - Users can search for documents by title, and the results are displayed in alphabetical order.

4. **Cloud Storage**:
   - All documents and user data are stored securely in MongoDB Atlas.

---

## Installation and Setup

### Prerequisites:

- Node.js installed on your system.
- MongoDB Atlas account for database setup.

### Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/infodraft.git
   cd infodraft
   ```
