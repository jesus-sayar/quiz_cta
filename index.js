$( document ).ready(function() {
  $("#start").click(function(){
    main();
  });

  function main(){
    var json = {};
    $.ajax({
      url: 'http://127.0.0.1:5000',
      success: function(response) {
        start_quiz(response);
      },
      error: function() {
        console.log("No se ha podido obtener la información");
      }
    });
  }

  function start_quiz(json_quiz){
    // OCULTAR PANTALLA DE INICIO
    hide_intro();

    // SELECCIONAR PREGUNTAS
    queries = json_quiz["quiz"];

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
    $('.timer').remove()
    solutions = "<ul>"
    var i = 1;
    queries.forEach(function(query) {
      console.log(query);
      if(query["reason"]){
        reason = "<span class='reason'>"+ query["reason"] + "</span>"
      } else {
        reason = ""
      }
      solutions+= "<li><span class='question'>["+i+"] - "+query["question"]+"</span><span class='solution'>"+query["solution"]+") "+query["answers"][query["solution"]]+"</span>"+reason+"</li>"
      i++;
    });
    solutions+="</ul>"
    $("#solutions").html(solutions);
  }

  function show_progress(seconds){
    $('#progress').html("");
    $('#counter').html("");
    if(false){
      var line = new ProgressBar.Line('#progress', {
          color: '#61e380',
          strokeWidth: 2.1,
          duration: 1000 * seconds,
          easing: 'linear'
      });          
    } else {
      var line = new ProgressBar.Circle('#progress', {
        strokeWidth: 6,
        easing: 'linear',
        duration: 1000 * seconds,
        color: 'red',
        trailColor: '#eee',
        trailWidth: 2,
        svgStyle: null
      });
    }
    line.animate(1);
    update_time(seconds, $('#counter'));

  }

  function update_time(timeleft, $element){
    $element.html(timeleft);
    if(timeleft - 1> 0) {
      setTimeout(function() {
        update_time(timeleft - 1, $element);
      }, 1000);
    }
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
});
