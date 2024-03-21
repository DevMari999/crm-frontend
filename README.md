# CRM Project Frontend

## Overview

This CRM Project Frontend is a React-based application designed for managing customer relationships. It provides tools
for tracking customer interactions, managing customer data, and analyzing business metrics.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. Download and install it
  from [Node.js official website](https://nodejs.org/).

## Setup and Installation

### 1. Clone the Repository

First, you need to clone the repository to your local machine. Open a terminal (Command Prompt or PowerShell in Windows,
Terminal in macOS and Linux) and run the following command:

```bash
git clone https://github.com/DevMari999/crm-frontend
```

### 2. Navigate to the Project Directory

After cloning, move into the project directory with:

```bash
cd crm_project_frontend
```

### 3. Install Dependencies

Inside the project directory, run the following command to install the necessary dependencies:

```bash
npm install
```

This command will read the `package.json` file and install all the required Node.js packages listed under `dependencies`
and `devDependencies`.

## Running the Application

### Starting the Development Server

To start the application in development mode, run:

```bash
npm start
```

This command will start the React development server and open the application in your default web browser. If it doesn't
open automatically, you can manually navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build of the application, use:

```bash
npm run build
```

This will compile the React application into static files placed in the `build` directory, optimized for performance.

## Testing the Application

To run the automated tests, execute:

```bash
npm test
```

This will start the test runner and execute the tests defined in the project, displaying the results in the terminal.

## Common Issues

- **Node.js Not Installed**: Make sure Node.js is installed and properly configured in your system’s PATH.
- **Dependencies Not Installed**: Ensure all dependencies are installed correctly. If you encounter errors during
  installation, try running `npm install` again or use `npm ci` for a clean install.
- **Port 3000 Already in Use**: The application defaults to port 3000. If you have another service running on that port,
  you will need to close it or configure the application to use a different port.

