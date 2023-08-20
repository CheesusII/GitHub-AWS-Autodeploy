const generateUUID = function() {
        let d = new Date().getTime();//Timestamp
        let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'Axxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            // eslint-disable-next-line
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}

export {generateUUID};

function escapeRegExp(text) {
    return text.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export {escapeRegExp};
  
const replaceTextWithClass = function(searchText, replacementText, className) {
const elementsWithClassName = document.querySelectorAll(`[class*="${className}"]`);
const escapedSearchText = escapeRegExp(searchText);
const regex = new RegExp(escapedSearchText, 'g');

elementsWithClassName.forEach(element => {
    for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];

    if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent;
        const replacedText = textContent.replace(regex, replacementText);

        if (replacedText !== textContent) {
        // Replace the text content of the node with the replaced text
        node.textContent = replacedText;
        }
    }
    }
});
}
export {replaceTextWithClass};


function addClassToDescendants(clickedElement, className) {
    const descendants = clickedElement.getElementsByTagName('*');
  
    // Convert HTMLCollection to an array to use forEach
    const descendantsArray = Array.from(descendants);
  
    descendantsArray.forEach(element => {
      element.classList.add(className);
    });
  }

export {addClassToDescendants};

function getTextInsideDiv(className) {
  if (className === "") {
    return "";
  }

  if (className.startsWith(".")) {
    className = className.substring(1);
  }


    const element = document.querySelector(`.${className}`);
    if (element && element.tagName === "DIV") {
      return element.textContent;
    }
  return "";
  }

export {getTextInsideDiv};