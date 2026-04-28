export async function analyzeSkinImage(base64Image: string, skinContext?: { skinType: string, concern: string, allergies: string }) {
  const model = "gemini-2.5-flash";
  
  const contextPrompt = skinContext ? `
    User Context:
    - Skin Type: ${skinContext.skinType}
    - Primary Concern: ${skinContext.concern}
    
    IMPORTANT: Tailor the recommended routine and product suggestions specifically for this skin type and avoid any generalized advice if specific context is given.
  ` : '';

  const prompt = `
    Analyze this skin image and detect potential skin diseases or conditions.
    ${contextPrompt}
    
    Provide the result in JSON format STRICTLY adhering to the following schema:
    {
      "disease": "Name of the condition (e.g., Acne, Contact Dermatitis, Healthy)",
      "confidence_score": 95, // integer (0-100)
      "severity": "Medium", // string: "High", "Medium", or "Low"
      "details": "A clear, professional, short clinical insight about the condition.",
      "recommendations": ["Hydrate well", "Apply SPF 50 daily", "Use gentle cleanser"], // array of 3-4 string sentences
      "precautions": ["Avoid direct sun", "Do not pop or scratch", "Avoid harsh scrubs"], // array of 3-4 string sentences
      "recommended_routine": {
        "morning": ["Gentle Cleanser", "Vitamin C Serum", "Moisturizer", "Sunscreen SPF 50"], // array of simple string steps
        "night": ["Cleansing Balm", "Gentle Cleanser", "Treatment/Active", "Rich Moisturizer"] // array of simple string steps
      },
      "is_body": false // true if the image is a body part (back, arm, leg, hands, torso), false if it is a face
    }
    
    If no disease is detected, return "Normal Skin" or "Healthy Skin" with routine maintenance steps.
  `;

  // process.env.GEMINI_API_KEY is replaced by Vite's define plugin during build
  const apiKey = process.env.GEMINI_API_KEY || '';
  const base64Data = base64Image.split(',')[1] || base64Image;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error details:", errText);
      throw new Error("Failed to analyze image with AI.");
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
       throw new Error("Empty response from AI");
    }

    return JSON.parse(textOutput);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
