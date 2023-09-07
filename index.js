const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8080;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());


// API endpoint for code conversion
app.post("/api/convert", async (req, res) => {
  try {
    const { code, language } = req.body;
    // console.log(code, language);

    if (!code) {
      return res.json({ result: "Code is not valid." });
    }

    const result = await callOpenAIConversionAPI(code, language);
    // console.log(result);
    res.json({ result });
  } catch (error) {
    console.error("Error converting code:", error.message);
    res.status(500).json({ error: "Error converting code." });
  }
});


// API endpoint for code debugging
app.post("/api/debug", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.json({ debuggedCode: "Code is not valid." });
    }

    const debuggedCode = await callOpenAIDebugAPI(code);
    res.json({ debuggedCode });
  } catch (error) {
    console.error("Error debugging code:", error.message);
    res.status(500).json({ error: "Error debugging code." });
  }
});


// API endpoint for code quality assessment
app.post("/api/quality", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.json({ qualitySummary: "Code is not valid." });
    }

    const qualitySummary = await callOpenAIQualityAPI(code);
    res.json({ qualitySummary });
  } catch (error) {
    console.error("Error getting code quality report:", error.message);
    res.status(500).json({ error: "Error getting code quality report." });
  }
});




async function callOpenAIConversionAPI(code, language) {
  const prompt = `Develop a Code Converter application that takes the following code snippet as input and converts it to ${language}. Your task is to provide the converted code.

Input Code:
${code}

Please provide the converted code in ${language}. Ensure that the converted code maintains the functionality and logic of the original code as closely as possible. Handle any language-specific syntax differences effectively. The converted code should be well-structured and adhere to the syntax of ${language}.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 500,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}


async function callOpenAIDebugAPI(code) {
  const prompt = `You are tasked with debugging and optimizing the provided code snippet. Please replace the placeholder below with your code and any necessary corrections or optimizations you deem appropriate to enhance its functionality and overall quality.

Input Code:
${code}

Review Note:
Please provide a brief note explaining the key changes you made during debugging and optimization. Highlight any significant improvements to functionality, readability, maintainability, and adherence to best coding practices. Your note should offer insights into the enhancements you applied.

Debugged and Optimized Code:
# Replace this section with your debugged and optimized code

Your task is to debug the code, optimize it for improved performance and readability, and provide the updated code along with a review note. Please make the necessary corrections and optimizations to enhance the code quality.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 500,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}


async function callOpenAIQualityAPI(code) {
  const prompt = `You are developing a Code Quality Check application designed to assess the quality of a given code snippet. Your application should take the following code as input, evaluate it based on various quality parameters, and generate a quality assessment report in the following format:

Summary of Code Quality Assessment:

Overall, the provided code is well-written and adheres to standard coding practices. The code is consistent, readable, and follows good naming conventions. The code has proper error handling, and the code complexity is low. The code duplication is not present, and the code is easily testable and modifiable.

Below is a percentage-wise evaluation of each parameter:
1. Code Consistency: [Code Consistency Score]%
2. Code Performance: [Code Performance Score]%
3. Code Documentation: [Code Documentation Score]%
4. Error Handling: [Error Handling Score]%
5. Code Testability: [Code Testability Score]%
6. Code Modularity: [Code Modularity Score]%
7. Code Complexity: [Code Complexity Score]%
8. Code Duplication: [Code Duplication Score]%
9. Code Readability: [Code Readability Score]%

Detailed explanation of each parameter is as follows:
1. Code Consistency: [Explain Code Consistency]
2. Code Performance: [Explain Code Performance]
3. Code Documentation: [Explain Code Documentation]
4. Error Handling: [Explain Error Handling]
5. Code Testability: [Explain Code Testability]
6. Code Modularity: [Explain Code Modularity]
7. Code Complexity: [Explain Code Complexity]
8. Code Duplication: [Explain Code Duplication]
9. Code Readability: [Explain Code Readability]

Input Code:
${code}

Your task is to provide the quality assessment report with scores, ratings, and detailed explanations for each specified parameter based on the analysis of the provided code.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 500,
    temperature: 0.7,
  });
  return response.data.choices[0].text.trim();
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
