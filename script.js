let buttonSend = document.querySelector('.btn-send');
        let anonymousMessage = document.querySelector('#input-text');
        let popupDisplay = document.querySelector('.popup');
        let popupImage = document.querySelector('.popup img');
        let randomizeBtn = document.querySelector('.random');
        let sent = false;
        let idTime;
        let popupTimer;
        let questionArray = [
            "Whom do you admire most?",
            "Whats your favourite place accept your hometown?",
            "What is your biggest dream?",
            "If you could have any superpower, what would it be?",
            "What's the most embarrassing thing that's ever happened to you?",
            "What hidden talent do you have?",
            "What is the one thing you would change about the world?",
            "What fictional world would you love to visit?",
            "What is your favorite thing about yourself?",
            "What is the most valuable lesson you've ever learned?",
            "At home or go out?"
        ];
        let successArray = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'];
        let failArray = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'];
        let emptyArray = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'];
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function gifDisplayer(sub) {
            let gifSrc;
            let random;
            if (sub === 'success') {
                random = randomNumber(1, 10);
                gifSrc = `s${random}`;
            } else if (sub === 'nomsg') {
                random = randomNumber(1, 10);
                gifSrc = `e${random}`;
            } else if (sub === 'error') {
                random = randomNumber(1, 6);
                gifSrc = `f${random}`;
            }
            gifSrc = popupImage.src = `image/gif/${sub}/${gifSrc}.gif`;
        }
        function questionGenerator() {
            let random = randomNumber(1, 10);
            return questionArray[random];
        }
        let webhookUrl = 'https://discord.com/api/webhooks/1246783591778877461/xRRgth9W4ZUHKfRQlbXIXATZEXGLeB_mOS227sztXDzuhQnBTBJBRgwQ_YJrt7vt13FH';
        // Send message via webhook
        function sendDiscordMessage(message) {
            return fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: message
                })
            }).then(response => {
                if (!response.ok) {
                    console.error('Error sending message to Discord:', response.statusText);
                    return false; // Indicate failed message delivery
                } else {
                    console.log('Message sent to Discord successfully!');
                    return true; // Indicate successful message delivery
                }
            });
        }
        function updateButtonAndGif(messageSent) {
            if (messageSent) {
                buttonSend.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" class="svg-sent">
                                        <path fill="green" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path>
                                        <polyline fill="none" stroke="white" stroke-miterlimit="10" stroke-width="4" points="14,24 21,31 36,16"></polyline>
                                    </svg> <span>Sent</span>`;
                gifDisplayer('success');
            } else {
                buttonSend.innerHTML = `<div class="svg-wrapper-1">
                                        <div class="svg-wrapper">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                <path fill="none" d="M0 0h24v24H0z"></path>
                                                <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                            </svg>
                                        </div>
                                    </div><span>Send</span>`;
                gifDisplayer('error');
            }
            popupDisplay.classList.add('popup-visible');
        }
        // Sender
        buttonSend.addEventListener('click', () => {
            // If valid message
            if (anonymousMessage.value !== '') {
                // Reset timeout for previous message (if any)
                clearTimeout(idTime);
                buttonSend.innerHTML = `Sending`;
                sendDiscordMessage(anonymousMessage.value).then(messageSent => updateButtonAndGif(messageSent));
                // Reset UI after timeout (even if message fails)
                setTimeout(() => {
                    anonymousMessage.value = '';
                    buttonSend.innerHTML = `<div class="svg-wrapper-1">
                                            <div class="svg-wrapper">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                                </svg>
                                            </div>
                                        </div><span>Send</span>`;
                    popupDisplay.classList.remove('popup-visible');
                }, 8000);
            } else {
                // Handle case of no valid message
                clearTimeout(popupTimer);
                popupTimer = setTimeout(() => {
                    popupDisplay.classList.remove('popup-visible');
                }, 8000);
                gifDisplayer('nomsg');
                popupDisplay.classList.add('popup-visible');
            }
        });
        // randomize
        randomizeBtn.addEventListener('click', () => {
            let randomQn = questionGenerator();
            anonymousMessage.value = randomQn;
        });