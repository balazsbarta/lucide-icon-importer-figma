// UI script that runs in the plugin's iframe
console.log('UI loaded');

interface ImportOptions {
  createComponents: boolean;
  includeKeywords: boolean;
  organizeByCategory: boolean;
}

const importBtn = document.getElementById('import-btn') as HTMLButtonElement;
const progressDiv = document.getElementById('progress') as HTMLDivElement;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
const progressText = document.getElementById('progress-text') as HTMLDivElement;

importBtn.addEventListener('click', () => {
  console.log('Import button clicked');
  
  const options: ImportOptions = {
    createComponents: (document.getElementById('createComponents') as HTMLInputElement).checked,
    includeKeywords: (document.getElementById('includeKeywords') as HTMLInputElement).checked,
    organizeByCategory: (document.getElementById('organizeByCategory') as HTMLInputElement).checked,
  };
  
  console.log('Options:', options);
  
  importBtn.disabled = true;
  progressDiv.style.display = 'block';
  
  console.log('Sending message to parent');
  parent.postMessage({
    pluginMessage: {
      type: 'import-icons',
      options
    }
  }, '*');
});

// Listen for messages from the main thread
window.onmessage = (event) => {
  const { type, data } = event.data.pluginMessage || {};
  
  switch (type) {
    case 'progress':
      updateProgress(data.current, data.total, data.message);
      break;
    case 'complete':
      importBtn.disabled = false;
      progressDiv.style.display = 'none';
      break;
    case 'error':
      importBtn.disabled = false;
      progressDiv.style.display = 'none';
      alert(`Error: ${data.message}`);
      break;
  }
};

function updateProgress(current: number, total: number, message: string) {
  const percentage = Math.round((current / total) * 100);
  progressFill.style.width = `${percentage}%`;
  progressText.textContent = `${message} (${current}/${total})`;
}
