var uid = new ShortUniqueId();//for generating unique ids
let allColors = ['pink', 'blue', 'green', 'black'];
let defaultColor = "black";
let cFilter = "";//concept for showing all tasks after filterartion //if double click on same color 
let deleteMode = false;

//elements

let mainContainer = document.querySelector(".main-container"); 
let colorBtns = document.querySelectorAll(".color");
let colorGroupContainer = document.querySelector(".color-group_container");
let plusContainer = document.querySelector(".plus_container");
let crossContainer = document.querySelector(".multiply_container");
let lockContainer = document.querySelector(".lock_container");
let unlockContainer = document.querySelector(".unlock_container");
let modalContainer = document.querySelector(".modal_container");



//event listeners

//------------------------------------------FILTERING---------------------------------------------------//

colorGroupContainer.addEventListener("click", function(e) {
    // console.log(e.target);
    // console.log(e.currentTarget);
    if(e.target != colorGroupContainer){
        let clickedColor = e.target.classList[1];
        filterCards(clickedColor);

}
})


//-------------------------------------------REMOVE-------------------------------------------------//
crossContainer.addEventListener("click", function() {
    deleteMode =! deleteMode;
    if(deleteMode){
        crossContainer.classList.add('active'); 
    }else{
        crossContainer.classList.remove('active');
    }
    plusContainer.classList.remove('active');              
})


//----------------------------------lock-unlock---------------------------------//
lockContainer.addEventListener("click", function(e) {
    lockContainer.classList.add('active');
    unlockContainer.classList.remove("active");
    let allTasks = document.querySelectorAll(".task_main-container");
    console.log('hello');
    for(let i = 0 ; i < allTasks.length; i++){
        allTasks[i].children[1].setAttribute("contenteditable", "false");
    }
})
unlockContainer.addEventListener("click", function(e) {
    unlockContainer.classList.add("active");
    lockContainer.classList.remove("active");
    let allTasks = document.querySelectorAll(".task_main-container");
    console.log('hello');
    for(let i = 0 ; i < allTasks.length; i++){
        allTasks[i].children[1].setAttribute("contenteditable", "true");
    }
})

//related/helper functions
function createTask(id, task, flag, headerColor)  { 
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    taskContainer.innerHTML = `<div class="task_header
    ${headerColor?headerColor:defaultColor}"></div>
    <div class="task_main-container">
    <h3 class="task_id">#${id}</h3>
    <div class='text' contenteditable = 'true'>${task}</div>
    </div>`
    mainContainer.appendChild(taskContainer);
    
    //add_event_listener for color challengers
    //---------------------------color change--------------------------///
    let taskHeader = taskContainer.querySelector(".task_header");
    let inputTask = taskContainer.querySelector(".task_main-container>div");
    taskHeader.addEventListener("click",function() {
        // classList -> get all classes on the element
        let cColor = taskHeader.classList[1];
        // console.log(cColor);

        let cIdx = allColors.indexOf(cColor);
        let nextIdx = (cIdx + 1) % 4;
        let nextColor = allColors[nextIdx];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor); 
        //id -> local storage search -> tell -> color update

        //removing from local storage too
        let idWalaelem = taskHeader.parentNode.children[1].children[0];//task_header -> task_container -> taskMaincontainer -> task_id;
        let id = idWalaelem.textContent;
        id = id.slice(1);// to remove #
        let taskString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(taskString); // JSON string -> javaScript object
        
        for(let i = 0; i < tasksArr.length; i++) {
            if(tasksArr[i].id == id){
                tasksArr[i].color = nextColor;
                headerColor = nextColor;
                // console.log(defaultColor);
                break;
            } 
        }

        localStorage.setItem("tasks", JSON.stringify(tasksArr));
        
        
    })
    //**************************delete**************************//
    taskContainer.addEventListener("click",function() {
        if(deleteMode == true){
            taskContainer.remove();
            let idOfRemovedTask = taskContainer.querySelector(".task_id").textContent.slice(1);
            // console.log(idOfRemovedTask);
            // for()
            // localStorage -> remove
            let taskString = localStorage.getItem("tasks");
            let tasksArr = JSON.parse(taskString); // JSON string -> javaScript object
        
            for(let i = 0; i < tasksArr.length; i++) {
                if(tasksArr[i].id == idOfRemovedTask){
                    if(i == 0){
                        tasksArr.shift();
                    }else{
                        tasksArr.splice(i,i);//delete
                    }
                    break;
                } 
            }
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
        }
    })

    ////////////////////local storage-> add
    if(flag == true){
        //old tasks
        let taskString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(taskString) || []; // JSON string -> javaScript object
        taskObject = {
            id : id,
            task : task,
            color : headerColor
        }
    //1 new task
        tasksArr.push(taskObject);
        //set
        localStorage.setItem("tasks", JSON.stringify(tasksArr)); // javaScript object -> JSON string
    }


    //edit -> update in local storage too
    // let taskHeader = taskContainer.querySelector(".task_header");
    inputTask.addEventListener("blur", function(e) {//change is not working but blur -> work
        //blur calls on focus
        // console.log("value of main task", mainTask.innerText);
        let taskString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(taskString); // JSON string -> javaScript object
        
        for(let i = 0; i < tasksArr.length; i++) {
            if(tasksArr[i].id == id){//closure -> id
                tasksArr[i].task = inputTask.innerText;
            } 
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));

    })
}

