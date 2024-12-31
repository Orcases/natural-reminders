import { mountSlidePanel } from './mount';

// Track panel visibility
let isPanelVisible = false;

interface ToggleMessage {
  type: 'TOGGLE_PANEL';
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((
  request: ToggleMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { success: boolean }) => void
) => {
  if (request.type === 'TOGGLE_PANEL') {
    isPanelVisible = !isPanelVisible;
    mountSlidePanel(isPanelVisible);
    sendResponse({ success: true });
  }
});
