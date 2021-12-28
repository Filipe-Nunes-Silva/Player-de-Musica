//---------------------------------------------VARIAVEIS----------------------------------------------------------
const audio = document.querySelector(".audio");
const musicInfo = document.querySelector(".music_info");
const musicArtist = document.querySelector(".artist_info");
//-------------------------------------------------------------------------------
const gif = document.querySelector(".gif");
const musicStart = document.querySelector(".duration_start");
const musicDuration = document.querySelector("#duracao");
const musicEnd = document.querySelector(".duration_end");
//-------------------------------------------------------------------------------
const mudo = document.querySelector(".mudo");
const volumeControl = document.querySelector("#volume");
//-------------------------------------------------------------------------------
const controlsButtom = document.querySelectorAll(".controls_buttom");
let tocando = false;
let musicAtual = 0;

//---------------------------------------------OBJETO/MUSICAS----------------------------------------------------
const musics = [ //Objeto com todas as Musicas

    {
        artista:"Di proposito & Menos é mais",
        music:"Manda Audio",
        local:"./assets/musics/mandaaudio.mp3"
    },
    {
        artista:"Menos é mais",
        music:"Ligando os Fatos",
        local:"./assets/musics/ligandofatos.mp3"
    },
    {
        artista:"Um44k, Mc Bruninho & Gaab",
        music:"Pagode do Presença",
        local:"./assets/musics/Samba_e_Pagode.mp3"
    },
];

//---------------------------------------------EVENTOS-----------------------------------------------------------
onload = function(){ //Carrega tudo assim que abre a pagina
    
    //Setando tempo da primeira musica
    atualizaTempoFinal()

    //Setando Musica Inicial
    audio.setAttribute("src", musics[musicAtual].local)
    musicInfo.innerHTML = musics[musicAtual].music;
    musicArtist.innerHTML = musics[musicAtual].artista;

    //Volume Inicial
    audio.volume = volumeControl.value / 100;
};

controlsButtom.forEach((valor,indice,array)=>{ //Escuta os clicks dos botões e chama as funções
    valor.addEventListener("click",()=>{

        if(indice === 0){
            previusMusic();
            atualizaTempoFinal();
        };
        if(indice === 1){
            slowMusic();
        };
        if(indice === 2){
            playMusic(valor);
        }; 
        if(indice === 3){
            stopMusic(array[2]);
        };
        if(indice === 4){
            fastMusic();
        };
        if(indice === 5){
            nextMusic();
        };
    });
});
volumeControl.addEventListener("input",()=>{ //Escuta o range do volume e aumenta ou diminui
    audio.volume = volumeControl.value / 100;
    if(audio.volume === 0){
        mudo.setAttribute("src","./assets/images/mudo.png");
    }
    else{
        mudo.setAttribute("src","./assets/images/volume.png");
    }
});

mudo.addEventListener("click",()=>{ //Escuta o click no botão de volume e muta o som ou restaura
    if(audio.muted === false){
        audio.muted = true;
        mudo.setAttribute("src","./assets/images/mudo.png");
    }
    else{
        audio.muted = false;
        mudo.setAttribute("src","./assets/images/volume.png");
    };
});

musicDuration.addEventListener("input",function(){ //Função adianta\volta a musica dependendo do que usuario mexer
    if(tocando !== true){
        audio.currentTime = musicDuration.value;
    }
    else{
        audio.currentTime = musicDuration.value;
        tocando = false;
        playMusic();
    };
});

//---------------------------------------------FUNÇÕES-----------------------------------------------------------

function previusMusic(){ //Musica Anterior

    musicAtual--;
    if(musicAtual < 0){
        musicAtual = 0;
    };

    audio.setAttribute("src",musics[musicAtual].local);
    musicInfo.innerHTML = musics[musicAtual].music;
    musicArtist.innerHTML = musics[musicAtual].artista;

    tocando = false;
    playMusic(controlsButtom[2]);
};

function slowMusic(){ //Função deixa a musica lenta
    if(tocando === true){
        audio.playbackRate -= 0.1;
    }
    else{
        return;
    }
};

function playMusic(objHtml){ //Função que da play na musica
    if(tocando === false){
        tocando = true;
        audio.play();
        objHtml.setAttribute("src","./assets/images/pause.png");
        objHtml.setAttribute("title","Pause");
        gif.setAttribute("src","./assets/images/gif.gif");
    }
    else{
        tocando = false;
        audio.pause()
        objHtml.setAttribute("src","./assets/images/play.png");
        objHtml.setAttribute("title","Play");
        gif.setAttribute("src","./assets/images/music_pause.png");
        
    };
};

function stopMusic(arrayHtml,objHtml){ //Função para da stop na musica
    if(tocando === true){
        tocando = false;
        audio.pause();
        audio.currentTime = 0;
        arrayHtml.setAttribute("src","./assets/images/play.png");
        arrayHtml.setAttribute("title","Play");
    }
    else{
        audio.pause();
        audio.currentTime = 0;
        gif.setAttribute("src","./assets/images/gif.gif")
    };
};

function fastMusic(){ //Função deixa a musica rapida
    if(tocando === true){
        audio.playbackRate += 0.1;
    }
    else{
        return;
    };
};

function nextMusic(){ //Proxima Musica

    musicAtual++;
    if(musicAtual === musics.length){
        musicAtual = 0;
    };

    audio.setAttribute("src",musics[musicAtual].local);
    musicInfo.innerHTML = musics[musicAtual].music;
    musicArtist.innerHTML = musics[musicAtual].artista;
    
    tocando = false;
    playMusic(controlsButtom[2]);
    atualizaTempoFinal();
};




function consertaTime(time){ //Função adiciona 0 aos min/seg se forem menor que 10
    return  time < 10 ? `0${time}`: time;
 };

function atualizaTempoFinal(){ //Função diz a duração da musica
    setTimeout(() => {
        const tempoTotalAudio = audio.duration;
        const data = new Date(null);
        data.setSeconds(tempoTotalAudio);
        const minutos = data.getMinutes();
        const segundos = data.getSeconds();
        musicDuration.max = parseInt(tempoTotalAudio);
        musicEnd.innerHTML = `${consertaTime(minutos)}:${consertaTime(segundos)}`;
    },1000);
};

setInterval(atualizaTimeMusic,1000);
function atualizaTimeMusic(){ //Função atualiza o range de qual o tempo da musica atual
    const tempoAtual  = audio.currentTime;
    const data = new Date(null);
    data.setSeconds(tempoAtual);
    const minutos = data.getMinutes();
    const segundos = data.getSeconds();

    musicStart.innerHTML = `${consertaTime(minutos)}:${consertaTime(segundos)}`;
    musicDuration.value = audio.currentTime;
    nextMusicAuto(audio.currentTime);
};

function nextMusicAuto(timeAudio){ //Função passa para a proxima musica quando a atual acaba
    const endAudio = audio.duration;
    if(timeAudio === endAudio){
        nextMusic();
    };
};