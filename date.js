//jshint esversion:6

// console.log(module);  //help to run all of the code in module
exports.getDate = function(){
  const today = new Date();
  // var currentDay = today.getDay();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);
}
