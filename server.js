const express = require("express");

const app = express();

const PORT = process.env.PORT || 10000;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

app.use(express.json());


// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "My AI Search Server is running",
    gemini: false
  });
});


// ==============================
// SEARCH
// ==============================

app.get("/search", async (req, res) => {

  try {

    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Missing search query"
      });
    }


    // Check API key
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GOOGLE_API_KEY is not configured"
      });
    }


    // Check Search Engine ID
    if (!GOOGLE_CX) {
      return res.status(500).json({
        success: false,
        error: "GOOGLE_CX is not configured"
      });
    }


    // Google Custom Search API
    const url =
      "https://www.googleapis.com/customsearch/v1" +
      "?key=" + encodeURIComponent(GOOGLE_API_KEY) +
      "&cx=" + encodeURIComponent(GOOGLE_CX) +
      "&q=" + encodeURIComponent(query) +
      "&num=10";


    const response = await fetch(url);


    const data = await response.json();


    if (!response.ok) {

      return res.status(response.status).json({
        success: false,
        error: "Google Search failed",
        details: data
      });

    }


    // Convert Google's results
    const results = (data.items || []).map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));


    res.json({

      success: true,

      query: query,

      totalResults:
        data.searchInformation?.formattedTotalResults || "0",

      results: results

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {

  console.log(
    `My Search Server running on port ${PORT}`
  );

});
