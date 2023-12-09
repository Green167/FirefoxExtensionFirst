async function getPNTab() {
    let tab = null;
    let tabs = await browser.tabs.query({ currentWindow: true, url: 'https://pockieninja.online/' });

    if (tabs.length > 0) {
        tab = tabs[0];
    }

    return tab;
}

async function reloadPnTabIfReachLimit() {
    const pnTab = await getPNTab();
    if (!pnTab) {
        return;
    }
    browser.tabs.reload(pnTab.id);
}

var notificationId = 'FF-PN-Update';
browser.runtime.onMessage.addListener((request) => {
    if (request.type === 'STARTOVER') {
        browser.notifications.create(
            notificationId,
            {
                type: 'basic',
                title: 'New',
                message: 'Something just happens!'
            }
        );
    }
});