# Backend Server

### Frameworks

Flask runs on a WSGI (web server gateway interface), which is synchronous. Requests are handled
one at a time and block while waiting.

FastAPI run on an ASGI (asynchronous server gateway interface) which is asynchronous. Requests can 
be handled concurrently.

I chose FastAPI to service requests from many users concurrently, rather than blocking each behind 
the others. This way if I check a user's query and see it is invalid, I can tell them that faster
without them needing to wait until all previous video generations are completed.Video generation 
itself is CPU bound so I'll still need to make multiple background workers if I want to speed up 
users receiving their videos.

FastAPI uses Pydantic models to handle validation, parsing, and error handling.

### CORS

Stands for Cross-origin resource sharing. It's a rule set by browsers that restricts which websites
can read responses from a server. Meant for protection against malicious requests.

The request is always sent to the server, but the browser blocks JavaScript from reading the
response if CORS isn't enabled for that specific website.

### Concurrency

Async() in JavaScript lets you use await inside to block until a long action completes.