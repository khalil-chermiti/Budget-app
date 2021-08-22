// feature 1 : add items to list

// model
const budgetModel = (function () {
  //  the state

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: [],
      inc: [],
    },
  };

  // expenses and incomes function constractors

  function Income(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  function Expence(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  return {
    // adding item to the state
    addItem: function (type, desc, value) {
      let newItem, id;

      // generating an id for each item
      if (data.allItems[type].length === 0) {
        id = 0;
      } else {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      console.log(id);
      // creating the item object
      if (type === "inc") {
        newItem = new Income(id, desc, value);
      } else if (type === "exp") {
        newItem = new Expence(id, desc, value);
      }
      // adding item to state
      data.allItems[type].push(newItem);

      return newItem;
    },
    data,
  };
})();

// view
const budgetView = (function () {
  // dom items
  domItems = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    InputButton: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
  };

  return {
    //getting the input
    getInput: () => {
      return {
        type: document.querySelector(domItems.inputType).value,
        desc: document.querySelector(domItems.inputDesc).value,
        value: document.querySelector(domItems.inputValue).value,
      };
    },
    getDomStrings: () => domItems,

    // adding new items to the lests
    addListItem: (obj, type) => {
      let htmlEl, element;

      if (type === "inc") {
        element = domItems.incomeList;
        htmlEl = `
                <div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `;
      } else if (type === "exp") {
        element = domItems.expensesList;
        htmlEl = `
                <div class="item clearfix" id="expense-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `;
      }

      document.querySelector(element).insertAdjacentHTML("beforeend", htmlEl);
    },

    //clearing input fields
    clearInputFields: () => {
      let inputs, inputsArr;
      inputs = document.querySelectorAll(
        domItems.inputDesc + "," + domItems.inputValue
      );

      inputsArr = Array.from(inputs);

      inputsArr.forEach((el) => (el.value = ""));
    },
  };
})();

// controller
const budgetController = (function (model, view) {

  // get Dom strings
  let DOM = view.getDomStrings();

  // add item function
  let addItem = () => {

    // get input values
    let input = view.getInput();

    // check for required inputs 
    if (!(input.desc === "" || input.value === "")) {

      // add item to state
      let item = model.addItem(input.type, input.desc, input.value);

      console.log(item);

      // render item + clean up

      view.addListItem(item, input.type);
      view.clearInputFields();

      // calculate budget
      // render budget
    }
  };

  // setting event listeners
  let setUpEventListeners = () => {
    document.querySelector(DOM.InputButton).addEventListener("click", addItem);

    document.addEventListener("keypress", function (event) {
      if (event.charCode === 13 || event.which === 13) addItem();
    });
  };

  return {
    init: () => {
      setUpEventListeners();
    },
  };
})(budgetModel, budgetView);

budgetController.init();
