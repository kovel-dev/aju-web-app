[Go Back to Table of Contents](../README.md)

# FaunaDB

# Table
### users
```
To Follow
```

<br>

# Indexes

## FOR USERS

### users_by_verification_token
```
name: users_by_verification_token
source: users
terms: 
  verification_token
serialized: true
```

### users_by_email
```
name: users_by_email
source: users
terms: 
  email
serialized: true
```

### users
```
name: users
source: users
terms: 
  first_name
  last_name
  email
  role
  status
  is_verified
  ref
serialized: true
```






<br>

[Go Back to Table of Contents](../README.md)