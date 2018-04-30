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
    return quiz_json;
  }

  function start_quiz(json_quiz){
    // OCULTAR PANTALLA DE INICIO
    hide_intro();

    // SELECCIONAR PREGUNTAS
    queries = get_random_queries(json_quiz["quiz"]);

    seconds = 0;
    // MOSTAR TODAS LAS PREGUNTAS
    queries.forEach(function(query) {
      setTimeout(function(){
        show_progress(query["duration"]);
        show_query(query);
      }, 1000 * seconds);
      seconds += query["duration"];
    });
    // MOSTRAR LAS SOLUCIONES
    setTimeout(function(){
      show_solutions(queries);
    }, 1000 * seconds);
  }

  function show_solutions(queries){
    $('#query').remove();
    solutions = "<ul>"
    queries.forEach(function(query) {
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
      answers+= "<li><span>"+key+")</span>"+value+"</li>"
    });
    answers+="</ul>"
    $("#answers").html(answers);
  }

  function hide_intro(){
    $("#intro").remove();
    $('#progress').css("visibility", "visible");
  }

  function get_random_queries(all_queries){
    num_queries = 15;
    random_queries = [];
    for (i = 0; i < num_queries; i++) {
      random_index = Math.floor(Math.random()*all_queries.length)
      query = all_queries[random_index];
      random_queries.push(query);
    };
    return random_queries;
  }

});
