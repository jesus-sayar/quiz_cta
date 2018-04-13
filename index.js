$( document ).ready(function() {
  $("#start").click(function(){
    main();
  });

  function main() {
    // Recuperar JSON de examen
    json = get_json_quiz();
    // Mostrar preguntas examen
    start_quiz(json);
  }

  function get_json_quiz(){
    var json = {
      "quiz": [
        {
          "question": "Este es el cuerpo de la PRIMERA pregunta",
          "answers": {"A": "Repuesta Prim A", "B": "Respuesta Prim B", "C": "Respuesta Prim C"},
          "solution": "A",
          "duration": 5
        },
        {
          "question": "Este es el cuerpo de la SEGUNDA pregunta",
          "answers": {"A": "Repuesta Seg A", "B": "Respuesta Seg B", "C": "Respuesta Seg C"},
          "solution": "B",
          "duration": 10
        },
        {
          "question": "Este es el cuerpo de la TERCERA pregunta",
          "answers": {"A": "Repuesta Ter A", "B": "Respuesta Ter B", "C": "Respuesta Ter C"},
          "solution": "C",
          "duration": 2
        },
        {
          "question": "Este es el cuerpo de la CUARTA pregunta",
          "answers": {"A": "Repuesta Ter A", "B": "Respuesta Ter B", "C": "Respuesta Ter C"},
          "solution": "C",
          "duration": 20
        }
      ]
    }
    return json;
  }

  function start_quiz(json_quiz){
    // OCULTAR PANTALLA DE INICIO
    hide_intro();

    seconds = 0;
    // MOSTAR TODAS LAS PREGUNTAS
    json_quiz["quiz"].forEach(function(query) {
      setTimeout(function(){
        show_progress(query["duration"]);
        show_query(query);
      }, 1000 * seconds);
      seconds += query["duration"];
    });
    // MOSTRAR LAS SOLUCIONES
    setTimeout(function(){
      show_solutions();
    }, 1000 * seconds);
  }

  function show_solutions(json_quiz){
    $('#query').remove();
    solutions = "<ul>"
    json["quiz"].forEach(function(query) {
      solutions+= "<li><span class='question'>"+query["question"]+"</span><span class='solution'>"+query["solution"]+") "+query["answers"][query["solution"]]+"</span></li>"
    });
    solutions+="</ul>"
    $("#solutions").html(solutions);
  }

  function show_progress(seconds){
    $('#progress').text("");
    var line = new ProgressBar.Line('#progress', {
        color: '#61e380',
        strokeWidth: 2.1,
        duration: 1000 * seconds,
        easing: 'linear'
    });
    line.animate(1);
  }

  function show_query(query){
    $("#question").text(query["question"]);
    answers = "<ul>"
    $.each(query["answers"], function( key, value ) {
      answers+= "<li><span>"+key+"</span>"+value+"</li>"
    });
    answers+="</ul>"
    $("#answers").html(answers);
  }

  function hide_intro(){
    $("#intro").remove();
    $('#progress').css("visibility", "visible");
  }

});
