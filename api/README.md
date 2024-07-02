Token : Generated dynamically on successful authentication or login event. Often has a short expiration time but is able to be refreshed for longer periods.

Mongoose lean() method, the documents are returned as plain objects.
The only challenge here is that you are not able to use Mongoose features such as save(), virtuals, getters, etc., if you use lean() on a query.
lean() returns a JavaScript object instead of a Mongoose document.