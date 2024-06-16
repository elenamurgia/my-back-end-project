# Northcoders News API

Welcome to the Northcoders News API! This API is designed to facilitate programmatic access to application data, simulating the backend of a real-world service like Reddit. This backend service supports the frontend architecture by providing the necessary information.

## Live API Endpoint

Access the live version of the Northcoders News API [here](https://nc-northcoders-news-api.onrender.com).

## Contributing to the Repository

To contribute to this project, please follow these steps:

### 1. Fork the Repository

- Navigate to the `elenamurgia/Northcoders-News-API` repository on GitHub.
- Click the **Fork** button in the upper-right corner of the page.
- Select the owner for your forked repository from the dropdown menu.
- Click **Create fork**.

### 2. Clone Your Fork Locally

- Go to your forked version of the Northcoders-News-API on GitHub.
- Click the **Code** button above the list of files.
- Copy the repository URL.
- Open your terminal and change the current directory to where you want the repository to be cloned.
- Run the command: `git clone <repository_url>` and press Enter to clone the repository.

### 3. Install Dependencies

- Open the repository in Visual Studio Code (VS Code).
- In the terminal, navigate to the project directory and run:
  ```sh
  npm install
  ```

### 4. Setup Environment Variables

- Create the following files at the root level of the project:
  `.env.test` with `PGDATABASE=nc_news_test`
  `.env.development` with `PGDATABASE=nc_news_development`

### 5. Seed the Database

- Run the following commands in your terminal to set up and seed the database:

```sh
npm run setup-dbs
npm run seed
```

### 6. Running Tests

- To run tests, use the following commands:

```sh
npm run test utils.test.js # To run utility tests
npm run test app.test.js # To run application tests
npm run test # To run all tests
```

### Requirements

- **Node.js**: Version >= 27.2.5
- **Postgres**: Version >= 8.0

For further assistance or if you encounter any issues, please refer to the documentation or reach out to me. Happy coding!
