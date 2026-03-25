const fs = require('fs');
const apiKey = "AIzaSyD6Chrluy3vbyt5q50vxNfqNQwC07nLPCk";

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      let output = "Allowed Models for this key:\n";
      data.models.forEach(m => {
        if (m.name.includes("gemini")) {
          output += `- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})\n`;
        }
      });
      fs.writeFileSync('models.json', output, 'utf8');
      console.log("Successfully wrote models to models.json in utf8 format.");
    } else {
      console.error("Error fetching models:", data);
    }
  } catch(e) {
    console.error("Fetch Error:", e);
  }
}

listModels();
