const isInArray = ((user, listeners) => {
var found = false;
listeners.forEach((listener) => {
  if (listener.id === user.id){
     found = true;
  }
})
  return found;
});

const removeFromArray = ((user, listeners) => {
var i = 0;
  listeners.forEach((listener) => {
    if (listener.id === user.id){
      listeners.splice(i,1);
    }
    i++
  });
return listeners;
})

const  generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports = {
  isInArray,
  removeFromArray,
  generateRandomString
};
