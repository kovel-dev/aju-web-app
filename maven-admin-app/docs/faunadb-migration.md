[Go Back to Table of Contents](../README.md)

# FaunaDB Migration

# Configuration

Ref: https://github.com/fauna/fauna-shell

1. Install FaunaDB Shell

```
npm install -g fauna-shell
```

2. Enter Credentials

```
fauna cloud-login
```

> You will be prompted for your email and password from your FaunaDB Cloud account or you can just provide the secret key

<br><br>

# Run the migration

Run the migration launch script

```
fauna eval aju_maven --file=./schema/launch.fql
```

Expected Output:

This will output the arrays and initial user record worked by the process.

> Note: Need to improve output on CLI by adding new line or logs

```
["users","products","tags",{"name":"users","source":"users","values":[{"field":["data","first_name"]},{"field":["data","last_name"]},{"field":["data","email"]},{"field":["data","role"]},{"field":["data","status"]},{"field":["data","is_verified"]},{"field":["ref"]}]},{"name":"tags","source":"tags","values":[{"field":["data","name"]},{"field":["data","description"]},{"field":["data","desktop_image"]},{"field":["data","mobile_image"]},{"field":["data","is_featured"]},{"field":["data","similir_tags"]},{"field":["ref"]}]},{"name":"users_by_email","source":"users","terms":[{"field":["data","email"]}]},{"name":"users_by_verification_token","source":"users","terms":[{"field":["data","verification_token"]}]},{"name":"tags_by_name","source":"users","terms":[{"field":["data","name"]}]},{"ref":{"@ref":{"id":"302841742793638400","collection":{"@ref":{"id":"users","collection":{"@ref":{"id":"collections"}}}}}},"ts":1625071242150000,"data":{"first_name":"Elite","last_name":"Developer","email":"elite@ajumaven.ca","password":"$2b$10$8DkjC4pz4TKAurf1cxQa5eymtJ5oO1GHRDYdqjd9ehQUyHeZlWchW","status":"active","role":"developer","timezone":"","is_verified":"","verification_date":"","verificaiton_token":"","affiliation_id":"","last_login_dt":"","cart_meta":"","card_meta":"","created_by":"","created_at":"","updated_by":"","updated_at":""}}]   
```

<br>

[Go Back to Table of Contents](../README.md)
