// var inp = [["1.11","a"], ["1.81","c"], ["2.00","b"]];
// edit above matrix for different input

var ret_val
var processed_stack = []
var clean_freq_sequence = []
var inpToAudio = {"b":"B","a":"A","c":"C0", "d":"D0", "e":"E0","f":"F0","g":"G0","a0":"A0","b0":"B0","c0":"C0", "d0":"D0", "e0":"E0","f0":"F0","g0":"G0","a1":"A1","b1":"B1",
"c1":"C1", "d1":"D1", "e1":"E1","f1":"F1","g1":"G1","a2":"A2","b2":"B2","c2":"C2", "d2":"D2", "e2":"E2","f2":"F2","g2":"G2","a3":"A3",
"b3":"B3","c3":"C3", "d3":"D3", "e3":"E3","f3":"F3","g3":"G3","a4":"A4","b4":"B4","c4":"C4", "d4":"D4", "e4":"E4","f4":"F4","g4":"G4","c5":"C5","bb0":"Bb0","c_0":"C_0", "d_0":"D_0", "f_0":"F_0","g_0":"G_0","bb1":"Bb1",
"c_1":"C_1", "d_1":"D_1","f_1":"F_1","g_1":"G_1","bb2":"Bb2","c_2":"C_2", "d_2":"D_2","f_2":"F_2","g_2":"G_2",
"bb3":"Bb3","c_3":"C_3", "d_3":"D_3","f_3":"F_3","g_3":"G_3","bb4":"Bb4","c_4":"C_4", "d_4":"D_4","f_4":"F_4","g_4":"G_4"};


var numToKey = {"0":"c","1":"c_","2":"d","3":"d_","4":"e","5":"f","6":"f_","7":"g","8":"g_","9":"a","10":"bb","11":"b"}
// mapping of type to audio file
var count=0;
var ac = new AudioContext();
function play_sound(){
	// show_input()
	//start_beat()
	let xyz=document.getElementById("playPause").innerHTML
	if (xyz){
		let i =0;
	
		let threshold = 5;
		//let previous_note;
		let j =0;
	
	
		for (i=1;i< freq_sequence.length-threshold;i+=threshold){

			let flag = 0;
			let firstfreq = freq_sequence[i];
			console.log(firstfreq," this--> ",freq_sequence[i])
			for(j=i;j<i+threshold;j++){
				if (freq_sequence[j] > firstfreq + 50 || freq_sequence[j] < firstfreq - 50 ){
					flag = 1;
				}


			
			}
			console.log(flag)
			if (flag == 0){
				clean_freq_sequence.push(firstfreq)
			}
			else{
				clean_freq_sequence.push(-1)
			}
		
		}

		console.log(clean_freq_sequence)

	

		//play_sequence(ac, freq_sequence,ac.currentTime + 40, 0.3);
		play_sequence(ac, clean_freq_sequence,120, 1.5);
		}
}




function play_freqs(ac, osc, sequence, idx, intervals, curr_freq, timer,acceleration){
	if(timer%intervals == 0){
		idx += 1;
	}
	if(timer < sequence.length * intervals ){
		if(sequence[idx] < 60 || sequence[idx] > 1500){
			curr_freq = -1;
		}else if(curr_freq == -1){
			curr_freq = sequence[idx];
		}else{
			curr_freq += parseInt((sequence[idx] - curr_freq) * acceleration);
		}
		osc.frequency.setValueAtTime(curr_freq, ac.currentTime);

		window.setTimeout(play_freqs.bind(null, ac, osc, sequence, idx, intervals, curr_freq, timer + 20, acceleration), 20);
	}
}

/* plays sequence of audio :
	takes
		audio context from main function,
		sequence of audio with -1 for silences, 
		interval between successive sound instances in sequence array in milli seconds 
		acceleration of pitch shifts
	*/
function play_sequence(audio_context, sequence, intervals, acceleration){
	let osc = audio_context.createOscillator();

	let real = new Float32Array([-0.25, 4.25, -0.5, 4.25]);
	let imag = new Float32Array([1.75, -4, -8.25, 2.5]);

	//violin

	//let real = new Float32Array([60,49,45,50,44,49,38,47,28,20]);
	//let imag = new Float32Array([0,0,0,0,0,0,0,0,0,0]);

	// let real = new Float32Array([10,20,40,50,70,80]);
	// let imag = new Float32Array([0,0,0,0,0,0]);



	//flute

	// let real = new Float32Array([6,8,3]);
	// let imag = new Float32Array([0,0,0]);


	let wave = audio_context.createPeriodicWave(real, imag);
	osc.setPeriodicWave(wave);
	osc.connect(audio_context.destination);
	osc.start();
	osc.stop( audio_context.currentTime + parseInt(sequence.length * intervals / 1000 )+1);

	play_freqs(audio_context, osc, sequence, -1, intervals, sequence[0], 0, acceleration);
}

//var ac = new AudioContext(); /* This is just a demo, donot create new audio context like here again,
//	use already declared audio context in main.js instead  */



