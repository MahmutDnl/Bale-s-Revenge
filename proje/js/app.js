const golfcuResimleri = [];
for (let i = 1; i <= 4; i++) {
    let img = new Image();
    img.src = `../assets/golfcu/5.png`; 
    golfcuResimleri.push(img);
}
const yemeResimleri = [];
for (let i = 1; i <= 7; i++) {
    let img = new Image();
    img.src = `../assets/yeme/${i}.png`; 
    yemeResimleri.push(img);
}


const canvas = document.getElementById("OyunCanvas");
const ctx = canvas.getContext('2d');


canvas.width = 1200;
canvas.height = 680;


const karakter = {
    X : 600,
    Y : 500,
    W : 20,
    H : 20,

    hiz : 4,
    color : "blue",
    buyuklukCarpani : 3 ,
    dur: false,
    yemeModu : false,
    yemeBaslangic : 0
};


const tuslar = {
    ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false,
    w: false, a:false, s:false, d: false, " ":false
};


window.addEventListener("keydown", (e) => {

    if(tuslar.hasOwnProperty(e.key)){
        tuslar[e.key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if(tuslar.hasOwnProperty(e.key)){
        tuslar[e.key] = false;
    }
});



function guncelle(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineJoin = "miter"
    ctx.strokeStyle = "black";
    ctx.moveTo(150,20);

    ctx.lineTo(1050,20);
    ctx.lineTo(1150,630);
    ctx.lineTo(50,630);

    ctx.lineTo(150,20);
    ctx.fillStyle="green";
    
    ctx.fill()
    ctx.stroke();

    let oran = (karakter.Y - 20) / (630 - 20); // BU kısm bize yamukta sağ ve sol kenarların sınırlarını verir. 
    let solSinir = 150 - (oran * 100);  // Yukarıdayken 150, aşağıdayken 50 olur
    let sagSinir = 1050 + (oran * 100);

    if (tuslar[" "] && !karakter.dur) {
        karakter.dur = true;
        karakter.yemeModu = true;
        karakter.yemeBaslangic = Date.now();
        karakter.buyuklukCarpani = 6; 

        // Karakterin o anki merkez noktası
        let kMerkezX = karakter.X + (karakter.W / 2);
        let kMerkezY = karakter.Y + (karakter.H / 2);
        let kYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;
        let kMenzil = (karakter.W / 2)*6;

        
        
        for (let i = golfculer.length - 1; i >= 0; i--) {
            let g = golfculer[i];
            
            
            let dx = kMerkezX - g.x;
            let dy = kMerkezY - g.y;
            let mesafe = Math.sqrt(dx * dx + dy * dy);

            
            if (mesafe < kYaricap) {
                golfculer.splice(i, 1); // Temas edeni listeden siliyoruz
            }
        }

        
        setTimeout(() => {
            karakter.dur = false;
            karakter.yemeModu = false;
            karakter.buyuklukCarpani = 3;
        }, 500);
    }
    if(!karakter.dur){
        if ((tuslar.ArrowUp || tuslar.w) && karakter.Y > 20) {
        
            karakter.Y -= karakter.hiz;

            
            let yeniOran = (karakter.Y - 20) / (630 - 20);
            let yeniSolSinir = 150 - (yeniOran * 100);
            let yeniSagSinir = 1050 + (yeniOran * 100);

            
            if (karakter.X < yeniSolSinir) {
                karakter.X = yeniSolSinir;
            }

            
            if (karakter.X + karakter.W > yeniSagSinir) {
                karakter.X = yeniSagSinir - karakter.W;
            }
        }
        if ((tuslar.ArrowDown || tuslar.s) && karakter.Y + karakter.H < 630){
            karakter.Y += karakter.hiz;
        }
        
        if((tuslar.ArrowLeft || tuslar.a) && karakter.X > solSinir){
            karakter.X -= karakter.hiz;
        }
        if((tuslar.ArrowRight || tuslar.d) && karakter.X + karakter.W < sagSinir){
            karakter.X += karakter.hiz;
        }
    }
    

    let guncelYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;

    if (karakter.yemeModu) {
        // Yeme animasyonu resimlerini sırayla göster
        let gecenSure = Date.now() - karakter.yemeBaslangic;
        let frameIndex = Math.floor(gecenSure / 70); 
        if (frameIndex > 6) frameIndex = 6; 

        let aktifYemeResmi = yemeResimleri[frameIndex];
        if (aktifYemeResmi && aktifYemeResmi.complete) {
            
            // Pixel art'ın net görünmesi için yumuşatmayı kapatıyoruz
            ctx.imageSmoothingEnabled = false; 

            // --- GÖRSEL BÜYÜTME AYARI ---
            // guncelYaricap şu an buyuklukCarpani=12 olduğu için zaten büyük.
            // Eğer hala küçük geliyorsa çarpanı (2.5) daha da artırabilirsin (örn: 4.0)
            let animasyonGorselBoyu = guncelYaricap * 5.5; 

            ctx.drawImage(aktifYemeResmi, 
                (karakter.X + karakter.W / 2) - animasyonGorselBoyu / 2, 
                (karakter.Y + karakter.H / 2) - animasyonGorselBoyu / 2, 
                animasyonGorselBoyu, 
                animasyonGorselBoyu
            );
        }
    } else {
        // Normal Mavi Yuvarlak
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(karakter.X + (karakter.W / 2), karakter.Y + (karakter.H / 2), guncelYaricap, 0, 2 * Math.PI);
        ctx.fill();
    }

    golfculer.forEach(golfcu => {
        let simdi = Date.now();
        if (simdi - golfcu.lastFrameTime > golfcu.frameDelay) {
            
            golfcu.currentFrame = (golfcu.currentFrame + 1) % 1; 
            golfcu.lastFrameTime = simdi;
        }
        let aktifResim = golfcuResimleri[golfcu.currentFrame];
        if (aktifResim && aktifResim.complete && aktifResim.naturalWidth !== 0) {
            const boy = 200;
            ctx.drawImage(aktifResim, golfcu.x - boy/2, golfcu.y - boy/2, boy, boy);
        } else {
            ctx.fillStyle = "orange";
            ctx.fillRect(golfcu.x - 5, golfcu.y - 5, 10, 10);
        }
    });
    requestAnimationFrame(guncelle);

    
}

guncelle();
setInterval(golfculeriEkle, 3500);
