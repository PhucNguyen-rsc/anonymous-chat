// helper function for creating elements
// usage optional
// example:
//   // h1 with link as child
//   const a = createElement('a', {href: '/foo'})
//   a.textContent = 'foo'
//   const h1 = createElement('h1', {id: 'foo'}, a)
const askBtn = document.querySelector("#btn-show-modal-question");
const modal = document.querySelector("#modal-question");
const closeBtn = document.querySelector(".close");
const createQBtn = document.querySelector("#create-question");

const modalAns = document.querySelector("#modal-answer");
const closeAnsButton = modalAns.querySelector(".close");
const createABtn = modalAns.querySelector(".submit");

let currentQuestionNode= null;

askBtn.addEventListener("click", () => {
  modal.showModal();
});

closeBtn.addEventListener('click', () => {
  modal.close();
});

closeAnsButton.addEventListener('click', () => {
  modalAns.close();
  currentQuestionNode= null;
});

function showModalAns(event, button) {
  event.preventDefault();
  modalAns.showModal();

  const parent = button.parentNode;
  const questionNode = parent.children[0];
  currentQuestionNode = questionNode;
}

createABtn.addEventListener('click', async (event) => {
  if (currentQuestionNode !== null){
    event.preventDefault();
    const id = currentQuestionNode.getAttribute("_id");
    const enterAns = modalAns.querySelector("#answer-text").value;
    const response = await fetch(`http://localhost:3000/questions/${id}/${enterAns}`, {
      method: "POST"
    });

    modalAns.close();

    const data = await response.json();

    if (data.hasOwnProperty("error")){
      console.log("Error: ", data.error);
    }
    else { // data.answers
      const parent = currentQuestionNode.parentNode;
      const ansContainer = parent.querySelector(".ans-section");
      while (ansContainer.firstChild) {
        ansContainer.removeChild(ansContainer.firstChild);
      }

      data.answers.forEach((ans)=>{
        const answNode = document.createElement("li");
        answNode.className = "answer";
        answNode.textContent = ans;
        ansContainer.appendChild(answNode);
      });
    }

    currentQuestionNode = null;
  }
});

createQBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const enterQuestion = document.querySelector("#question-text").value;
  const response = await fetch("http://localhost:3000/questions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({question: enterQuestion}),
  });

  modal.close();


  const data = await response.json();
  if (data.hasOwnProperty("error")){
    console.log("Error: ", data.error);
  }
  else {
    const mainPg = document.querySelector("main");
    const container = document.createElement("div");

    const questionNode = document.createElement("p");
    questionNode.className = "question";
    questionNode.textContent = data.question;
    questionNode.setAttribute("_id", data._id);

    container.appendChild(questionNode);

    const containerAns = document.createElement("div");
    containerAns.className = "ans-section";
    container.appendChild(containerAns);

    const addAnsBtn = document.createElement("button");
    addAnsBtn.id = "btn-add-modal-question";
    addAnsBtn.textContent = "Add an answer";

    addAnsBtn.addEventListener("click", function(event){
      showModalAns(event, this);
    });

    container.appendChild(addAnsBtn);
    mainPg.appendChild(container);
  }
});


function createElement(type, attrs, ...children) {
  const ele = document.createElement(type);

  for (const prop in attrs) {
    if (attrs.hasOwnProperty(prop)) {
      ele.setAttribute(prop, attrs[prop]);
    }
  }

  children.forEach(c => ele.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return ele;
}

document.addEventListener('DOMContentLoaded', async function() {
  const response = await fetch("http://localhost:3000/questions", {
      method: "GET"
  });

  if (response.status === 404){
    console.log("Cannot access server's API");
  }
  else{

    const data = await response.json();
    const mainPg = document.querySelector("main");
    data.forEach((ele) => {
      const question = ele.question;
      const answers = ele.answers;
      const container = document.createElement("div");
      container.className = "Q&A section";

      const questionNode = document.createElement("p");
      questionNode.className = "question";
      questionNode.textContent = question;
      questionNode.setAttribute("_id", ele._id);

      container.appendChild(questionNode);

      const containerAns = document.createElement("div");
      containerAns.className = "ans-section";

      answers.forEach((ans)=>{
        const answNode = document.createElement("li");
        answNode.className = "answer";
        answNode.textContent = ans;
        containerAns.appendChild(answNode);
      });

      container.appendChild(containerAns);

      const addAnsBtn = document.createElement("button");
      addAnsBtn.id = "btn-add-modal-question";
      addAnsBtn.textContent = "Add an answer";
      addAnsBtn.addEventListener("click", function(event){
        showModalAns(event, this);
      });

      container.appendChild(addAnsBtn);
      mainPg.appendChild(container);
    });
  }
}); 