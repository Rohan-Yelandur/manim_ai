# Backend Server

### Frameworks

Flask runs on a WSGI (web server gateway interface), which is synchronous. Requests are handled
one at a time and block while waiting.

FastAPI run on an ASGI (asynchronous server gateway interface) which is asynchronous. Requests can 
be handled concurrently.

FastAPI uses Pydantic models to handle validation, parsing, and error handling.

### CORS

Stands for Cross-origin resource sharing. It's a rule set by browsers that restricts which websites
can read responses from a server. Meant for protection against malicious requests.

The request is always sent to the server, but the browser blocks JavaScript from reading the
response if CORS isn't enabled for that specific website.

### Concurrency

Async() in JavaScript lets you use await inside to block until a long action completes.