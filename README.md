# FreeDev: A Social Network for Developers

FreeDev is an open-source social platform designed for developers to connect, collaborate, and share knowledge.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.8 or higher**
- **Django 5.1**
- **Strawberry-Django for GraphQL integration**

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/j03-dev/freedev.git
cd freedev
```

### 2. Set Up a Virtual Environment

Create and activate a virtual environment to manage dependencies.

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies

Ensure you have the required packages installed.

```bash
pip install -r requirements.txt
```

### 4. Apply Migrations

Set up the database by applying migrations.

```bash
python graphql/manage.py migrate
```

### 6. Run the Development Server

Start the server to see the application in action.

```bash
python graphql/manage.py runserver
```

Access the application at `http://localhost:8000/`.

## GraphQL Endpoint

Interact with the GraphQL API at `http://localhost:8000/graphql`. For more information on using GraphQL with Django, refer to the [Strawberry-Django documentation](https://strawberry.rocks/docs/django).

## Contributing

We welcome contributions from the developer community. To get involved:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgements

FreeDev was inspired by the need for an open platform where developers can freely collaborate and innovate without restrictions.
