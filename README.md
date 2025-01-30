# 🚀 StockSavvy API

**Overview:** The StockSavvy API powers the backend of the StockSavvy web platform, developed with NextJS (purely frontend)
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

### - Github Actions + Jest
A Github action that runs Jest testing which tests **all** helper functions that the backend system uses. This action runs jest after commits are pushed onto the repo.

## 🧱 API Architecture:

The API logic is structured into three main folders. It is modelled after the MVC architure. The "models" are taken care of by the `/drizzle` folder and the schema.ts file within `src`.

- #### Controllers
Contains all business logic, including database queries for API endpoints.

- #### Routes
Includes all endpoints for specific logic types, such as authentication.

- #### Middleware
Houses code that runs before any other logic in an endpoint, useful for pre-processing requests, such as checking user authentication.

## 📝 Endpoint Docs:

To explore the different endpoints and their intended use cases, please navigate to the route `/api-docs` from the api endpoint.

## Contributions?

Contributions are allowed! We ask that you follow certain rules whilst making contributions. All work that you do will be **voluntary** and not privy to payment. However, you can use **your** contributions as work experience for any future work you might apply for. This can only be done if you follow our rules as listed below...

#### The rules:

When making contributions to this codebase, start by creating a issue. The naming of the issue should start off with:

- feat: (for a new feature)
- fix: (for a fix to a bug/feature not working)
- chore: (for any other task that does not fit the other 2 categories)

Once the issue is made, be sure to comment on that issue for all progress made. 

Now, we can create a branch for your work. **DO NOT COMMIT ON MAIN** 
The branch should have the following naming structure: `YOUR NAME/GITHUB USER/1-2 WORDS ON THE CONTRIBUTION MADE` Examples of such naming structure include `hemit99123/about-page`

Ok now create a PR with the **same name as the issue** and once you are done with your contribution, simply merge the PR and close the issue :)

### Happy Coding 🧑🏽‍💻
