### Conceptual Exercise

Answer the following questions below:

- What is a JWT?  
  - A JWT is a JSON web token. It is an encoded object containing data that is usually needed for a web app to authenticate an HTTP request. It is made up of three parts:  
    - The header, typically consisting of two parts: the type of the token and the signing algorithm being used.
    - The payload, the part that contains the data about a user, issuer, expiration time of the token, etc.
    - The signature, encoded along with a secret key which is unique to the application. Used to verify the authenticity of the data and ensure it comes from a trusted source.

- What is the signature portion of the JWT?  What does it do?  
  - Answered above

- If a JWT is intercepted, can the attacker see what's inside the payload?  
  - Yes. There are many tools to decode a JWT. This is why it is important to keep sensitive or critical data out of the payload.

- How can you implement authentication with a JWT?  Describe how it works at a high level.  
  - Say a user needs to login to our app in order to access the content. We can take the username, login time, and any other credentials required(such as admin rights), and create a JWT with a payload containing the data our app needs to authenticate this user. **It is important that no sensitive or critical data is included in the payload.** This token can now be passed along with any request made by the user. Upon receipt of the request to a given endpoint, we can first check that an authentic JWT, signed with our apps secret key, has been included in the request. If we find the token is valid, we can grant the user access. If not, we can deny access.  

- Compare and contrast unit, integration and end-to-end tests.  
  - Unit tests are focused on testing small pieces of code, like a single function. Integration tests focus on testing how several parts of the code work together. End-to-end tests focus on testing an entire simulation of the user experience, ensuring smooth and pleasant interactions.

- What is a mock? What are some things you would mock?  
  - A mock is simulated data, created by the dev, used most often in unit testing. The purpose of a mock is to provide reliable data when testing an object that may otherwise rely on complex, random, or external data. A mock is useful to isolate the behavior of the test. You may want to mock a response for an AJAX request to an API, or mock a return value from a function that returns random data. 

- What is continuous integration?  
  - Continuous integration is the idea of merging changes to a code base frequently, and testing an app any time a change is made to ensure that the change does not break the app in any way. The app is tested with the new change before the merge is actually finalized. If all tests are passed, the change is merged. If any test fails, the merge is denied. This protects the code base from the introduction of app breaking bugs.

- What is an environment variable and what are they used for?  
  - An environment variable is a user-definable value that can affect the way running processes will behave on a computer. Environment variables are part of the environment in which a process runs. The primary use case for environment variables is to limit the need to modify and re-release an application due to changes in configuration data.

- What is TDD? What are some benefits and drawbacks?  
  - Test-driven development is a method of creating software where requirements are converted to test cases before any code is written. The developers then write code that can pass the tests, one test at a time. As they build the code base, developers ensure the app maintains functionality by repeatedly testing the software against all test cases.  
  - Some benefits are:  
    - Code is more modular, with better architecture due to the need to be unit-testable
    - Better test coverage, since every unit was designed to suit a pre-existing test
    - Well documented code, as tests typically describe the functionality being tested
    - Easier maintenance and refactoring, since the tests are so comprehensive it makes it easier to see how changes will affect the software  
  - Some drawbacks are:  
    - Slower start to developement, as efforts are focused on writing tests first
    - Tests may be hard to write without a clear idea of how you will achieve passing results
    - Challenging to learn this approach, even harder to master, requires a dedicated effort to get good/great at thinking in terms of TDD

- What is the value of using JSONSchema for validation?  
  - The value of using JSONSchema is that it makes it easier for the developer to ensure incoming data matches the expectation for that data, such as type(string, integer, etc), range(e.g. 0-100) and more. It prevents innacurate or unnecessary data from being used within the application.

- What are some ways to decide which code to test?  
  - You could choose to write tests according to test coverage percentages, setting out to ensure that 100% of the code base is tested. You could also choose to write tests based on "use case coverage", where you think about all the ways a unit of code could be used, and write tests that will cover them. Both methods are useful, but should not be mutually exclusive. It is important to combine the two to achieve the best possible test coverage.

- What does `RETURNING` do in SQL? When would you use it?  
  - The RETURNING clause in SQL is used to retrieve values from a data modification statement, such as INSERT, UPDATE, or DELETE after the statement has been executed. This can be useful when we want to know the values that were actually inserted, updated, or deleted as a result of the operation. We could then present the returned values back to a user as an acknowledgment of the action they just took, or use the returned values for other purposes.

- What are some differences between Web Sockets and HTTP?  
  - HTTP is a verbose and "heavy" protocol, where Web Sockets are more lightweight. HTTP is stateless, it requests a resource, gets a response, then terminates the connection. Web Sockets, however, are stateful. Their connection can stay open, allowing for real-time exchange of data.

- Did you prefer using Flask over Express? Why or why not (there is no right
  answer here --- we want to see how you think about technology)?  
  - When I began using Express, I thought I liked Flask better. In hindsight, this was only because I was more familiar with Flask at the time. Currently I feel that Express is a bit more streamlined. I also enjoy the middleware functionality of Express. I feel I cannot answer this question completely though. It has been a while since I wrote a Flask app. The speed at which this bootcamp moves has caused me to learn and move on, so to speak. This means that as a student, learning these concepts at such a fast pace, no single concept is etched into my memory without thorough repetition. I believe I can revisit some of my Flask assignments and fully understand, but it's not like I can recall all the syntax, methods, and functionality from memory. I had not thought that I would be comparing Flask to Express during the time I was learning Flask. To summarize, I would have to revisit some past assignments, or potentially attempt to create the same app side-by-side using the different tech stacks, to find out if I have a preference. All said, I prefer to be well rounded, and not be too attached to any given tech stack. I'd much rather understand the fundamental concepts, and be able to utilize my understanding to harness the right tool for the right job.
