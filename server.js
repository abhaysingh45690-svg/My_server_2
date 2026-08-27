const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

// Your Google Programmable Search Engine ID
const CX = "1652283cfb4fc4da2";

// Your Google API key should be added in Render Environment Variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;


// Home / server test
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "My AI Search Server is running"
    });
});


// Search
app.get("/search", async (req, res) => {

    try {

        const query = req.query.q;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: "Missing search query"
            });
        }

        if (!GOOGLE_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "GOOGLE_API_KEY is not configured"
            });
        }


        const url =
            "https://www.googleapis.com/customsearch/v1" +
            "?key=" + encodeURIComponent(GOOGLE_API_KEY) +
            "&cx=" + encodeURIComponent(CX) +
            "&q=" + encodeURIComponent(query);


        const response = await fetch(url);

        const data = await response.json();


        if (!response.ok) {

            return res.status(response.status).json({
                success: false,
                error: "Google Search failed",
                details: data
            });

        }


        const results = (data.items || []).map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            displayLink: item.displayLink
        }));


        res.json({
            success: true,
            query: query,
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


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
