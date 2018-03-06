const AMP_THRESHOLD = 60; /* Threshold amplitude */
const POS_SLOPE_THRESHOLD = 40; /* Threshold positive slope */
const NEG_SLOPE_THRESHOLD = -40; /* Threshold negative slope */

var recording = false; /* recording or not */
var playing = false; /* playing or not */

var HIDE = {
	"display":"none"
};
var SHOW = {
	"display":"grid"
}

/* 	recording loop : 
		start/stop recording when 
		record_button pressed 	*/
function listen_loop(){
	/* next frame loop */
	loop = requestAnimationFrame( listen_loop );

	/* fill audio buffer with frequency data */
	audio_analyser.getByteFrequencyData( audio_buffer );

	/* visualisations */
	board.fillStyle ='#aaf';
	board.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	plot(get_lesser(audio_buffer));

	/* get maximum amplitude over all frequencies */
	let max_amplitude = Math.max.apply( Math, audio_buffer );

	/* for valid signals */
	if( max_amplitude > AMP_THRESHOLD ){
		/* get slope of amplitude sum */
		let amp_slope = get_amp_sum()-prev_amp_sum;

		/* if slope greater than +ve slope threshold */
		if( amp_slope > POS_SLOPE_THRESHOLD && ! beat_found){
			curr_time = parseInt(Date.now()/TIME_DIVISIONS - START_TIME);
			beat_found = true;
		}
		/* if slope smaller than -ve slope threshold */
		if( amp_slope < NEG_SLOPE_THRESHOLD && beat_found){
			beat_found = false;

			/* if tmp beat is not empty */
			if(tmp_beat.length>0){
				/* process output after classifying type of beat */
				classify_and_compose(tmp_beat, process_output, curr_time);

				/* empty the beats buffer after classification */
				tmp_beat = [];
			}
		}

		/* if beat found then capture */
		if( beat_found ){
			if(tmp_beat.length<8)
				tmp_beat.push( clamped_fft(filtered( audio_buffer )) );
		}

		prev_amp_sum += amp_slope;
	}
}

/* get lesser frequencies */
function get_lesser(data){
    let resp_data = [];
    let parts = 16;
    let part_width = parseInt(data.length/parts);
    for(let i=0;i<parts;i++){
        let sum = 0;
        for(let j=i*part_width;j<(i+1)*part_width;j++){
            sum += data[j];
        }
        resp_data.push(parseInt(sum/(1+part_width)));
    }
    return resp_data;
}


/* The audio play loop
*/
function play_loop(){
	let show_width = 1;

	for(let i=0;i<3;i++){
		let prev = ( play_loop_counter + REC_LENGTH - show_width ) % REC_LENGTH;
		let next = ( play_loop_counter + show_width ) % REC_LENGTH;

		$( '#bar_' + i + '_' + prev ).css( DEF_BAR_CSS );
		$( '#bar_' + i + '_' + next ).css( MODF_BAR_CSS );
	}

	if( play_loop_counter == beat_time_array[ curr_beat ] ){
		play_beat( beat_type_array[ curr_beat ] );
		curr_beat = ( curr_beat + 1 )%beat_time_array.length;
	}

	play_loop_counter = ( play_loop_counter + 1 ) % REC_LENGTH;
}

/* Process the output */
function process_output( type, cur_time ){
	if( type==0 || type == 1 || type == 2 ){
		beat_type_array.push( type );
		beat_time_array.push( cur_time );
	}
}

/*	toggle recording
	status to on/off  */
function toggle_recorder(){
	if( recording ){
		/* stop listening and start playing */
		cancelAnimationFrame(loop);
		REC_LENGTH = parseInt(Date.now()/TIME_DIVISIONS - START_TIME);

		/* update status */
		$( "#record_button" ).html( '<img src="/asset1/assets/images/record.png">' );
		recording = false;
	}else{
		/* stop playing first*/
		if ( playing ) toggle_player();

		/* hide kits and show visuals */
		$('.kit').css(HIDE);
		$('#visualizer').css(SHOW);

		/* then start listening */
		beat_time_array = [];
		beat_type_array = [];
		START_TIME = parseInt(Date.now()/TIME_DIVISIONS);
		listen_loop();

		/* update status */
		$( "#record_button" ).html( '<img src="/asset1/assets/images/stop.png">' );
		recording = true;
	}
}

/* on play button pressed */
function toggle_player(){
	if( playing ){
		/* stop playing */
		clearInterval(loop);

		/* updates */
		playing = false;
		$('#play_button').html('<img src="/asset1/assets/images/play.png">');
	}else{
		/* stop recording */
		if ( recording ) toggle_recorder();

		/* hide visuals and show kits */
		$('.kit').css(SHOW);
		$('#visualizer').css(HIDE);

		/* then start playing */
		if(REC_LENGTH>600 && REC_LENGTH<10){
			console.log("too large duration");
		}else{
			/* preparing time series plot */
			prepare_viewport();

			/* start playing */
			play_loop_counter = 0;
			curr_beat = 0;
			loop = setInterval(play_loop, TIME_DIVISIONS);

			/* updates */
			$('#play_button').html('<img src="/asset1/assets/images/pause.png">');
			playing = true;
		}
	}
}


function plot(values){
    var barWidth = CANVAS_WIDTH/values.length;
    let barHeight = 0;
    let x = 0;
    for(let i=0;i<values.length;i++){
        barHeight = values[i] + 2;

        board.fillStyle = 'rgb('+barHeight*2+',50,50)';
        board.fillRect(x,(CANVAS_HEIGHT - barHeight)/2,barWidth, barHeight)
        x += barWidth;
    }
}