const http = require('http');
const url = require('url');

const people = [
    {
        person_id: "1004",
        first_name: "test",
        last_name: "4",
        email: "test4@test.com",
        active: 1
    }
]

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.setHeader(
        "Content-Type",
        "application/json"
    );

    if (req.method === "GET" && parsedUrl.pathname === "/ords/hr/people") {
        res.writeHead(200);
        res.end(JSON.stringify({
            items: people
        }));
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({
        error: "Not Found"
    }))
})

const PORT = process.env.PORT || 8181;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Mock oracle API running on http://localhost:8181")
})