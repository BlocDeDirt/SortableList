const ITEMS = [
    1,
    2,
    3,
    "4 <br>(╯°□°）╯︵ ┻━┻ FLIP THE GOD DAMN TABLE",
    5,
    6,
    "7 <br> BAGUETTE HON HON HON",
    8,
    9,
    "10 <br><br><br>test",
    11,
    "12<br><br><br>(/≧▽≦)/ <br><br>",
    13,
    14,
    15, 16, 17, 18, 19, 20, 21, 22, 23];
const CONTAINER = document.querySelector(".container");

let gapBetweenCards = 0;
let valueToTranslateDraggable = 0;

let newCursorPosition = {
    x: 0,
    y: 0
}

let startCursorPosition = {
    x: 0,
    y: 0
};

let newIndexDraggedItem = -1;
let oldIndexDraggedItem = -1;


/**@type {HTMLDivElement} */
const CLONE_DRAGGABLE_ITEM = document.querySelector(".clone");

/**@type {HTMLElement[]} */
let itemElements = [];
createList();


function createList() {
    clearContainer();
    appendCardsToContainer();

    itemElements = Array.from(CONTAINER.querySelectorAll("div.card"));

    if (itemElements.length >= 2) {
        gapBetweenCards = (itemElements[1].getBoundingClientRect().bottom - itemElements[0].getBoundingClientRect().top) - (itemElements[1].getBoundingClientRect().height + itemElements[0].getBoundingClientRect().height);
    }

    valueToTranslateDraggable = 0;
}

function clearContainer() {
    while (CONTAINER.firstChild) {
        CONTAINER.removeChild(CONTAINER.firstChild);
    }
}

function appendCardsToContainer() {
    ITEMS.forEach((item, index) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = "card #" + item;

        addEventListenerToCard(card, index);

        CONTAINER.appendChild(card);
    });
}

/**
 * @param {HTMLDivElement} card 
 */
function addEventListenerToCard(card, index) {
    card.addEventListener("mousedown", (e) => {
        newIndexDraggedItem = index;
        oldIndexDraggedItem = index;

        card.classList.add("opacity-25");

        CLONE_DRAGGABLE_ITEM.innerHTML = card.innerHTML;
        CLONE_DRAGGABLE_ITEM.style.width = card.getBoundingClientRect().width + "px";
        CLONE_DRAGGABLE_ITEM.style.display = "block";
        CLONE_DRAGGABLE_ITEM.style.transform = `translate(${card.getBoundingClientRect().left}px, ${card.getBoundingClientRect().top}px)`
        startCursorPosition.x = e.clientX;
        startCursorPosition.y = e.clientY;

        document.addEventListener("mousemove", documentOnMouseMove);
        document.addEventListener("mouseup", documentOnMouseUp);
    });
}


/**
 * @param {MouseEvent} e 
 */
function documentOnMouseMove(e) {
    sortList(e);
}


/**
 * 
 * @param {MouseEvent} e 
 * @param {boolean|undefined} isCursorMovingUp_ 
 */
function sortList(e, isCursorMovingUp_ = undefined) {
    isCursorMovingUp_ = isCursorMovingUp_ ?? isCursorMovingUp(e.clientY);

    updateDraggableClonePosition(e);
    let copyNewIndex = -1;
    let newIndex = -1;



    //a bit of duplicate code with this if else but WHAT ARE YOU GONNA DO (╯°□°）╯︵ ┻━┻
    if (isCursorMovingUp_) {
        newIndex = itemElements.findIndex((element, index) => index < newIndexDraggedItem && (element.getBoundingClientRect().bottom - element.getBoundingClientRect().height / 3) > CLONE_DRAGGABLE_ITEM.getBoundingClientRect().top);

        if (newIndex == -1) return;

        copyNewIndex = newIndex;

        while (newIndex < newIndexDraggedItem) {
            valueToTranslateDraggable -= itemElements[newIndex].getBoundingClientRect().height + gapBetweenCards;
            itemElements[newIndex].style.transform = itemElements[newIndex].style.transform ? "" : `translateY(${CLONE_DRAGGABLE_ITEM.getBoundingClientRect().height + gapBetweenCards}px)`;

            newIndex++;
        }
    } else {
        newIndex = itemElements.findLastIndex((element, index) => index > newIndexDraggedItem && (element.getBoundingClientRect().top + element.getBoundingClientRect().height / 3) < CLONE_DRAGGABLE_ITEM.getBoundingClientRect().bottom);

        if (newIndex == -1) return;

        copyNewIndex = newIndex;

        while (newIndex > newIndexDraggedItem) {
            valueToTranslateDraggable += itemElements[newIndex].getBoundingClientRect().height + gapBetweenCards;
            itemElements[newIndex].style.transform = itemElements[newIndex].style.transform ? "" : `translateY(-${CLONE_DRAGGABLE_ITEM.getBoundingClientRect().height + gapBetweenCards}px)`;
            newIndex--;
        }

    }

    //reorganize the array in function of WHAT THE HECK IS GOING OWN WITH THE TRANSLATE Y
    let newVisualPlace = itemElements.splice(newIndexDraggedItem, 1);
    itemElements.splice(copyNewIndex, 0, newVisualPlace[0]);

    newIndexDraggedItem = copyNewIndex;

    itemElements[newIndexDraggedItem].style.transform = `translateY(${(valueToTranslateDraggable)}px)`;
}


function documentOnMouseUp() {
    clearInterval(interval);
    CLONE_DRAGGABLE_ITEM.style.display = "none";
    document.removeEventListener("mousemove", documentOnMouseMove);
    document.removeEventListener("mouseup", documentOnMouseUp);

    itemElements[newIndexDraggedItem].classList.remove("opacity-25");

    //Update the order of the items
    let value = ITEMS.splice(oldIndexDraggedItem, 1);
    ITEMS.splice(newIndexDraggedItem, 0, value[0]);
    console.log(ITEMS);

    oldIndexDraggedItem = -1;
    newIndexDraggedItem = -1;

    createList();
}

function isCursorMovingUp(y) {
    return y < startCursorPosition.y;
}

let interval = null;
let scrollPosition = 0;

/**
 * @param {MouseEvent} e 
 */
function updateDraggableClonePosition(e) {
    clearInterval(interval)



    newCursorPosition.x = startCursorPosition.x - e.clientX;
    newCursorPosition.y = startCursorPosition.y - e.clientY;

    startCursorPosition.x = e.clientX;
    startCursorPosition.y = e.clientY;




    CLONE_DRAGGABLE_ITEM.style.transform = `translate(${CLONE_DRAGGABLE_ITEM.getBoundingClientRect().left - newCursorPosition.x}px, ${CLONE_DRAGGABLE_ITEM.getBoundingClientRect().top - newCursorPosition.y}px)`;

    //junky stuff to make the page scroll
    if (CLONE_DRAGGABLE_ITEM.getBoundingClientRect().top < 100) {
        interval = setInterval(() => {
            scrollPosition = document.documentElement.scrollTop;
            document.documentElement.scroll({ top: scrollPosition - 20 });
            sortList(e, true);
        }, 33);
    }

    else if ((CLONE_DRAGGABLE_ITEM.getBoundingClientRect().bottom + 100) > window.innerHeight) {
        interval = setInterval(() => {
            scrollPosition = document.documentElement.scrollTop;
            document.documentElement.scroll({ top: scrollPosition + 20 });
            sortList(e, false);
        }, 33);

    }

}

