async function sendMessage() {
    let tabs = await browser.tabs.query({ currentWindow: true, url: 'https://pockieninja.online/' });

    if (tabs.length > 0) {
        let tabId = tabs[0].id;

        const sending = browser.tabs.sendMessage(tabId, { request: 'Fighting' });
        sending.then(
            (message) => {
                console.log(message.response)
            }
        );
    }
}

//sendMessage()

async function getPNTab() {
    let tab = null;
    let tabs = await browser.tabs.query({ currentWindow: true, url: 'https://pockieninja.online/' });

    if (tabs.length > 0) {
        tab = tabs[0];
    }

    return tab;
}

const onStopObserver = async e => {
    const tab = await getPNTab();

    const sending = browser.tabs.sendMessage(tab.id, { type: 'STOP' });
}

const onResetStorage = async e => {
    browser.storage.local.clear();
}

const onStartObserver = async e => {
    const tab = await getPNTab();

    const sending = await browser.tabs.sendMessage(tab.id, { type: 'START' });
}

const onReloadPage = async e => {
    const tab = await getPNTab();

    const sending = await browser.tabs.sendMessage(tab.id, { type: 'RELOAD' });
}

const onFightArena = async e => {
    const tab = await getPNTab();
    const fighterNumber = document.getElementsByName('fighterNumber')[0].value;
    console.log(fighterNumber)
    const sending = await browser.tabs.sendMessage(tab.id, { type: 'FIGHT_ARENA', fighter: fighterNumber });
}

const stopBtn = document.getElementsByClassName('stop-observer');
stopBtn[0].addEventListener('click', onStopObserver);

const resumeBtn = document.getElementsByClassName('start-observer');
resumeBtn[0].addEventListener('click', onStartObserver);

const resetBtn = document.getElementsByClassName('reset-storage');
resetBtn[0].addEventListener('click', onResetStorage);

const reloadBtn = document.getElementsByClassName('reload-page');
reloadBtn[0].addEventListener('click', onReloadPage);

const fightArenaBtn = document.getElementsByClassName('fight-arena');
fightArenaBtn[0].addEventListener('click', onFightArena);

async function getPnSummary() {
    //await browser.storage.local.clear();
    const summary = await browser.storage.local.get(['pnSlotFight', 'pnSlotPrizes']);
    if (Object.keys(summary).length === 0) {
        return;
    }
    let prizeHTML = '';
    summary.pnSlotPrizes.forEach((p) => {
        prizeHTML += `<li>${p[0]}</li><li>x</li><li class="grid-item-price">${p[1]}</li>`;
    })
    
    document.getElementsByClassName('pn-fight')[0].textContent = summary.pnSlotFight;
    document.getElementsByClassName('pn-prize')[0].innerHTML = prizeHTML;
}

getPnSummary();