// audio components
var audio_ctx; /* audio context */
var audio_analyser; /* audio analyser node */
var audio_buffer; /* audio buffer Uint8 array */

// record loop variables
var beat_found = false; /* beat found or not found in a particular instant */
var prev_amp_sum = 0; /* sum of amplitudes of previous freqs  */
var tmp_beat = [];
var predictor_model;
var prev_fft = [0,0,0,0,0,0,0];
var curr_time = 0;

var board;
var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 100;

/* play loop variables */
var START_TIME = 0;
var loop;
var play_loop_counter = 0;
var curr_beat = 0; 
var beat_time_array = [10,20,30];
var beat_type_array = [0,1,2];
var REC_LENGTH = 40;
var TIME_DIVISIONS = 20; // means times are accuracte upto 100 ms

// default variables
const WINDOW_SIZE = 1024;
const N_FILTERS = 8; /* Using linear filters here */

// styling variables
const DEF_BAR_CSS = {
    "height":"2px",
    "top":"0px"
}
const MODF_BAR_CSS = {
    "height":"20px",
    "top":"-8px"
}

const MODF_INSTRUMENT = {
    "background":"#66f",
    "color":"white"
}
const DEF_INSTRUMENT = {
    "background": "#fff",
    "color":"black"
}

// init function
window.onload = function(){
    board = document.getElementById('board').getContext('2d');

    /* get audio context */
    audio_ctx = new ( window.AudioContext || window.webkitAudioContext )();

    /* get audio analyser node */
    audio_analyser = audio_ctx.createAnalyser();
    audio_analyser.fftsize = WINDOW_SIZE;

    /* audio buffer should be size half that of audio analyser's fftsize */
    audio_buffer = new Uint8Array( audio_analyser.fftsize/2 );

    /* get access microphone input */
    get_mic_input();

    /* test*/
    // prepare_viewport();
    // loop = window.setInterval(play_loop, 20);

    $('.audio_out').on("click", function(){
        let aud_idx = parseInt($(this).attr('id').split("_")[1]);
        let aud_val = parseInt($(this).attr('id').split("_")[2]);
        aud_map[aud_idx] = aud_val;

        $('.audio_out').css(DEF_INSTRUMENT);
        highlight_selected_sounds();
    })
    
    highlight_selected_sounds();
}


/* changing widths on resizing window */
window.onresize = function(){
    /* change bar widths */
    $('.bar_container').css("width",parseInt($('.kit').width()/REC_LENGTH));
}

function highlight_selected_sounds(){
    for(let i=0;i<aud_map.length;i++){
        $('#output_'+i+'_'+aud_map[i]).css(MODF_INSTRUMENT);
    }
}   