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
        currentFrame: 0,
        lastFrameTime: Date.now(),
        frameDelay: 250,
        animasyonDevam: true,     
        AtisYapildi: false,
        sekmeY: 0,
        vx: 0,
        vy: 0,
        targetX : 0,
        targetY : 0,
        
        top : {
            active: false,
            x : konum.x,
            y : konum.y,

            baslangicX: 0, 
            baslangicY: 0,
            vx: 0,
            vy: 0,
            targetX : 0,
            targetY : 0,
            frame:0,
            lastFrameTime: 0
        }
    };
    golfculer.push(yeniGolfcu);
}

function topuAlmayaGit(golfcu) {
    // 1. Mesafe ve Yön Hesabı
    let dx = golfcu.top.x - golfcu.x;
    let dy = golfcu.top.y - golfcu.y;
    let mesafe = Math.sqrt(dx * dx + dy * dy);

    if (mesafe > 5) {
        let yürümeHizi = 2;
        
        // Yatay ve Dikey ilerleme
        golfcu.x += (dx / mesafe) * yürümeHizi;
        golfcu.y += (dy / mesafe) * yürümeHizi;

        // --- SEKME EFEKTİ (Matematiksel Zıplama) ---
        // Sinüs dalgası kullanarak y koordinatını anlık yukarı çekiyoruz.
        // Math.sin(Date.now() * 0.01) bize -1 ile 1 arası bir değer verir.
        // Math.abs ile bunu 0 ile 1 arasına çekip zıplama yaptırıyoruz.
        let zıplamaYüksekliği = 15;
        let zıplamaHızı = 0.01;
        golfcu.sekmeY = -Math.abs(Math.sin(Date.now() * zıplamaHızı) * zıplamaYüksekliği);
        
    } else {
        // Topa ulaştı! Her şeyi sıfırla
        golfcu.mod = "atis";
        golfcu.top.active = false;
        golfcu.top.yerde = false;
        golfcu.animasyonDevam = true;
        golfcu.currentFrame = 0;
        golfcu.sekmeY = 0; // Zıplamayı sıfırla
    }
}

