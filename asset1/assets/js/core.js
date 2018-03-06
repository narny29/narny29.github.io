/* create filter banks */
function filtered(data){
	// init
    let resp_data = [];
    let tmp_sum;
    let filter_width = parseInt( data.length / N_FILTERS );

    for( let i = 0; i < N_FILTERS; i++ ){
        tmp_sum = 0;
    	/* sum energies over each filter */
        for( let j = i * filter_width; j < ( i+1 ) * filter_width; j++ ){
            tmp_sum += data[j];
        }
        resp_data.push( parseInt( tmp_sum/( 1+filter_width ) ) );
    }
    return resp_data;
}

/*  Get access to microphone
    and print status  */
function get_mic_input(){
    let flags = {audio:true, video:false};

    navigator.getUserMedia ( flags, function( stream ){ 
        let source = audio_ctx.createMediaStreamSource( stream );
        source.connect ( audio_analyser ) ;
    }, function( error ){ 
        console.log( 'Error Getting Microphone Access!\n'+error );
    });
}


/*  Get sum of amplitudes of
    all frequencies in audio_buffer  */
function get_amp_sum(){
    var sum = 0;
    for(i=0;i<audio_buffer.length;i++){
        sum += audio_buffer[i];
    }
    return sum;
}

/* clamping is used as tweak to
    make the model compatible to faster 
    beats as the audio analyser node
    uses the actual freqs similar to an 
    acceleration to values it provides
*/
function clamped_fft(data){
    let modf_fft = [];
    for(let i=0;i<data.length;i++){
        if(data[i] - prev_fft[i]< -5){
            modf_fft[i] = 0;
        }else{
            modf_fft[i] = data[i];
        }
    }
    prev_fft = data;
    return modf_fft;
}