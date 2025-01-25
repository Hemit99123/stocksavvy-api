# 🚀 StockSavvy API

**Overview:** The StockSavvy API powers the backend of the StockSavvy web platform, developed with ReactJS and TypeScript using the ViteJS buildpack.

## 💻 Technologies Used:

### - Drizzle ORM
Drizzle serves as both an ORM and a query builder, providing a mid-level abstraction from SQL code for improved performance. Developers are expected to have SQL knowledge, which is considered a fair trade-off by the developer, Hemit Patel

### - NodeJS with TSC
NodeJS is a runtime environment for JavaScript, enabling server-side execution of JavaScript code. This allows for a unified programming language across the web app and API, enhancing developer experience. Its asynchronous features and promise-based structure add to its appeal. TSC is the TypeScript compiler for NodeJS, as TypeScript is not natively supported.

### - Redis Clusters
Redis is an in-memory database, storing data in RAM for faster access compared to traditional databases like SQL or NoSQL (e.g., MongoDB, Cassandra). However, this also means it is susceptible to data loss on server shutdown, making it suitable for ephemeral data like sessions and verification codes. Clusters enable horizontal sharding, improving scalability, especially for session-based authentication. Refer to this [YouTube Video](https://www.youtube.com/watch?v=2HvxYMdHYcY) for more information.

### - Express Sessions
This technology abstracts session-based authentication logic from developers, leading to improved developer experience and adhering to industry best practices for security and scalability.

### - Swagger
Swagger is used for seamless API documentation.

### - Husky + ESLint
These are dev tools that make the code mainable and production ready. The ESLint is a linting software to ensures code follows a strict set of rules that were designed for longetivity and productive readiness. I have set it up so that both **ESLint** are configured to run with Husky everytime before a commit to this Github remote repo is made!

## 🧱 API Architecture:

The API logic is structured into three main folders. It is modelled after the MVC architure. The "models" are taken care of by the `/drizzle` folder.

- #### Controllers
Contains all business logic, including database queries for API endpoints.

- #### Routes
Includes all endpoints for specific logic types, such as authentication.

- #### Middleware
Houses code that runs before any other logic in an endpoint, useful for pre-processing requests, such as checking user authentication.

## 📝 Endpoint Docs:

To explore the different endpoints and their intended use cases, please navigate to the route `/api-docs` from the api endpoint.
