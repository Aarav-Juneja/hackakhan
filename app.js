require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const {Configuration, OpenAIApi} = require("openai")
const { general, algebra1, algebra2, grade8_math, grade7_math, grade6_math, geometry, trigonometry, precalculus, AP_calculus_AB, AP_calculus_BC, AP_statistics } = require("./math-data")
const { grade6_history, grade7_history, grade8_history, grade9_history, grade10_history, grade11_history, grade12_history, AP_US_history, AP_world_history, AP_european_history} = require('./history-data')
const { grade6_science, grade7_science, grade8_science, biology, chemistry, physics, AP_biology, AP_physics, AP_chemistry} = require("./science-data")
const { grade6_english, grade7_english, grade8_english, grade9_english, grade10_english, grade11_english, grade12_english} = require("./english-data")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
  
app.set("view engine", "ejs")

app.use(express.text())
app.use(express.json())

const response2 = {
    data: {
        "id": "cmpl-7PzLIXMgrJsbYk9oRgttDm6MBh7ak",
        "object": "text_completion",
        "created": 1686428356,
        "model": "text-davinci-003",
        "choices": [
            {
                "text": "\n\n2^x refers to \"two to the power of x\". When",
                "index": 0,
                "logprobs": null,
                "finish_reason": "length"
            }
        ],
        "usage": {
            "prompt_tokens": 25,
            "completion_tokens": 16,
            "total_tokens": 41
        }
    }
}

const response3 = {
    data: {
        "id": "cmpl-7PzLIXMgrJsbYk9oRgttDm6MBh7ak",
        "object": "text_completion",
        "created": 1686428356,
        "model": "text-davinci-003",
        "choices": [
            {
                "text": "\n\nYour wrong, deal with it!",
                "index": 0,
                "logprobs": null,
                "finish_reason": "length"
            }
        ],
        "usage": {
            "prompt_tokens": 25,
            "completion_tokens": 16,
            "total_tokens": 41
        }
    }
}

app.post("/help", async (req, res)=>{
    // const response = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: `Give a hint for this question: "${req.body}"`,
    //     max_tokens: 16,
    // });
    
    const response = response2
    console.log(response.data)
    res.status(200).send(response.data)
})

app.post("/explain", async (req, res)=>{
    // const response = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: `Explain how to solve "${req.body}"`,
    //     max_tokens: 26,
    // });
    
    const response = response3
    console.log(response.data)
    res.status(200).send(response.data)
})

app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/features", (req, res) => {
    res.render("features")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/questions", (req, res) => {
    res.render("questions")
})

app.get("/scoring", (req, res) => {
    res.render("scoring")
})

app.post("/data/", (req, res) => {
    list = eval(req.body.data)
    console.log(req)
    var item = list[Math.floor(Math.random()*list.length)];
    while (req.body.not.includes(item.question)) {
        var item = list[Math.floor(Math.random()*list.length)];
        // item1= eval(`${req.body}[${req.params.id}]`)
    }
    res.send(item)
})

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'))
// })

app.listen(3000, () => {
    console.log("Server listening")
})