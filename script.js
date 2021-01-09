function todo(note, link = "", checked = false)
{ //Create a todo item
  return {
    checked: checked,
    note: note,
    link: link,
  }
}

testItems = [
  todo("this"),
  todo("that", "www.example.com"),
  todo("the other", "", true)
];

if(localStorage.getItem("PlannerNotes") == null || localStorage.getItem("PlannerNotes") == "")
{
  localStorage.setItem("PlannerNotes", '[{"checked":false,"note":"Welcome","link":""}]')
}
let listOfNotes = JSON.parse(localStorage.getItem("PlannerNotes"));
let itemsOnPage = [];

var todoListElement = document.querySelector("#todoList");

function itemToHTML(listOfItems)
{
  todoListElement.innerHTML = "";
    for(i in listOfItems){
      todoListElement.innerHTML +=
      `<div id="${i}" class="item">
      <p ${listOfItems[i].checked?"class='checked'>[X":"class='unchecked'>[ "}]</p>
      ${listOfItems[i].link?
        '<a class="note" href="'+listOfItems[i].link+'" target="_blank">'+listOfItems[i].note+'</a>':
        '<p class="note">'+listOfItems[i].note+'</p>'}
        <p class="remove">X</p>
        </div>`
    }

    itemsOnPage = document.querySelectorAll(".item");
    for(item of itemsOnPage)
    {
      item.children[0].addEventListener("click", e=>{
        // Adding a listener for the event that triggers when the checkbox is clicked
        console.log(e.target.parentElement.id);
        console.log(e.target.className); // State of the checkbox

        if(e.target.className == "checked")
        {
          e.target.className = "unchecked";
          e.target.innerHTML = "[ ]";
        } else if(e.target.className == "unchecked")
        {
          console.log(e.target)
          e.target.className = "checked";
          e.target.innerHTML = "[X]"
        }

        let itemId = e.target.parentElement.id;
        listOfNotes[itemId].checked = !listOfNotes[itemId].checked;
        console.log(listOfNotes[itemId].checked);
        // then save
        localStorage.setItem("PlannerNotes", JSON.stringify(listOfNotes));
      })
      item.children[1].addEventListener("click", e=>{
        // Adding a listener, but I don't know what to use it for...
        /// If I was just using the P tag without the A tag then I could use this to add contentEditable
        console.log(e.target.textContent)//.target.innerText);
        if(e.target.nodeName == "A")
        { // if the target is a link then log the address
          console.log(e.target.href);
        }
      })
      item.children[2].addEventListener("click", e=>{
        // Event listener for removing a note, preferably when it's done.
        // Remove Item
        let itemId = e.target.parentElement.id;
        listOfNotes.splice(itemId, 1);
        // Load
        itemToHTML(listOfNotes);
      })
    }
    localStorage.setItem("PlannerNotes", JSON.stringify(listOfNotes));
}

function addNote(){
  let noteInput = document.querySelector("#inputNote");
  let noteContent = noteInput.value;
  if(noteContent.length == 0)
  {
    return;
  } else {
    let linkInput =  document.querySelector("#inputLink");
    let linkContent = linkInput.value;
    if(linkContent.length == 0)
    {
      listOfNotes.push(todo(noteContent));
      noteInput.value = "";
    } else {
      listOfNotes.push(todo(noteContent, linkContent));
      noteInput.value = "";
      linkInput.value = "";
    }
  }
  noteInput.focus();
  itemToHTML(listOfNotes);
}
document.querySelector("#inputform").addEventListener("keypress", e=>{
  if(e.code == "Enter")
  {
    addNote();
  }
});

itemToHTML(listOfNotes);
