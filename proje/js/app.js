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

const toplar = []; // Golfçülerin fırlattığı toplar

const karakter = {
    X : 600,
    Y : 500,
    W : 20,
    H : 20,
    can: 100,
    sonHasarZamani: 0,    // Hasar koruması (I-Frame) için
    hiz : 4,
    color : "blue",
    buyuklukCarpani : 3,
    dur: false,
    yemeModu : false,
    yemeBaslangic : 0
};

const tuslar = {
    ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false,
    w: false, a:false, s:false, d: false, " ":false
};

// --- GİRDİ DİNLEYİCİLERİ ---
window.addEventListener("keydown", (e) => {
    if(tuslar.hasOwnProperty(e.key)){ tuslar[e.key] = true; }
});
window.addEventListener("keyup", (e) => {
    if(tuslar.hasOwnProperty(e.key)){ tuslar[e.key] = false; }
});

function topFirlat(golfcu) {
    let dx = (karakter.X + karakter.W / 2) - golfcu.x;
    let dy = (karakter.Y + karakter.H / 2) - golfcu.y;
    let aci = Math.atan2(dy, dx);
    toplar.push({
        x: golfcu.x,
        y: golfcu.y,
        vx: Math.cos(aci) * 3,
        vy: Math.sin(aci) * 3
    });
}

function toplariYonet() {
    for (let i = toplar.length - 1; i >= 0; i--) {
        let t = toplar[i];
        t.x += t.vx;
        t.y += t.vy;

        // Topu çiz
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();

        // Çarpışma Kontrolü
        let dx = t.x - (karakter.X + karakter.W / 2);
        let dy = t.y - (karakter.Y + karakter.H / 2);
        let mesafe = Math.sqrt(dx * dx + dy * dy);
        let kYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;

        if (mesafe < kYaricap + 5) {
            let simdi = Date.now();
            // 500ms Hasar koruması (I-Frame)
            if (simdi - karakter.sonHasarZamani > 500) {
                karakter.can -= 10;
                karakter.sonHasarZamani = simdi;
            }
            toplar.splice(i, 1);
        }

        // Ekran dışı temizliği
        if (t.x < 0 || t.x > canvas.width || t.y < 0 || t.y > canvas.height) {
            toplar.splice(i, 1);
        }
    }
}

function canBariniCiz() {
    const genislik = 300;
    const yukseklik = 20;
    const x = (canvas.width / 2) - (genislik / 2);
    const y = canvas.height - 40; 

    // Arka Plan
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x, y, genislik, yukseklik);

    // Can Çubuğu
    ctx.fillStyle = karakter.can > 50 ? "#2ecc71" : "#e74c3c";
    let doluluk = (Math.max(0, karakter.can) / 100) * genislik;
    ctx.fillRect(x, y, doluluk, yukseklik);

    // Çerçeve
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, genislik, yukseklik);

    // Sayısal Değer
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`CAN: %${Math.floor(karakter.can)}`, canvas.width / 2, y + 18);
}

function guncelle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. PASİF CAN DÜŞÜŞÜ (Saniyede 10 can)
    if (karakter.can > 0) {
        karakter.can -= 0.08; 
    } else {
        karakter.can = 0;
        alert("Enerjin tükendi! Skorunu geliştirmeyi dene.");
        location.reload();
        return;
    }

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.moveTo(150,20);
    ctx.lineTo(1050,20);
    ctx.lineTo(1150,630);
    ctx.lineTo(50,630);
    ctx.lineTo(150,20);
    ctx.fillStyle="green";
    ctx.fill();
    ctx.stroke();

    let oran = (karakter.Y - 20) / (630 - 20);
    let solSinir = 150 - (oran * 100);
    let sagSinir = 1050 + (oran * 100);

    if (tuslar[" "] && !karakter.dur) {
        karakter.dur = true;
        karakter.yemeModu = true;
        karakter.yemeBaslangic = Date.now();
        karakter.buyuklukCarpani = 6; 

        let kMerkezX = karakter.X + (karakter.W / 2);
        let kMerkezY = karakter.Y + (karakter.H / 2);
        let kYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;
        
        for (let i = golfculer.length - 1; i >= 0; i--) {
            let g = golfculer[i];
            let dx = kMerkezX - g.x;
            let dy = kMerkezY - g.y;
            let mesafe = Math.sqrt(dx * dx + dy * dy);

            if (mesafe < kYaricap) {
                golfculer.splice(i, 1); 
                // Can Ödülü (+10)
                karakter.can = Math.min(100, karakter.can + 10);
            }
        }

        setTimeout(() => {
            karakter.dur = false;
            karakter.yemeModu = false;
            karakter.buyuklukCarpani = 3;
        }, 500);
    }

    if(!karakter.dur){
        if ((tuslar.ArrowUp || tuslar.w) && karakter.Y > 20) karakter.Y -= karakter.hiz;
        if ((tuslar.ArrowDown || tuslar.s) && karakter.Y + karakter.H < 630) karakter.Y += karakter.hiz;
        if ((tuslar.ArrowLeft || tuslar.a) && karakter.X > solSinir) karakter.X -= karakter.hiz;
        if ((tuslar.ArrowRight || tuslar.d) && karakter.X + karakter.W < sagSinir) karakter.X += karakter.hiz;
    }

    let guncelYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;
    if (karakter.yemeModu) {
        let gecenSure = Date.now() - karakter.yemeBaslangic;
        let frameIndex = Math.min(6, Math.floor(gecenSure / 70)); 
        let aktifYemeResmi = yemeResimleri[frameIndex];
        if (aktifYemeResmi && aktifYemeResmi.complete) {
            ctx.imageSmoothingEnabled = false; 
            let animasyonGorselBoyu = guncelYaricap * 5.5; 
            ctx.drawImage(aktifYemeResmi, 
                (karakter.X + karakter.W / 2) - animasyonGorselBoyu / 2, 
                (karakter.Y + karakter.H / 2) - animasyonGorselBoyu / 2, 
                animasyonGorselBoyu, animasyonGorselBoyu
            );
        }
    } else {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(karakter.X + (karakter.W / 2), karakter.Y + (karakter.H / 2), guncelYaricap, 0, 2 * Math.PI);
        ctx.fill();
    }

    golfculer.forEach(golfcu => {
        let aktifResim = golfcuResimleri[0]; // Şimdilik ilk frame
        if (aktifResim && aktifResim.complete) {
            const boy = 200;
            ctx.drawImage(aktifResim, golfcu.x - boy/2, golfcu.y - boy/2, boy, boy);
        } else {
            ctx.fillStyle = "orange";
            ctx.fillRect(golfcu.x - 5, golfcu.y - 5, 10, 10);
        }
    });

    toplariYonet(); 
    canBariniCiz(); 
    
    requestAnimationFrame(guncelle);
}

guncelle();
setInterval(golfculeriEkle, 2000); // Yeni golfçü ekleme hızı
setInterval(() => {
    golfculer.forEach(g => topFirlat(g));
}, 2000); // Golfçülerin ateş etme hızı