# React DataGrid 
This project is a functional, lightweight DataGrid built entirely using vanilla React (functional components and hooks) with no third-party libraries. It mimics core spreadsheet behaviors, including editing, selection, and clipboard operations.

# Features
Editable Cells: Click to edit, Enter/Blur to save, Esc to cancel.

Dynamic Structure: Buttons to dynamically add new rows and columns.

Mouse Drag Selection: Click and drag to select a rectangular range of cells.

Clipboard Support:

- Ctrl+C / Cmd+C: Copies the selected range to the system clipboard (TSV format).

- Ctrl+V / Cmd+V: Pastes data from the clipboard, automatically parsing external data (like from Excel or Google Sheets).

- Auto-Expansion: The grid dynamically adds rows and columns if the pasted data would overflow the current dimensions.

- Keyboard Navigation: Arrow keys move the active cell/selection.

Persistence: Grid state is automatically saved to and loaded from localStorage.

# 🛠️ Setup and Installation
To run this project locally, follow these steps:

Clone the repository:

#Bash

git clone [your-repo-url]
cd datagrid-project
Install dependencies:

Bash

npm install
# or
yarn install
Start the development server:

Bash

npm start
# or
yarn start
The application should open in your browser at http://localhost:3000.
