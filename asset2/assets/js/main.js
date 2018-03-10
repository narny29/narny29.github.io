// major variables
var canvas_ctx; // canvas context
var audio_analyser;
var audio_ctx;
var canvas_anim;
var audio_buffer;
var canvas_anim_on=false;

var freq_sequence

// variables
var note_history;
var curr_octave;
var curr_note;

// constants
const WINDOW_SIZE = 2048;
const MIN_PITCH = 40;
const MAX_PITCH = 4000;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 200;
const GRAY = 'rgb(255,255,255)';
const MAX_HISTORY_LENGTH = 500;

window.onload = function(){
	// initialisations
	canvas_ctx = document.getElementById('display').getContext('2d');
	canvas_ctx.fillStyle = GRAY;
	canvas_ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
	audio_ctx = new (window.AudioContext || window.webkitAudioContext)();
	audio_analyser = audio_ctx.createAnalyser();
	note_prob_array = new Array(n_notes).fill(0);
	note_history = new Array();
	

	//added by chinmoy
	freq_sequence = new Array();

	// set buffer array size
	audio_analyser.fftsize = WINDOW_SIZE;
	audio_buffer = new Uint8Array(WINDOW_SIZE);

	// microphone access
	get_mic_input();
}

// audio information display on/off
function toggle_animation(){
	if(canvas_anim_on){
		document.getElementById("button").src="/asset2/templates/Static/start.png";
		clearInterval(canvas_anim);
		canvas_anim_on = false;
	}else{
		canvas_anim = window.setInterval(anim_loop,40);
		document.getElementById("button").src="/asset2/templates/Static/pause.png";
		canvas_anim_on = true;
	}
}

function anim_loop(){
	// call for the next frame
	//canvas_anim = requestAnimationFrame(anim_loop);

	// get audio buffer data
	audio_analyser.getByteTimeDomainData(audio_buffer);

	// get pitch information
	let pitch = get_yin_pitch(audio_buffer, audio_ctx.sampleRate);

	// get note information
	if(pitch>MIN_PITCH && pitch<MAX_PITCH){

		freq_sequence.push(pitch)

		let note_info = get_note_info(pitch);
		curr_octave = note_info[0];
		curr_note = note_info[1];
		// console.log(pitch);
	}else{
		freq_sequence.push(-1)
		curr_note = -1;
		curr_octave = -1;
	}

	// update note history if valid note
	note_history.push([curr_note, curr_octave]);

	if(note_history.length > MAX_HISTORY_LENGTH)
		note_history.splice(0,1);

	// update canvas
	canvas_update(canvas_ctx, note_history);
}

// update background and other elements
function canvas_update(display, data){
	// background update
	display.fillStyle = GRAY;
	display.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);

	// plot 
	plot_1d(display,data);
}

// plots 1 dimensional data like a graph //
// here each data point contains 2 params // 
// data[i][0] is curr_note and data[i][1] is curr_octave //
function plot_1d(display, data){
	// init
	let rect_width = CANVAS_WIDTH/MAX_HISTORY_LENGTH;
	let rect_height = CANVAS_HEIGHT/n_notes;

	// plot history
	for(let i=0;i<data.length;i++){
		for(let j=0;j<n_notes;j++){
			// if j is current note then choose deep color
			if(j == data[i][0]){
				display.fillStyle = 'rgb(0,'+parseInt(data[i][1]*255/(n_octaves-1))+',240)';
				display.fillRect(i*rect_width,j*rect_height,rect_width, rect_height);
			}
		}
	}
}

function get_mic_input(){
	navigator.getUserMedia({audio:true, video:false},function(stream){
		// on success
		let source = audio_ctx.createMediaStreamSource(stream);
		source.connect(audio_analyser);
		console.log('Microphone Connected.')

	},function(error){
		// on error
		console.log('Error Getting Microphone Access!\n'+error)
	});
}
