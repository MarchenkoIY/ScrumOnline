export const renderInfoMessange = text => {
    const placeForMessage = document.getElementsByClassName('infoMessages')[0],
        messageHTML = `
            <div class="infoMessage">
                <p>${text}</p>
            </div>
        `;

    placeForMessage.insertAdjacentHTML('beforeend', messageHTML);

    setTimeout(() => {
        document.getElementsByClassName('infoMessage')[0].remove();
    }, 3000);
}