//When I update in the UI the list items all change to the same listItem and calories.  I can't find the issue that only changes the edited listItem

//Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }
  }
})();

//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const data = {
   // items:[
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Eggs', calories: 300},  
      // {id: 2, name: 'Cookies', calories: 400},      
   // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //Public Methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      //Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length-1].id +1
      } else {
        ID = 0;
      }
      //Calories to number
      calories = parseInt(calories);

      //Create new Item
      newItem = new Item(ID, name, calories);

      //add to items Array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      //loop through items
      data.items.forEach(function(item) {
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      //Get ids
      const ids = data.items.map(function(item){
        return id.id;
      });
      //Get index
      const index = ids.indexOf(id);
//remove item
data.items.splice(index, 1);

    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
       let total = 0;

       //loop through items array
       data.items.forEach(function(item){
        total += item.calories;

       });
       //set total calories in data structure
       data.totalCalories = total;
       //return 
       return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();

//UI Controller
const UICtrl = (function(){
  const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: 'clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
  }
  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em> ${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return{
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      //show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      //Add Class
      li.className= 'collection-item';
      li.id = `item-${item.id}`

      //Add HTML
      li.innerHTML = `<strong>${item.name}: </strong><em> ${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      //Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Loop through Node list into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`);
       {
         document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
         <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
         </a>`;
       }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn into Node list into Array
      listItems = Array.from(listItems);
      
      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  //Load event Listeners
  const loadEventListeners = function() {
    //get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable Enter button
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Edit Icon Click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Back Button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Delete Item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Clear Items Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  //Add Item Submit
  const itemAddSubmit = function(e) {
    // get form input from UI Controller
    const input = UICtrl.getItemInput();

    //Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      //Add Item to UI List
      UICtrl.addListItem(newItem);

    // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

     
      //clear fields
      UICtrl.clearInput();
    }
      
    e.preventDefault();
  }

  //Click edit Item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')) {
      // Get list item ID(item-0, Item-1)
      const listId = e.target.parentNode.parentNode.id;

      //Breaks into an array
      const listIdArr = listId.split('-');
      //Get actual ID
      const id  = parseInt(listIdArr[1]);

      //Get Item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();

    }

    e.preventDefault();
  }


  //Update Item Submit
  const itemUpdateSubmit = function(e) {
   //Get Item Input
    const input = UICtrl.getItemInput();

   // update item
   const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

   // Update UI
   UICtrl.updateListItem(updatedItem);

   // Get total calories
   const totalCalories = ItemCtrl.getTotalCalories();
   // Add total calories to UI
   UICtrl.showTotalCalories(totalCalories);

   UICtrl.clearEditState();


    e.preventDefault();
  }

  //Delete Button
  const itemDeleteSubmit = function(e){
    //Get id from current item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structute
    ItemCtrl.deleteItem(currentItem.id);

    //delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
   const totalCalories = ItemCtrl.getTotalCalories();
   // Add total calories to UI
   UICtrl.showTotalCalories(totalCalories);

   UICtrl.clearEditState();


    e.preventDefault();
  }

  // Clear items event
  const clearAllItemsClick = function(){
    //Delete all items form data strcuture
    ItemCtrl.clearAllItems();

     // Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
     // Add total calories to UI
     UICtrl.showTotalCalories(totalCalories);

    //Remove Items from UI

    UICtrl.removeItems();
    //Hide UL
    UICtrl.hideList();
  }

  //Public Methods
  return {
    init: function(){
      //clear edit state / set initial state
      UICtrl.clearEditState();
      
      //fetch items from data structure
      const items = ItemCtrl.getItems();


      //check if any items 
      if(items.length === 0){
        UICtrl.hideList();
    } else {
      //populate list with items
      UICtrl.populateItemList(items);
    }

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
      //Load Event Listenersd
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
