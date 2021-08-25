// model
const budgetModel = (function () {
  //  the state

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: '--',
  };

  // calculate the percentage 
  Expence.prototype.calcPerc = function (totalIncome){

    if (totalIncome > 0)  {
      this.percentage = Math.round((this.value  / totalIncome) * 100);
    } else {
      this.percentage = -1 ;
    }

  };

  // incomes function constractors
  function Income(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  // expenses function constractors
  function Expence(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
    this.percentage = '--' ;
  };

  // calculate total inc and total exp
  let calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach((el) => (sum += el.value));
    data.totals[type] = sum;
  };
  return {
    expose: () => data,

    // adding item to the state
    addItem: function (type, desc, value) {
      let newItem, id;

      // generating an id for each item
      if (data.allItems[type].length === 0) {
        id = 0;
      } else {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
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

    // calculate the budget , inc , exp , perc
    calculateBudget: () => {
      // calculating the total inc and exp
      calculateTotal("inc");
      calculateTotal("exp");

      // calculate the budget
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    // calculate the percentages of all items 
    calculatePercentages : () => {
      data.allItems.exp.forEach( el => {
        el.calcPerc(data.totals.inc)
      })
    },

    // return the percentages to render them
    getPercentages : () => {
      let allPerc ;
      allPerc = data.allItems.exp.map((el) =>  el.percentage )
      return allPerc
    },

    // return the budget to use it for rendering
    getBudget: () => {
      return {
        totals: data.totals,
        budget: data.budget,
        percentage: data.percentage,
      };
    },
    removeItem: (type, id) => {

      // finding the item , its index and then remove it
      data.allItems[type].map((el, ind) => {
        if (el.id === Number(id)) {
          data.allItems[type].splice(ind, 1);
        }
      });

    },
  };
})();

// view
const budgetView = (function () {
  // dom items
  domItems = {
    container: ".container",
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    InputButton: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",

    budgetValue: ".budget__value",
    incomeValue: ".budget__income--value",
    expensesValue: ".budget__expenses--value",
    expensesPerc: ".budget__expenses--percentage",
    itemPerc : ".item__percentage" ,

    month: ".budget__title--month",
  };
  let formatNumbers = (num , type) => {
    let splitNum , int , dec , sign ;

    // exp -2566.505
    // gettind the absolute value and fixing the decimals to 2
    num = Math.abs(num) ; // output : 2566.505
    num = num.toFixed(2) ; // output : 2566.50
    
    splitNum = num.split('.')

    int = splitNum[0] ; // output : 2566
    dec = splitNum[1] ; // output : 50

    if (int.length > 3){
      int = int.substr(0 , int.length - 3 ) + ',' + int.substr(int.length - 3 , 3)
      // output : 2,566
    }

    // generating the sign 
    type == 'inc' ?  type = '+' : type = '-' ;

    return `${type} ${int}.${dec}` ;

  }
  return {
    formatNumbers,
    //getting the fields input values
    getInput: () => {
      return {
        type: document.querySelector(domItems.inputType).value,
        desc: document.querySelector(domItems.inputDesc).value,
        value: Number(document.querySelector(domItems.inputValue).value),
      };
    },

    // return dom items to use them in the controller
    getDomStrings: () => domItems,

    // render new items to the lists
    addListItem: (obj, type) => {
      let htmlEl, element;

      if (type === "inc") {
        element = domItems.incomeList;
        htmlEl = `
                <div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumbers(obj.value , type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `;
      } else if (type === "exp") {
        element = domItems.expensesList;
        htmlEl = `
                <div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumbers(obj.value , type)}</div>
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

    // render new budget values
    renderBudget: (bud) => {
      document.querySelector(domItems.budgetValue).innerHTML = bud.budget;
      document.querySelector(domItems.incomeValue).innerHTML = formatNumbers(bud.totals.inc , 'inc')
      document.querySelector(domItems.expensesValue).innerHTML = formatNumbers(bud.totals.exp , 'exp')
      document.querySelector(domItems.expensesPerc).innerHTML = bud.percentage + "%";
    },

    //display month

    displayMonth: () => {
      var options = { month: "long" };
      let fullDate = new Date();
      currentMonth = new Intl.DateTimeFormat("en-US", options).format(fullDate);
      document.querySelector(
        domItems.month
      ).innerHTML = `<b> ${currentMonth} </b>`;
    },
    removeItem : (element) => {

      // selecting the parentNode and using the removeChild method to remove the desired element 
      let elementNode = document.getElementById(element) ;
      elementNode.parentNode.removeChild(elementNode);

    }, 
    displayPercentages : (percentages) => {
      let elements = [];
      elements = document.querySelectorAll(domItems.itemPerc) ;
      
      // a function to loop through elements 
      function NodeListForEach (list , callback) {
        for(let i = 0 ; i < list.length ; i++) {
          callback(list[i] , i) ;
        }
      }
      
      // in case there is items in the expence list , display its percentage 
      NodeListForEach(elements , (el , index) => {
        if (elements.length > 0 ){
          el.textContent = percentages[index] + ' %'
        } else {
          el.textContent = '--'
        }
        }) ; 
    }
  };
})();

// controller
const budgetController = (function (model, view) {
  // get Dom strings
  let DOM = view.getDomStrings();

  // updating the budget
  let updateBudget = () => {
    // calculate the budget
    model.calculateBudget();
    // return totals
    let budget = model.getBudget();
    // render the data
    view.renderBudget(budget);
  };

  let updatePercentages = () => {
    let percs ;

    // calculate the percentages 
    model.calculatePercentages() ;

    // get the percentages 
    percs = model.getPercentages() ;
    
    // render the percentages 
    view.displayPercentages(percs) ;
  }

  // add items to list
  let addItem = () => {
    // get input values
    let input = view.getInput();

    // check for required inputs
    if (
      input.type !== "" &&
      input.desc !== "" &&
      input.value !== "" &&
      input.value !== 0
    ) {
      // add item to state
      let item = model.addItem(input.type, input.desc, input.value);

      // render item + clean up

      view.addListItem(item, input.type);
      view.clearInputFields();

      // calculate budget
      updateBudget();

      // update the percentages 
      updatePercentages() ;
    }
  };

  // remove item from list

  let removeItem = (event) => {

    // this is apparently hard coded
    let fullId , splitId, id, type;

    fullId = event.target.parentNode.parentNode.parentNode.parentNode.id ;

    // getting the id and the type
    splitId = fullId.split("-");

    // the id
    id = splitId[1];

    // the type
    type = splitId[0];

    if (splitId) {
      // remove the item from the state
      model.removeItem(type, id);
      // delete the item from the UI
      view.removeItem(fullId);
      // update the budget
      updateBudget();
      // update the percentages 
      updatePercentages();

    }
  };

  // setting event listeners
  let setUpEventListeners = () => {
    document.querySelector(DOM.InputButton).addEventListener("click", addItem);

    document.addEventListener("keypress", function (event) {
      if (event.charCode === 13 || event.which === 13) addItem();
    });

    document.querySelector(DOM.container).addEventListener("click", (event) => {
      if (event.target.className === "ion-ios-close-outline") {
        removeItem(event);
      }
    });
  };

  return {
    // init function
    init: () => {
      setUpEventListeners();
      // rendering the budget with initial values (0s)
      view.renderBudget(model.getBudget());

      view.displayMonth();
    },
  };
})(budgetModel, budgetView);

budgetController.init();
