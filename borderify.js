document.body.style.border = "5px solid blue";

let observedGame = null;
let observedFight = null;

const observerConfig = { attributes: true, childList: true, subtree: true };

var LETSFIGHT = false;
var whatsGoingOn = '';
var prizedRecorded = false;
var fightsSiceLastReload = 14;
var tabId = null;

const callback = (mutationList, observer) => {
    const panels = document.getElementsByClassName('panel__name');
    const combatResult = [...panels].filter(a => a.textContent.includes('Combat Results'));
    const fighting = document.getElementsByClassName('fight__stat-row');
    const slotMachine = document.getElementsByClassName('slot-machine__container');
    const slotMachineChallenge = document.getElementsByClassName('slot-machine__challenge-btn');

    if (fighting.length > 0) {
        if (combatResult.length > 0) {
            if (prizedRecorded === true) {
                return;
            }
            whatsGoingOn = 'Combat End!';
            LETSFIGHT = false;
            const combatResultBtns = [...document.querySelectorAll('#fightContainer .panel .button__button')];
            const closeBtn = combatResultBtns.filter(b => b.textContent.includes('Close'));
            if (closeBtn.length > 0) {
                prizedRecorded = true;
                setTimeout(async function () {
                    let returnedPrizes = '';
                    const prizeElements = [...document.querySelectorAll('#fightContainer .panel > .j-panel .j-panel pre')];

                    prizeElements.map(p => returnedPrizes += ` ${p.textContent}`);

                    let summary = await browser.storage.local.get(['pnSlotFight', 'pnSlotPrizes']);

                    if (Object.keys(summary).length === 0) {
                        summary = {
                            pnSlotFight: 0,
                            pnSlotPrizes: [
                                ['S-Rank Secret Technique Scroll', 0],
                                ['C-Rank Secret Technique Scroll', 0],
                                ['B-Rank Secret Technique Scroll', 0],
                                ['A-Rank Secret Technique Scroll', 0],
                                ['Hand Grenade', 0]
                            ]
                        }
                    }

                    summary.pnSlotFight += 1;
                    summary.pnSlotPrizes.forEach(prize => {
                        if (returnedPrizes.includes(prize[0])) {
                            prize[1]++;
                        }
                    });

                    fightsSiceLastReload--;
                    browser.storage.local.set(summary);

                    closeBtn[0].click();
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
                if (fightsSiceLastReload <= 0) {
                    location.reload(true);
                } else {
                    slotMachineChallenge[0].click();
                }
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
        browser.storage.local.set({
            autoslot: false
        });
    } else if (request.type === 'START') {
        startObserve();
        browser.storage.local.set({
            autoslot: true
        });
    } else if (request.type === 'RELOAD') {
        location.reload(true);
    }
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

async function getAutoStartStatus() {
    const autoSlot = await browser.storage.local.get('autoslot');
    return Object.keys(autoSlot).length > 0 ? autoSlot.autoslot : false;
}

function openSlotMachine() {
    const slotMachine = document.getElementsByClassName('slot-machine__container');
    console.log(slotMachine.length)
    if (slotMachine.length > 0) {
        return;
    }

    const slotIcon = document.getElementsByClassName('slot-machine__icon');
    if (slotIcon.length > 0) {
        const slotIconBtn = slotIcon[0].querySelector('img');
        if (slotIconBtn) {
            slotIconBtn.click();
        }
    }
}

document.addEventListener('DOMContentLoaded', (e) => {
    setTimeout(async () => {
        const autoSlot = await getAutoStartStatus();
        //console.log(autoSlot);
        if (autoSlot) {
            startObserve();
            browser.runtime.sendMessage({ type: 'STARTOVER' })
            //console.log('asdsfsdf');
        }
    }, 4000);
})