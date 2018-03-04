const isInArray = ((user, listeners) => {
var found = false;
listeners.forEach((listener) => {
  if (listener.id === user.id){
     found = true;
  }
})
  return found;
});
module.exports = {
  isInArray
};
