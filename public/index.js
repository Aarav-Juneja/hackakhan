$("#inputQuestions").hide()
$("#multipleChoiceQuestions").hide()
$("#spinner").hide()
$("#success").hide()
$("#fail").hide()
$("#ai_section").hide()
$("#force_next").hide()
question_data = {}
attempts = 0
score=0
list='general'

var audioElement = document.createElement('audio')
audioElement.setAttribute('src', 'success.mp3');

scoreSymbols = {
    0: "",
    1: "",
    2: ""
}

$("#submit").click(e => {
    if ($("#answer").val().toLowerCase().trim() == question_data.answer.toLowerCase().trim()) {
        $("#fail").hide()
        $("#success").show()
        audioElement.play()
    } else {
        aiwork()
        $("#success").hide()
        $("#fail").show()
    }
})

$("#submit2").click(e => {
    input = $('input[name=options]:checked').val();
    if (input == question_data.answer) {
        $("#fail").hide()
        $("#success").show()
        audioElement.play()
    } else {
        aiwork()
        $("#success").hide()
        $("#fail").show()
    }
})

$("#next, #next2").click(() => {
    nextQuestion()
})

$(".dropdown-item").click(async e => {
    $("#subject").html($(e.target).html())
    list=e.target.getAttribute('value');
    console.log(list)
    attempts=2 // Don't give points
    nextQuestion()
})

async function aiwork() {
    attempts += 1
    $("#ai_section").show()
    if (attempts == 1) {
        pre_data = await fetch("/help", {
            body: question_data.question,
            method: "POST"
        })
        data = await pre_data.json()
        $("#ai_response").html(data.choices[0].text)
    } else if (attempts == 2) {
        console.log("Failure")
        $("#submit2, #submit").prop("disabled", true)
        $("#force_next").show()
    }
}

function questionRecieved(data) {
    $("#inputQuestions").hide()
    $("#multipleChoiceQuestions").hide()
    if (data.type == "type the answer") {
        $("#inputQuestions").show()
    } else if (data.type == "multiple choice") {
        $("#multipleChoiceQuestions").show()
        for (let i = 0; i < data.choices.length; i++) {
            $("#multipleChoiceQuestionsOptions").prepend(``)
            $("#multipleChoiceQuestionsOptions").prepend(`
            <div class="form-check d-flex justify-content-center">
                <input class="form-check-input" value='${data.choices[i]}' name="options" type="radio" />
                <label class="form-check-label" for='${data.choices[i]}' >${data.choices[i]}</label>
            </div>`)
            $("#multipleChoiceQuestionsOptions .list-group-item").click(() => {
                $(this).addClass('active').siblings().removeClass('active')
            })
        }
    } else {
        console.log("PANIC")
    }
    
    $("#title").html(data.question)
}

async function nextQuestion() {
    scoreChange = Math.max(0, 2-attempts)
    score += scoreChange
    attempts = 0
    $("#score").html(score)
    $("#score_symbols").append(scoreSymbols[score])
    $("#success, #fail, #force_next").hide()
    $(".col").hide()
    $("#ai_section").hide()

    $("#submit2, #submit").prop("disabled", false)
    $("#answer").val("")
    $("#multipleChoiceQuestionsOptions").html("")
    $("#spinner").show()
    content = await fetch("/data/", {
        body: list,
        method: "POST"
    })
    question_data = await content.json()
    $("#spinner").hide()
    questionRecieved(question_data)
}