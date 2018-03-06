/* updates viewport based on beat_type and beat_time */
function prepare_viewport(){
	let j=0;
	$('.time_series').empty();

	for(let i=0;i<REC_LENGTH;i++){
		if(i==beat_time_array[j]){
			add_beat(beat_type_array[j], i);
			j++;
		}else{
			add_beat(null, i);
		}
	}
	$('.bar_container').css("width",parseInt($('.kit').width()/REC_LENGTH));
}


/* add beat in time 
series viewport */
function add_beat(beat_type, t_value){
	/* find matching beat type, add marked beat
	 for matching and unmarked for the rest*/
	for( let i = 0; i<3; i++ ){
		if( i == beat_type ){
			add_key( i, true, t_value );
		}else{
			add_key( i, false, t_value );
		}
	}
}

function add_key( kit_id, beat_exists, t_value ){
	let name = "beat_output_"; 
	/* add marked bar if beat exists */
	if(beat_exists)
		$( '#' + name + kit_id ).append( '<div class="bar_container"><div class="marked_bar bar" id="bar_' + kit_id + '_' + t_value + '"></div></div>' )
	/* else add unmarked bar */
	else
		$( '#' + name + kit_id).append( '<div class="bar_container"><div class="bar" id="bar_' + kit_id + '_' + t_value + '"></div></div>' )
}



