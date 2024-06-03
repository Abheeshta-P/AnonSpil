       // dom access
        let sendBtn = document.querySelector('.btn-send');
        let anonymousMessage = document.querySelector('#input-text');
        let popupDisplay = document.querySelector('.popup');
        let popupImage = document.querySelector('.popup img');
        let randomizeBtn = document.querySelector('.random');

        //settimer id of popup and reset logic
        let idPopupTimer,idResetUI;

        //randomization array's for question and gif
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

        //random number generator
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //gif displayer using randomNumber
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

        // random question generator
        function questionGenerator() {
            let random = randomNumber(1, 10);
            return questionArray[random];
        }

        // ****** Web hook logic ******

        //uses discord channel
        let webhookUrl = 'https://discord.com/api/webhooks/1246783591778877461/xRRgth9W4ZUHKfRQlbXIXATZEXGLeB_mOS227sztXDzuhQnBTBJBRgwQ_YJrt7vt13FH';

        // Send message via webhook
        function sendDiscordMessage(message) {
            sendBtn.disabled = true;
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
            }).finally(() => {
               sendBtn.disabled = false; // Re-enable the button after sending
              });
        }

        //after sending message to discord update the gif and button
        function updateButtonAndGif(messageSent) {
            if (messageSent) {
                anonymousMessage.value = '';
                sendBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" class="svg-sent">
                                        <path fill="green" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path>
                                        <polyline fill="none" stroke="white" stroke-miterlimit="10" stroke-width="4" points="14,24 21,31 36,16"></polyline>
                                    </svg> <span>Sent</span>`;
                gifDisplayer('success');
            } else {
                sendBtn.innerHTML = `<div class="svg-wrapper-1">
                                        <div class="svg-wrapper">
                                        <?xml version="1.0"?><!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN' 'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'><svg height="24" style="overflow:visible;enable-background:new 0 0 24 24" viewBox="0 0 24 24" width="24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="12" cy="12" id="BG" r="12" style="fill:#D72828;"/><path d="M11,20h2v-2h-2V20z M11,5v10h2V5H11z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>
                                        </div>
                                    </div><span>Error</span>`;
                gifDisplayer('error');
            }
            popupDisplay.classList.add('popup-visible');
        }

        //reset button ui
        function resetButtonUI(){
            sendBtn.innerHTML = `<div class="svg-wrapper-1">
            <div class="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                </svg>
            </div>
            </div><span>Send</span>`;
        }

        // ************** Event listeners ******************

        //1. on button click send the message in message box
        sendBtn.addEventListener('click', () => {

            // If valid message
            if (anonymousMessage.value !== '') {
                sendBtn.innerHTML = `Sending`;
                sendDiscordMessage(anonymousMessage.value).then(messageSent => updateButtonAndGif(messageSent));
                
                // Reset UI after timeout (even if message fails)

                clearTimeout(idResetUI)
                idResetUI=setTimeout(() => {
                   resetButtonUI();
                    popupDisplay.classList.remove('popup-visible');
                    popupImage.src='';
                }, 8000);
            } 

            // Handle case of no valid message / empty message
            else {
                resetButtonUI();
                clearTimeout(idPopupTimer);
                idPopupTimer = setTimeout(() => {
                    popupDisplay.classList.remove('popup-visible');
                    popupImage.src='';
                },6000);
                gifDisplayer('nomsg');
                popupDisplay.classList.add('popup-visible');
            }
        });

        // 2. random question on clicking dice
        randomizeBtn.addEventListener('click', () => {
            let randomQn = questionGenerator();
            anonymousMessage.value = randomQn;
        });

// By Abheeshta.P