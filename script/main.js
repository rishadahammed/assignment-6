// loader functionality
const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("grid-container").classList.add("hidden");
  };
  const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("grid-container").classList.remove("hidden");
  };
  
  //  section hide /show
  const heroSection = document.getElementById("hero-section");
  const lessonSection = document.getElementById("lesson-section");
  const navBar = document.getElementById("nav");
  const faqSection = document.getElementById("faq");
  
  // log-out button functionality
  const logout = () => {
    location.reload(true);
  };
  
  // get started functionality
  document.getElementById("get-started-btn").addEventListener("click", () => {
    const password = document.getElementById("password-box").value;
    const nam = document.getElementById("name-box").value;
    document.getElementById(
      "modal-user"
    ).innerText = `Let's learn something new. `;
  
    if (nam !== "" && nam.trim().length > 0) {
      if (parseInt(password) === 123456) {
        heroSection.classList.add("hidden");
        lessonSection.classList.remove("hidden");
        navBar.classList.remove("hidden");
        faqSection.classList.remove("hidden");
        my_modal_1.showModal();
        window.scrollTo({
          behavior: "smooth",
          top: 0,
        });
      } else {
        alert("wrong password");
        return;
      }
    } else {
      alert("Please write your name");
    }
  });
  
  // button activeness
  const removeActiveClass = () => {
    const activeButtons = document.getElementsByClassName("active");
    for (let activeBtn of activeButtons) {
      activeBtn.classList.remove("active");
    }
  };
  
  //  fetch lesson button data
  const loadLessonBtn = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
      .then((res) => res.json())
      .then((data) => displayLessonBtn(data.data));
  };
  //  fetch lesson grid data
  const loadGridData = (btnId) => {
    showLoader();
    const gridURL = `https://openapi.programming-hero.com/api/level/${btnId}`;
    fetch(gridURL)
      .then((res) => res.json())
      .then((data) => displayGridData(data.data));
    const clickedBtn = document.getElementById(`btn-${btnId}`);
    removeActiveClass();
    clickedBtn.classList.add("active");
  };
  //  fetch details info
  const loadDetails = (detailBtnId) => {
    const detailsURL = `https://openapi.programming-hero.com/api/word/${detailBtnId}`;
    fetch(detailsURL)
      .then((res) => res.json())
      .then((data) => displayDetails(data.data));
  };
  
  // display lesson buttons
  const displayLessonBtn = (lessonBtns) => {
    for (const lessonBtn of lessonBtns) {
      const newlessonBtn = document.createElement("div");
      newlessonBtn.innerHTML = ` <button id= "btn-${lessonBtn.level_no}" onclick ="loadGridData(${lessonBtn.level_no})"
            class="btn text-blue-800 border-blue-800 hover:bg-blue-600 hover:text-white"
          >
            <i class="fa-solid fa-book-open"></i>Lesson-${lessonBtn.level_no}
          </button>`;
      document.getElementById("lesson-btn-container").appendChild(newlessonBtn);
    }
  };
  
  // display Grid data
  const displayGridData = (wordBoxes) => {
    let gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = "";
    if (wordBoxes.length === 0) {
      hideLoader();
      gridContainer.innerHTML = ` 
      <div
            class="bg-slate-100 mx-auto w-10/12  rounded-4xl text-center space-y-3 flex flex-col items-center col-span-3"
          >
            <img src="assets/alert-error.png" alt="" />
            <p class="font-hind">
              এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h1 class="text-4xl font-semibold font-hind">অন্য Lesson এ যান</h1>
          </div>
      `;
    }
    for (const wordBox of wordBoxes) {
      let newWordBox = document.createElement("div");
      newWordBox.innerHTML = `
      <div class="bg-white text-center rounded-lg p-13 shadow-md  lg:h-80 h-96 overflow-hidden  transition-all duration-400 hover:bg-slate-100 ">
            <div class="space-y-4 mb-10">
              <p class="font-semibold text-3xl">${wordBox.word}</p>
              <p class="text-lgl">Meaning/Pronounciation</p>
              <p class="font-hind font-semibold text-2xl">"${
                wordBox.meaning ? wordBox.meaning : "অর্থ নাই"
              } / ${wordBox.pronunciation}"  </p>
            </div>
            <div class="flex justify-between">
              <i onclick="loadDetails(${wordBox.id})" 
                class="fa-solid fa-circle-info bg-slate-300 p-2 rounded-xl text-2xl text-slate-700 cursor-pointer"
              ></i>
              <i  onclick="pronounceWord('${wordBox.word}')"
                class="fa-solid fa-volume-high bg-slate-300 p-2 rounded-xl text-xl text-slate-700 cursor-pointer"
              ></i>
            </div>
          </div>
      `;
  
      gridContainer.appendChild(newWordBox);
      hideLoader();
    }
  };
  // display details info
  const displayDetails = (detailsData) => {
    my_modal_2.showModal();
    document.getElementById("my_modal_2").innerHTML = `
   <div class="modal-box">
          <h3 class="text-3xl font-bold mb-5">
            ${detailsData.word} ( <i class="fa-solid fa-microphone-lines"></i> ${
      detailsData.pronunciation
    })
          </h3>
          <h4 class="font-semibold text-xl mb-1">Meaning</h4>
          <p class="text-xl mb-5 font-hind">${
            detailsData.meaning ? detailsData.meaning : "অর্থ নাই"
          }</p>
          <h4 class="font-semibold text-xl mb-1">Example</h4>
          <p class="text-xl mb-5">${detailsData.sentence}</p>
          <h4 class="text-xl mb-3 font-hind font-semibold">সমার্থক শব্দ গুলো</h4>
         <div id="synonym-buttons" class="flex gap-2 flex-wrap">  </div>
          <div class="modal-action justify-start">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn bg-blue-400 text-white font-light">
                Complete Learning
              </button>
            </form>
          </div>
        </div>
  
    `;
    // synonym button
    const synonymButtons = document.getElementById("synonym-buttons");
    synonymButtons.innerHTML = "";
    if (!detailsData.synonyms || detailsData.synonyms.length === 0) {
      synonymButtons.innerHTML = `<button class="btn">No similar word found at this time</button>`;
    } else {
      for (const synonym of detailsData.synonyms) {
        let synonymBtn = document.createElement("div");
        synonymBtn.innerHTML = `<button class="btn ">${synonym}</button>`;
        synonymButtons.appendChild(synonymBtn);
      }
    }
  };
  loadLessonBtn();
  // pronounce
  const pronounceWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; 
    window.speechSynthesis.speak(utterance);
  };
  