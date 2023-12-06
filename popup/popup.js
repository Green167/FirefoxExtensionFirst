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

const onStartObserver = async e => {
    const tab = await getPNTab();

    const sending = browser.tabs.sendMessage(tab.id, { type: 'START' });
}

const stopBtn = document.getElementsByClassName('stop-observer');
stopBtn[0].addEventListener('click', onStopObserver);

const resumeBtn = document.getElementsByClassName('start-observer');
resumeBtn[0].addEventListener('click', onStartObserver);