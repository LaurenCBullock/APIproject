// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};



// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as JSON
const getImages = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// return 200 without message, just the meta data
const getUsersMeta = (request, response) => { respondJSONMeta(request, response, 200); };

// function to add a user from a POST body
const addImage = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: body.name + body.url + body.desc,
  };

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.url || !body.desc) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // if that user's name already exists in our object
  // then switch to a 204 updated status
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].url = body.url;
  users[body.name].desc = body.desc;

  // console.log([body.name] +[body.url]+[body.desc]);

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = `Saved Image and Description: ${body.name} ${body.url} ${body.desc}`;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};


const addComment = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: body.name + body.comment,
  };
    console.log(responseJSON);

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.comment) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  const responseCode = 201;


  // if comments already exists, append to it
  /* if (users[body.parentName].comments) {


    //responseCode = 204;
  } */
  // if {
  // otherwise create an object with that name
    if(users[body.name].comments == null){
       users[body.name].comments = {};
        users[body.name].comments = new Array();
        users[body.name].comments.push(body.comment)
       }
    else{
         users[body.name].comments.push(body.comment);
    }
  
  // }
  console.dir(users[body.name].comments);
  users[body.name].comments.forEach((element) => {
    console.log(element);
  });



  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = `Saved Comment on ${body.name}`;
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

// public exports
module.exports = {
  getImages,
  getUsersMeta,
  addImage,
  addComment,
  notFound,
  notFoundMeta,

};
