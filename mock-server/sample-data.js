module.exports = {
  firstname: ["John", "Conor", "Jesus"],
  lastname: ["Dunne", "Pancake", "Wakawombo"],
  email: ["j@j.ie", "pancake@yeehaw.com", "something@hey.ie"],
  name: [
    "$(firstname:0) $(lastname:0)",
    "$(firstname:1) $(lastname:1)",
    "$(firstname:2) $(lastname:2)",
  ],
  parent: ["Cara, parent of $(child:0)"],
  child: ["John, child of $(parent:0)"],
};
