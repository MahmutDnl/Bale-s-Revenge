const golfculer = [];


function rastgeleSayiUret(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function rastgeleGolfcuKoordinatiUret(){
    var sayi = rastgeleSayiUret(1,4);
    const pay = 40;
    var x,y;
    switch (sayi) {
        case 1:
            x = rastgeleSayiUret(150 + pay, 1050 - pay);
            y = 20 + pay;
            break;
        case 2: 
            var t2 = Math.random();
            
            let t_sag = 0.1 + (Math.random() * 0.8); 
            x = (1050 + t_sag * (1150 - 1050)) - pay;
            y = 20 + t_sag * (630 - 20);
            break;
        case 3: 
            x = rastgeleSayiUret(50 + pay, 1150 - pay);
            y = 630 - pay;
            break;
        case 4: 
            let t_sol = 0.1 + (Math.random() * 0.8);
            x = (150 + t_sol * (50 - 150)) + pay;
            y = 20 + t_sol * (630 - 20);
            break;
    }
    return { x: x, y: y };
}

function golfculeriEkle(){
    const konum = rastgeleGolfcuKoordinatiUret();

    const yeniGolfcu = {
        x: konum.x,
        y: konum.y,
        currentFrame:0,
        lastFrameTime: Date.now(),
        frameDelay: 80,
    };
    golfculer.push(yeniGolfcu);
    
}

