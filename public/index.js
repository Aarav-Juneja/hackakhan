$("#inputQuestions").hide()
$("#multipleChoiceQuestions").hide()
$("#spinner").hide()
$("#success").hide()
$("#fail").hide()
// $("#ai_section").css("visibility", "hidden")
$("#ai_section").hide()
$("#force_next").hide()
$("#score_symbols").hide()
$("#time_out").hide()
$("#done").hide()
question_data = {}
attempts = 0
score=0
list='general'
question_number = 0
used_questions = []
time_remaining = 300
var interval;

var audioElement = document.createElement('audio')
audioElement.setAttribute('src', 'success.mp3');

scoreSymbols = [
    "RED",
    "GOLD",
    "GREEN"
]

$("#submit").click(e => {
    if ($("#answer").val().toLowerCase().trim() == question_data.answer.toLowerCase().trim()) {
        $("#fail").hide()
        $("#success").show()
        audioElement.play()
        clearInterval(interval)
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
        clearInterval(interval)
    } else {
        aiwork()
        $("#success").hide()
        $("#fail").show()
    }
})

$("#next, #next2, #next3").click(() => {
    nextQuestion()
})

$(".dropdown-item").click(async e => {
    $("#start-header").html($(e.target).html())
    list=e.target.getAttribute('value');
    attempts=2 // Don't give points
    nextQuestion()
})

async function aiwork() {
    attempts += 1
    // $("#ai_section").css("visibility", "visible")
    $("#ai_section").show()
    if (attempts == 1) {
        pre_data = await fetch("/help", {
            body: question_data.question,
            method: "POST"
        })
        data = await pre_data.json()
        $("#ai_response").html(data.choices[0].text)
    } else if (attempts == 2) {
        pre_data = await fetch("/explain", {
            body: question_data.question,
            method: "POST"
        })
        data = await pre_data.json()
        $("#ai_response").html("Explanation: " + data.choices[0].text)
        $("#submit2, #submit").prop("disabled", true)
        $("#force_next").show()
        $("#correct_answer").html(question_data.answer)
        clearInterval(interval)
    }
}

function questionRecieved(data) {
    $("#inputQuestions").hide()
    $("#multipleChoiceQuestions").hide()
    used_questions.push(data.question)
    if (data.type == "type the answer") {
        $("#inputQuestions").show()
    } else if (data.type == "multiple choice") {
        $("#multipleChoiceQuestions").show()
        for (let i = 0; i < data.choices.length; i++) {
            $("#multipleChoiceQuestionsOptions").prepend(``)
            $("#multipleChoiceQuestionsOptions").prepend(`
            <div class="form-check d-flex justify-content-center list-options">
                <input class="form-check-input btn-check" value='${data.choices[i]}' id='${data.choices[i]}' name="options" type="radio" />
                <label class="form-check-label btn btn-outline-dark" for='${data.choices[i]}' >${data.choices[i]}</label>
            </div>`)
            $("#multipleChoiceQuestionsOptions .list-group-item").click(() => {
                $(this).addClass('active').siblings().removeClass('active')
            })
        }
    } else {
        console.log("PANIC")
    }
    
    $("#title").html(data.question)
    interval = setInterval(timer, 100)
}

function timer() {
    time_remaining -= 1
    $("#timer").html(time_remaining/10)
    if (time_remaining == 0) {
        $("#time_out").show()
        $("#submit2, #submit").prop("disabled", true)
        $("#correct_answer2").html(question_data.answer)
        clearInterval(interval)
    }
}

async function nextQuestion() {
    scoreChange = Math.max(0, 2-attempts)
    score += scoreChange
    attempts = 0
    time_remaining = 300
    clearInterval(interval)
    $("#score_symbols").show()
    $("#score").html(score)
    $("#score" + question_number).css("color", scoreSymbols[scoreChange])
    question_number += 1
    if (question_number >= 11) {
        return done()
    }
    $("#success, #fail, #force_next").hide()
    $(".col").hide()
    $("#dropdown").css("margin", "2%")
    // $("#ai_section").css("visibility", "hidden")
    $("#ai_section").hide()
    $("#time_out").hide()

    $("#submit2, #submit").prop("disabled", false)
    $("#answer").val("")
    $("#multipleChoiceQuestionsOptions").html("")
    $("#spinner").show()
    content = await fetch("/data/", {
        body: JSON.stringify({
            data: list,
            not: used_questions
        }),
        headers: {
            "Content-Type": "application/json",
          },
        method: "POST"
    })
    question_data = await content.json()
    $("#spinner").hide()
    questionRecieved(question_data)
}

function done() {
    $("#done").show()
    $("#end_points").html(score)
    $("#inputQuestions").hide()
    $("#multipleChoiceQuestions").hide()
    $("#spinner").hide()
    $("#success").hide()
    $("#fail").hide()
    // $("#ai_section").css("visibility", "hidden")
    $("#ai_section").hide()
    $("#force_next").hide()
    $("#score_symbols").hide()
    $("#time_out").hide()
    question_data = {}
    attempts = 0
    score=0
    list='general'
    question_number = 0
    used_questions = []
    time_remaining = 300
    var interval;
}

// $("#answer").on('input', e => {
//     if ($(e.target).html() == '') {
//        $("#submit").prop("disabled", true)
//     } else {
//        $("#submit").prop("disabled", false)
//     }
// })