//*************************** modal working***************************//

plusContainer.addEventListener("click", function() {
    plusContainer.classList.add('active');
    crossContainer.classList.remove('active');
    modalContainer.style.display = 'flex';
    
    
    

    //color choosing from modal
    let colorChooser = document.querySelectorAll(".color_picker");
    for(let i = 0; i < colorChooser.length; i++){
        colorChooser[i].addEventListener("click", function() {
            // console.log(colorChooser[i].classList[1]
            for(let j = 0; j < colorChooser.length; j++){//removing border from all
                colorChooser[j].classList.remove("selected");
            }

            colorChooser[i].classList.add("selected");//adding border to selected color
            defaultColor = colorChooser[i].classList[1];
            
        })
    }
    //entering input and creating tasks
    // let modalInputTextBox = document.querySelector(".modal-text_box");
        modalContainer.addEventListener("keydown", function(e) {
        // console.log(modalInputTextBox.innerText);
        let modalInputTextBox = modalContainer.children[0];
        if(e.key == "Enter" && modalInputTextBox.innerText.trim() !== "Enter your task here" ){
            let id = uid();
            createTask(id, modalInputTextBox.innerText, true, defaultColor);
            plusContainer.classList.remove('active');
            //hiding of modal
            let modalTextBox = document.querySelector(".modal-text_box");
            modalTextBox.innerText = "Enter your task here";
            defaultColor = "black";
            for(let i = 0; i < colorChooser.length; i++){
                colorChooser[i].classList.remove("selected");
            }
            colorChooser[3].classList.add("selected");
            modalContainer.style.display = "none";

        }
    })    
})
    
////**********************************filtering*************************************////
function filterCards(filteredColor){
    let allTasks = document.querySelectorAll(".task_header");
    if(cFilter != filteredColor){
        for(let j = 0; j < allTasks.length; j++){
            let headerColor = allTasks[j].classList[1];
            if(headerColor == filteredColor){
                //show
                allTasks[j].parentNode.style.display = "block";
            }else{
                //hide
                allTasks[j].parentNode.style.display = "none";
                
            }
            
        }

        cFilter = filteredColor;
        
    }else{
        cFilter = "";
        for(let j = 0; j < allTasks.length; j++){
            allTasks[j].parentNode.style.display = "block";
        }
    }
}

//calling
//check if any of the tasks are in local localStorage -> then bring it to ui
(function () {
    //create
    //get all the elements in the tasks key -> loop
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    modalContainer.style.display = "none";
    for(let i = 0; i < tasks.length; i++){
        let { id,task,color } = tasks[i]; 
        createTask(id, task, false, color);
    }
})();