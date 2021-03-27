var sheets = document.styleSheets;
var sheet = document.styleSheets[sheets.length - 1];

// hide all messages by default
sheet.insertRule("yt-live-chat-text-message-renderer {display: none!important;}");
// override previous and show member messages
sheet.insertRule("yt-live-chat-text-message-renderer[author-type=\"member\"] {display: inherit!important;}");
// hide new member messages
sheet.insertRule("yt-live-chat-membership-item-renderer[show-only-header] {display: none!important;}");
/* hide donos */
sheet.insertRule("yt-live-chat-paid-message-renderer {display: none !important;}");
/* hide dono bar */
sheet.insertRule("yt-live-chat-ticker-renderer {display: none !important;}");
/* remove pfp */
sheet.insertRule("yt-img-shadow {display: none !important;}");
/* remove stickers */
sheet.insertRule("yt-live-chat-paid-sticker-renderer {display: none !important;}");
/* remove "welcome to live chat" */
sheet.insertRule("yt-live-chat-viewer-engagement-message-renderer {display: none !important;}");