/*
sample code evaluated by seclint.js
*/

let MONGODB_URI =
  "mongodb+srv://nurtureadmin:PC7iYUaVYMagAF51@vvrs.7wjpqxn.mongodb.net/nurturedb?retryWrites=true&w=majority&appName=VVRS";

const hello = () => {
  console.log("Hello, World!");
};

let a = 5.5 + "hello";
let b = a | 0;

// const hello = () => {
//   console.log("Hello, World!");
// };

const warn = () => {
  console.error("error");
  const userInput = document.getElementById("userInput").value;
  if (userInput == 0) eval("console.log(userInput)");
};
