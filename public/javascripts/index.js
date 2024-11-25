// helper function for creating elements
// usage optional
// example:
//   // h1 with link as child
//   const a = createElement('a', {href: '/foo'})
//   a.textContent = 'foo'
//   const h1 = createElement('h1', {id: 'foo'}, a)
const askBtn = document.querySelector("#btn-show-modal-question")
const modal = document.querySelector(".modal")
const modalAns = document.querySelector("#modal-answer")
const closeBtn = document.querySelector(".close")
const createQBtn = document.querySelector("#create-question")

askBtn.addEventListener("click", () => {
  modal.showModal();
})

closeBtn.addEventListener('click', () => {
  modal.close();
})

function showModalAns() {
  modalAns.showModal();
}

async function addAnswer(){
  const response = await fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({question: enterQuestion}),
  });
}
createQBtn.addEventListener('click', async () => {
  const enterQuestion = document.querySelector("#question-text").value;
  const response = await fetch("http://localhost:3000/questions", {
    method: "POST",
  });

  modal.close();


  const data = await response.json();
  if (data.hasOwnProperty("error")){
    console.log("Error: ", data.error)
  }
  else {
    const mainPg = document.querySelector("main");
    const container = document.createElement("div");

    const questionNode = document.createElement("p");
    questionNode.className = "question";
    questionNode.textContent = data.question;
    questionNode.setAttribute("_id", data.id);

    container.appendChild(questionNode);

    const addAnsBtn = document.createElement("button");
    addAnsBtn.id = "btn-add-modal-question"
    addAnsBtn.textContent = "Add an answer"
    container.appendChild(addAnsBtn)
    mainPg.appendChild(container)
  }
})


function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  // add element attributes
  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  // add child nodes to element
  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return ele;
}

document.addEventListener('DOMContentLoaded', async function() {
  const response = await fetch("http://localhost:3000/questions", {
      method: "GET"
  });

  if (response.status == 404){
    console.log("Cannot access server's API")
  }
  else{

    const data = await response.json();
    const mainPg = document.querySelector("main");
    data.forEach((ele) => {
      const question = ele.question;
      const answers =  ele.answers;
      const container = document.createElement("div");

      const questionNode = document.createElement("p")
      questionNode.className = "question"
      questionNode.textContent = question;

      container.appendChild(questionNode)


      answers.forEach((ans)=>{
        const answNode = document.createElement("li");
        answNode.className = "answer"
        answNode.textContent = ans;
        container.appendChild(answNode)
      })
      const addAnsBtn = document.createElement("button");
      addAnsBtn.id = "btn-add-modal-question"
      addAnsBtn.textContent = "Add an answer"
      container.appendChild(addAnsBtn)
      mainPg.appendChild(container)
    })
  }
}); 
// TODO: finish client side javascript