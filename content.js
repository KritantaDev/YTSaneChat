/*
content.js

Livestream chat quality filter for Youtube

How it's done:
Due to messages getting deleted when scrolled too far back, simple css rules wasn't enough.

First, we hide the original chat container, and make our own on top of it.

Then we listen for elements to be added to the original chat container, and
    pull them out, check the quality, and add non-spam to our new, visible container.

Author: _kritanta (@arm64e)
Date: 27/3/2021
*/
var sheets = document.styleSheets;
var sheet = document.styleSheets[sheets.length - 1];

var hiderule = "opacity:0 !important;";
var showrule = "display:block!important;";

var membermsgcount = 0;

sheet.insertRule(`.yt-live-chat-item-list-renderer #item-offset #items {${hiderule}}`);
sheet.insertRule(`div#item-offset {height: fit-content!important;}`);

/* hide dono bar */
sheet.insertRule("yt-live-chat-ticker-renderer {display: none !important;}");
/* remove pfp */
sheet.insertRule("#ytsaneitems yt-img-shadow {display: none !important;}");

const targetNode = document.getElementsByClassName('yt-live-chat-item-list-renderer')[0].children[0].querySelector('#item-offset #items');
const newChatView = targetNode.cloneNode(true);
newChatView.setAttribute("id", "ytsaneitems");
document.getElementsByClassName('yt-live-chat-item-list-renderer')[0].children[0].querySelector('#item-offset').appendChild(newChatView);

var memberMessages = []

// Detirmine percentage of capitalized letters (return as float 0-1)
function capitalized (str) {
    var len = str.length,
        noCapitals = str.replace(/[a-z]/g,''),
        percent = (noCapitals.length/len) * 100;
    return parseFloat(percent.toFixed(2));
}

// Ignore messages from non channel members
function shouldProcessMessage(message)
{
    if (message.getAttribute("author-type") != "")
        return true;

    return false;
}

// Filter messages based on the content of them
function processMessage(message)
{
    var content = message.querySelector('#message').innerText;
    // Block all-caps messages
    // (We could just edit them, but this drastically improves quality)
    if (capitalized(content) > 0.3)
        return false;
    
    // Block emoji spam.
    if (content == "")
        return false;
    
    return true;
}


const callback = function(mutationsList, observer) 
{
    for(const mutation of mutationsList) 
    {
        if (mutation.type === 'childList') 
        {
            // Messages in spammy streams are rendered in batches
            for (const item of mutation.addedNodes) 
            {
                if (item.localName == "yt-live-chat-text-message-renderer") 
                {
                    if (item.getAttribute("class") && item.className.includes('ytsanechat-show'))
                        continue;

                    if (shouldProcessMessage(item))
                    {
                        item.setAttribute("id", "ytsanechat-" + item.getAttribute("id"));
                        item.classList.add("ytsanechat-show");

                        if (processMessage(item))
                            newChatView.appendChild(item);
                    }
                }

            }
        }
        
    }
};

const config = { attributes: false, childList: true, subtree: true };
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);