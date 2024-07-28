document.getElementById('summarizeButton').addEventListener('click', () => {
  console.log('Button clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('Tabs queried', tabs);
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: summarizePage
    });
  });
});

async function summarizePage() {
  console.log('Summarize function called');
  const response = await fetch('http://localhost:8080/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: document.body.innerText })
  });
  const data = await response.json();
  console.log('Response received', data);
  alert(`TLDR: ${data.summary}`);
}
