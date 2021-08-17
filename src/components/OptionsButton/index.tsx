export const OptionsButton = () => (
  <button
    onClick={() => {
      if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage()
      else window.open(chrome.runtime.getURL('Options.html'))
    }}
  >
    Options
  </button>
)
