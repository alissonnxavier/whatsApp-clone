export class MicrophoneController{

    constructor(){

        navigator.mediaDevices.getUserMedia({
            audio: true,

        }).then(stream=>{

            this._stream = stream;

            let audio = new Audio();

            audio.src = URL.createObjectURL(stream);

            audio.play();

            this.trigger('paly', audio);
            
        }).catch(err=>{

            console.log(err);
        });
    }

    stop(){

        this._stream.getTracks().forEach(track=>{

            track.stop();
        })
    }
}