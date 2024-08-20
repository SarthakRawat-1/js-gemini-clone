const sideNavigation = document.querySelector(".sideNavigation");
const sideBarToggle = document.querySelector(".fa-bars");
const startContentUl = document.querySelector(".startContent ul");
const inputArea = document.querySelector(".inputArea input");
const sendRequest = document.querySelector(".fa-paper-plane");
const chatHistory = document.querySelector(".chatHistory ul");
const startContent = document.querySelector(".startContent");
const chatContent = document.querySelector(".chatContent");
const results = document.querySelector(".results");

const promptQuestions = [
  {
    question: "What was the significance of Shogun?",
    icon: "fa-solid fa-wand-magic-sparkles",
  },
  {
    question: "Write a sample code to explain fetch() API",
    icon: "fa-solid fa-code",
  },
  {
    question: "How to become a Full Stack Developer",
    icon: "fa-solid fa-laptop-code",
  },
  {
    question: "Tell me about the historical climate change data.",
    icon: "fa-solid fa-database",
  },
];

window.addEventListener("load", () => {
  if (startContentUl) {
    // Ensure the element exists
    promptQuestions.forEach((data) => {
      let item = document.createElement("li");

      item.addEventListener("click", () => {
        getGeminiResponse(data.question, true);
      });

      item.innerHTML = `<div class="promptSuggestion">
            <p>${data.question}</p>
            <div class="icon"><i class="${data.icon}"></i></div>
          </div>`;

      startContentUl.append(item);
    });
  } else {
    console.error("The startContentUl element was not found.");
  }
});

sideBarToggle.addEventListener("click", () => {
  console.log("Before toggle:", sideNavigation.className);
  sideNavigation.classList.toggle("expandClose");
  console.log("After toggle:", sideNavigation.className);
});

inputArea.addEventListener("keyup", (e) => {
  if (e.target.value.length > 0) {
    sendRequest.style.display = "inline";
  } else {
    sendRequest.style.display = "none";
  }
});

sendRequest.addEventListener("click", () => {
  getGeminiResponse(inputArea.value, true);
});

function getGeminiResponse(question, appendHistory) {
  let historyLi = document.createElement("li");

  if (appendHistory) {
    historyLi.addEventListener("click", () => {
      getGeminiResponse(question, false);
    });

    historyLi.innerHTML = `<i class="fa-regular fa-message"></i> ${question}`;
    chatHistory.append(historyLi);
  }

  results.innerHTML = "";
  inputArea.value = "";

  startContent.style.display = "none";
  chatContent.style.display = "block";

  let resultTitle = `
  <div class="resultTitle">
  <img src = "cat.jpg">
  <p>${question}</p>
  </div>
  `;

  let resultData = `
  <div class="resultData">
  <img src = "googlesparkle.png">
  <div class = "loader">
  <div class = "animatedBG"></div>
  <div class = "animatedBG"></div>
  <div class = "animatedBG"></div>
  </div>
  </div>
  `;

  results.innerHTML += resultTitle;
  results.innerHTML += resultData;

  const API_KEY = "AIzaSyANu_gK5LJ5NemREUKeUAW3zD6dqNEB9dc";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  fetch(URL, {
    method: "POST",
    body: JSON.stringify({
      contents: [{ parts: [{ text: question }] }],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".results .resultData").remove();

      let responseData = jsonEscape(data.candidates[0].content.parts[0].text);

      let responseArray = responseData.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i == 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse +=
            "<strong>" +
            responseArray[i].split(" ").join("&nbsp") +
            "</strong>";
        }
      }

      let newResponse2 = newResponse.split("*").join(" ");

      let textArea = document.createElement("textarea");
      textArea.innerHTML = newResponse2;

      results.innerHTML += `
      <div class="resultResponse">
      <img src="googlesparkle.png">
      <p id="typeEffect"></p>
      </div>
      `;

      let newResponseData = newResponse2.split(" ");
      for (let j = 0; j < newResponseData.length; j++) {
        timeOut(j, newResponseData[j] + " ");
      }
    });
}

function newChat() {
  startContent.style.display = "block";
  chatContent.style.display = "none";
}

function jsonEscape(str) {
  return str
    .replace(new RegExp("\r?\n\n", "g"), "<br>")
    .replace(new RegExp("\r?\n", "g"), "<br>");
}

const timeOut = (index, nextWord) => {
  setTimeout(function () {
    document.getElementById("typeEffect").innerHTML += nextWord;
  }, 75);
};
