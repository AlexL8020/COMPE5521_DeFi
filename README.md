# Setup Instructions

This document outlines the steps to set up the blockchain, backend server, and related components for the project.

## 1. Blockchain Setup

1.  Navigate to the blockchain directory:

    ```bash
    cd <the-proj-root>/Blockchain
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the Hardhat local node:

    ```bash
    npx hardhat node
    ```

4.  Configure the private key:

    *   Copy an account address (e.g., `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`) from the Hardhat node output.
    *   Set the `PRIVATE_KEY` environment variable in the `.env` file to this address.

5.  Deploy contracts:

    ```bash
    npx hardhat run scripts/deploy.ts --network localhost
    ```

    This command deploys the contracts to the running local network.

## 2. Backend Server and Database Setup

This section details setting up the Node.js backend server and MongoDB for managing off-chain data. You can choose either Docker-based setup or manual setup.

**Before proceeding, create a `.env` file in the `BE` directory based on the `.env.example` file and configure the necessary environment variables.**

### 2a) Docker-Based Setup (Recommended)

1.  Navigate to the project root directory:

    ```bash
    cd <the-proj-root>
    ```

2.  Start the Docker containers:

    ```bash
    docker-compose up --build
    ```

    This command builds the Docker images and starts the containers for the backend server and MongoDB.

### 2b) Manual Setup

1.  Ensure you have a local MongoDB instance running.

2.  Navigate to the backend directory:

    ```bash
    cd <the-proj-root>/BE
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Start the backend server using one of the following methods:

    *   Using `npm`:

        ```bash
        npm run dev:tsnode
        ```

    *   Using `nodemon` directly:

        ```bash
        npx nodemon src/server.ts
        ```

## 3. Frontend Setup

*(Note: The instructions are incomplete. Fill in the correct directory)*

**Before proceeding, create a `.env` file in the frontend directory based on the `.env.example` file and configure the necessary environment variables.**

1.  Navigate to the frontend directory

    ```bash
    cd <the-proj-root>/FE   #  replace FE with correct frontend directory
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm run dev
    ```
