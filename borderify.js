document.body.style.border = "5px solid blue";

var slotFights = 0;

var slotPrizes = [
    ['S-Rank Secret Technique Scroll', 0],
    ['C-Rank Secret Technique Scroll', 0],
    ['B-Rank Secret Technique Scroll', 0],
    ['A-Rank Secret Technique Scroll', 0],
    ['Hand Grenade', 0]
];

let observedGame = null;
let observedFight = null;

const observerConfig = { attributes: true, childList: true, subtree: true };

var LETSFIGHT = false;
var whatsGoingOn = '';
var prizedRecorded = false;
const callback = (mutationList, observer) => {
    const panels = document.getElementsByClassName('panel__name');
    const combatResult = [...panels].filter(a => a.textContent.includes('Combat Results'));
    const fighting = document.getElementsByClassName('fight__stat-row');
    const slotMachine = document.getElementsByClassName('slot-machine__container');
    const slotMachineChallenge = document.getElementsByClassName('slot-machine__challenge-btn');

    if (fighting.length > 0) {
        if (combatResult.length > 0) {
            if (prizedRecorded === true) {
                return false;
            }
            whatsGoingOn = 'Combat End!';
            LETSFIGHT = false;
            const combatResultBtns = [...document.querySelectorAll('#fightContainer .panel .button__button')];
            const closeBtn = combatResultBtns.filter(b => b.textContent.includes('Close'));
            if (closeBtn.length > 0) {
                prizedRecorded = true;
                let returnedPrizes = '';

                setTimeout(function () {
                    const prizeElements = [...document.querySelectorAll('#fightContainer .panel > .j-panel .j-panel pre')];

                    prizeElements.map(p => returnedPrizes += ` ${p.textContent}`);
                    slotFights++;
                    slotPrizes.forEach(prize => {
                        if (returnedPrizes.includes(prize[0])) {
                            prize[1]++;
                        }
                    });

                    closeBtn[0].click();
                    //console.log(slotFights);
                    //console.log(slotPrizes);
                }, 3500);
            }
        } else {
            whatsGoingOn = 'Fighting';
            prizedRecorded = false;
        }
    } else if (slotMachineChallenge.length > 0) {
        whatsGoingOn = 'Slot Machine';
        if (LETSFIGHT === false) {
            LETSFIGHT = true;
            setTimeout(() => {
                slotMachineChallenge[0].click();
            }, 1500)
        }
    }

    if (whatsGoingOn) {
        //console.log(whatsGoingOn);
    }
};

const observer = new MutationObserver(callback);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'STOP') {
        observer.disconnect();
    } else if (request.type === 'START') {
        startObserve();
    }
    sendResponse({ response: [slotFights, slotPrizes] })
});


function startObserve() {
    observedGame ??= document.getElementById("game-container");
    observedFight ??= document.getElementById("fightContainer");

    observer.observe(observedGame, observerConfig);
    observer.observe(observedFight, observerConfig);
}
//async function print() {
//    console.log(browser.extension.getURL('style.css'));
//    //await console.log(browser.tabs.query({ active: true, currentWindow: true }));
//}
//print();