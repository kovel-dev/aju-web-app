[Go Back to Table of Contents](../README.md)

# Installation

* FaunaDB
* Github Project
* Run the Application


# FaunaDB

**REQUIREMENTS**

1. FaunaDB Account
2. FaunaDB Database
3. Initial Collection
4. Initial users' document
5. Initial Index
6. FaunaDB Secret API Key

**STEPS**

1. Create a Fauna DB Account.
2. Create a Fauna DB Database. Name it to your preference related to the project.
3. Create the initial collection: users
4. Insert initial users' document.

```
"first_name": "Elite",
"last_name": "Super Admin",
"email": "elite@ajumaven.ca",
"password": "$2b$10$8DkjC4pz4TKAurf1cxQa5eymtJ5oO1GHRDYdqjd9ehQUyHeZlWchW",
"status": "active",
"role": "developer",
"timezone": "toronto",
"is_verified": true,
"verification_date": "2021-06-15 23:29:00"
```

> Note: Enter a new line in between {}. Insert the data in line 2 before you create a document.

5. Create the initial index by going to the sidebar > Click 'Indexes' > then click 'New Index'. Name the index: users_by_email

```
Index Name: users_by_email
Terms: data.email
Source Collection: users
Serialized
```

6. Get FaunaDB Secret API Key by going to the sidebar > Click 'Security' > then make sure you're in 'Keys' tab > then click 'New Key'. Name your key to your preference related to the project. Get the key and save it temporarily to a note.

&nbsp;

# Github Project

**REQUIREMENTS**

1. Clone the project.
2. Install dependencies on Admin App.
3. Add .env.local

**STEPS**

1. Clone the project.
```
git clone https://github.com/elitedigitalagency/aju-web-app.git <name of the folder>
```

2. Install dependencies on Admin App by going to the project folder then go inside maven-admin-app folder and perform the following command:
```
npm install
```

3. Once the dependencies are installed. Add .env.local on the root folder of maven-admin-app and add the following settings:
```
NODE_ENV=local
APP_NAME=AJU Maven Admin
FAUNADB_SECRET=<FaunaDB Secret API Key>
```

&nbsp;
# Run the Application

## In Development Environment

1. Run the application by this command
```
npm run dev
```

2. Access the application by: http://localhost:3000

3. Go to sign-in page by click the 'Sign In' link in the top right corner or by going to http://localhost:3000/sign-in

4. Use the initial document credential.
```
email: elite@ajumaven.ca
password: superElite@4ever
```

<br />

[Go Back to Table of Contents](../README.md)