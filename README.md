# Node Express Assessment #2

## Description

This is a unit assessment for SpringBoard's Software Engineering Bootcamp. This assessment consists of three parts:

### Part 1: Q&A

Students answer a series of conceptual questions in a markdown file. (see: *conceptual.md*)

### Part 2: Timeword.js

Students solve a JavaScript problem in which they turn a string of 24h time into words.  
For example:  

    "01:00" = "one o'clock am"
    "00:00" = "midnight"
    "06:01" = "six oh one am"
    "12:00" = "noon"
    "23:23" = "eleven twenty three pm"  

Students must complete this challenge without the use of any external packages. They must also write tests for this function. (see: *timeWord.js & timeWord.test.js*)

### Part 3: Buggy App

Students are given a pre-written app: Bankly. There are several bugs within the app, and students are tasked with finding and fixing them. There are pre-written tests as well, but none of them catch these bugs. It is up to students to read the code, examine the tests, and experiment with the app in order to rectify the errors. Once a bug is found, it must be documented in a markdown file (*bankly/bugs.md*), as well as comments within the file it was found. Then, students must write a test related to the bug that will fail, proving the bug exists. After that, students must fix the code and document the fix in a comment where the bug was found. I went one step further and wrote tests for my code fixes as well.

## Getting Started



1. Clone the repository:

    ```bash
    git clone https://github.com/SeanBailey15/Node_2_Assessment.git <your_optional_repo_name_here>
    ```

2. Navigate into the directory:

    ```bash
    cd <your_repo_name> *OR* Node_2_Assessment
    ```

### Timeword.js
This is a simple function that can be run directly from the terminal, at the top level of the directory. It takes a single argument, which is a string in 24 hour time format.

ex.
```javascript
    node timeWord.js "00:00"
    // output: midnight
```
```javascript
    node timeWord.js "00:01"
    // output: twelve oh one am
```

You can also run the tests for this function with this command:

```bash
    jest timeWord.test.js
```

### Bankly
The bankly app is contained seperately within the assessment repository. You must be inside the top level of the directory (*Node_2_Assessment OR your_repo_name*), then follow these instructions to get started:

1. Navigate into the bankly directory:

    ```bash
    cd bankly
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create the databases:

    ```bash
    createdb bankly
    ```
    ```bash
    createdb bankly_test
    ```

4. Seed the databases:

    ```bash
    npm seed
    ```

### Exploring Bankly

From here, you can read the bug report (*bugs.md*) and run the tests:

```bash
    jest
```

**This may require some configuration on your part, as the tests need access to the databases*

The tests are written with the bugs in mind. There will be failed tests, and the description of each will tell the developer how they relate to each bug (i.e. "WILL FAIL IF FIXED" or "WILL PASS IF FIXED"). These descriptions are included to indicate the status of the bug.

You can test the bug behavior for yourself. The bug report indicates where the bug was found. When reading the file indicated in the bug report, you will notice code blocks that have been commented out, as well as comments indicating the code block that fixed the bug.

You can comment out the fixed code block, and uncomment the bugged code block. If you run the tests again at this point, you will notice the tests for the fixed code are now failing, indicating the bug is now active. You can toggle this behavior by re-commenting the bugged code, then uncommenting the fixed code again.

## Endpoints

For those of you wishing to try the API in a client for yourself, the list of endpoints is as follows:

### Auth (*start here*):

#### POST auth/register

* *Register a new user*

* Requires a JSON body with the following properties:
    * username
    * password
    * first_name
    * last_name
    * email
    * phone

ex.

```json
{
    "username": "myUser",
    "password": "myPass",
    "first_name": "User",
    "last_name": "Name",
    "email": "username@gmail.com",
    "phone": "5555555555",
}
```

* Returns an authentication token for use with other endpoints.

#### POST auth/login

* *Login for existing user*

* Requires a JSON body with the following properties:
  * username
  * password

ex.

```json
{
    "username": "myUser",
    "password": "myPass",
}
```

* Returns an authentication token for use with other endpoints.

### Users:

**Authentication tokens can be passes to these endpoints in one of two ways:*

1. As a query string parameter:

    ```
    /users?_token=<your_token_here>
    ```

2. As a JSON request body:

    ```json
    {
        "_token": "your_token",
    }

#### GET /users

* Only ***logged in users*** should be able to use this endpoint.
* Returns basic info on **ALL** users.

#### GET /users/<username>

* Only ***logged in users*** should be able to use this endpoint.
* Returns basic info on the specified user.
* If user cannot be found, returns a 404 error.

#### PATCH /users/<username>

* Only ***logged in users*** should be able to use this endpoint.
* Only ***the SPECIFIED user*** or ***any ADMIN*** can update a user.
* Only ***ADMIN*** can update Admin privileges.
* Accepts a JSON body with one or more of the following properties:
  * first_name
  * last_name
  * phone
  * email

ex.
```json
    {
        "first_name": "Person",
        "email": "person@gmail.com",
    }
```

* Returns ALL information about the updated user.
* If a user cannot be found, returns a 404 error.
* If an attempt is made to change an unpermitted field, returns an error.

#### DELETE /users/<username>

* Only an ***ADMIN*** should be able to use this endpoint.
* If successful, returns ```{ message: "deleted" }```.
* If user cannot be found, returns a 404 error.

## Conclusion
Thank you for checking out my submission! In the end, I managed to definitively find five bugs in the bankly app (the instructions said there were six). I suspect I may have rolled two bugs into one fix somewhere along the line. I have not seen the provided solution as of yet, so I cannot confirm my suspicion. There are certainly improvements that can be made to the implementation of what code pre-existed in this app, though that was explicitly NOT what this assessment was about (per the instructions). If you find a bug that I missed, I would love to know about it!

## Contact Me

You can reach out to me on social media:

* [Discord](https://discordapp.com/users/792831510515548220)
* [LinkedIn](https://www.linkedin.com/in/sean-bailey-619723279)
* [Facebook](https://www.facebook.com/profile.php?id=61556172566858)

Feel free to connect with me on any of these platforms!