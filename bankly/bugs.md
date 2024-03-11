# Bankly Bug Report

### BUG #1

**FOUND IN: middleware/auth.js @ authUser()**  
    - The function was not handling the JWT authentication properly. It was not checking the data against the SECRET_KEY or using the proper library method --> `jwt.verify()`

### BUG #2

**FOUND IN: routes/auth.js @ router.post("/login")**  
    - The route was not awaiting user authentication, allowing unregistered users to gain an access token. The solution was to simply add the `await` keyword to the relevant statement.

### BUG #3

**FOUND IN: BOTH routes/users.js @ router.get("/") AND models/user.js @ getAll()**
    - The route was not returning the information as described in it's docstring. The solution was to alter the query in the corresponding User model method: `getAll()`.  

### BUG #4 

**FOUND IN: models/user.js @ get()**
    - The function was not `throwing` the error when the username is not found, it was only creating a new error. This led to the corresponding route returning an empty object instead of the error status and message. The solution was to change the behavior by adding the `throw` keyword into the statement.  

### BUG #5

**FOUND IN: routes/users.js @ router.patch("/:username")**
    - The route was not allowing standard users to access the route due to the implementation of the `requireAdmin` middleware within. The solution is to omit the middleware and add more conditional logic to the route.

### POTENTIAL BUG #6???

**FOUND IN: app.js**
    - Module.exports was declared twice at the bottom of the file. I deleted one of the declarations.

## Final Thoughts

Though I could only find 5 bugs, I can't help but feel that I may have covered 2 in 1. I have scoured the code base, I have run every route in Insomnia with every combination of auth and data I can think of, and cannot find any more odd behavior. 