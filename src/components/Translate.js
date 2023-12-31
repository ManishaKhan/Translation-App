import React, { useEffect } from 'react'
import countries from '../data'



export const Translate = () => {

    useEffect(() => {
        const fromText = document.querySelector(".from-text");
        const toText = document.querySelector(".to-text");
        const selectTag = document.querySelectorAll("select");
        const icons = document.querySelectorAll(".row i");
        const translateBtn = document.querySelector("button");

        //for select the default language
        selectTag.forEach((tag, id) => {
          for (let country_code in countries) {
            let selected =
              id === 0
                ? country_code === "en-GB"
                  ? "selected"
                  : ""
                : country_code === "hi-IN"
                ? "selected"
                : "";
            let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
          }
        });


          //this is for, when delete the text, translation test  is also deleted
          fromText.addEventListener("keyup", () => {
            if (!fromText.value) {
              toText.value = "";
            }
          });

          //translation one language to another
          translateBtn.addEventListener("click", () => {
            let text = fromText.value.trim();
            let translateFrom = selectTag[0].value;
            let translateTo = selectTag[1].value;
            if (!text) return;
            toText.setAttribute("placeholder", "Translating...");
            let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
            fetch(apiUrl)
              .then((res) => res.json())
              .then((data) => {
                toText.value = data.responseData.translatedText;
                data.matches.forEach((data) => {
                  if (data.id === 0) {
                    toText.value = data.translation;
                  }
                });
                toText.setAttribute("placeholder", "Translation");
              });
          });

          //for voice and copy icon
          icons.forEach((icon) => {
            icon.addEventListener("click", ({ target }) => {
              if (!fromText.value || !toText.value) return;
              if (target.classList.contains("fa-copy")) {
                if (target.id === "from") {
                  navigator.clipboard.writeText(fromText.value);
                  alert("text copied")
                } else {
                  navigator.clipboard.writeText(toText.value);
                  alert("text copied")
                }
              } else {
                let utterance;
                if (target.id === "from") {
                  utterance = new SpeechSynthesisUtterance(fromText.value);
                  utterance.lang = selectTag[0].value;
                } else {
                  utterance = new SpeechSynthesisUtterance(toText.value);
                  utterance.lang = selectTag[1].value;
                }
                speechSynthesis.speak(utterance);
              }
            });
          });



},[])

  return (

    <>
    <div class="header">
  <h1>📃📄Translator App 📑📝</h1>
  
</div>

        <div className="container">
        <div className="wrapper">
          <div className="text-input">
            <textarea
              spellcheck="false"
              className="from-text"
              placeholder="Enter text"
            ></textarea>
            <textarea
              spellcheck="false"
              readonly
              disabled
              className="to-text"
              placeholder="Translation"
            ></textarea>
          </div>
          <ul className="controls">
            <li className="row from">
              <div className="icons">
                <i id="from" className="fas fa-volume-up"></i>
                <i id="from" className="fas fa-copy"></i>
              </div>
              <select></select>
            </li>
            <li className="exchange">
              <i class="fas fa-regular fa-language"></i>
            </li>
            <li className="row to">
              <select></select>
              <div className="icons">
                <i id="to" className="fas fa-volume-up"></i>
                <i id="to" className="fas fa-copy"></i>
              </div>
            </li>
          </ul>
        </div>
        <button>Translate Text</button>
      </div>
    </>
  )
}
