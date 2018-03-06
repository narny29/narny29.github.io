var sounds = [	new Audio('/assets/sounds/Dry-Kick.wav'), 
				new Audio('/assets/sounds/Bamboo.WAV'),
				new Audio('/assets/sounds/lg_snare.WAV'),  
				new Audio('/assets/sounds/Clap-1.wav')];

var aud_map = [0,1,2,3];

function play_beat(type){
	type = audio_map(type);
	sounds[type].pause();
	sounds[type].currentTime = 0;
	sounds[type].play()
}

function audio_map(type){
	return aud_map[type];
}