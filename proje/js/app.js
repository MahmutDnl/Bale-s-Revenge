// --- GÖRSEL VARLIKLAR ---
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

// --- CANVAS VE GLOBAL DEĞİŞKENLER ---
const canvas = document.getElementById("OyunCanvas");
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 680;

const toplar = [];
let oyunBaslangicZamani = Date.now();

const karakter = {
    X : 600,
    Y : 500,
    W : 20,
    H : 20,
    can: 100,
    sonHasarZamani: 0,
    skor: 0,              // Başlangıç skoru
    kombo: 0,             // Hasar almadan yutulan golfçü sayısı
    maxKombo: 0,          // Oyun boyu en yüksek kombo
    toplamYenenGolfcu: 0, // İstatistik için
    oyunBitti: false,     // Oyun durumu kontrolü
    hiz : 4,
    buyuklukCarpani : 3,
    dur: false,
    yemeModu : false,
    yemeBaslangic : 0
};

const tuslar = {
    ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false,
    w: false, a:false, s:false, d: false, " ":false
};

// --- INPUT DİNLEYİCİLERİ ---
window.addEventListener("keydown", (e) => { if(tuslar.hasOwnProperty(e.key)) tuslar[e.key] = true; });
window.addEventListener("keyup", (e) => { if(tuslar.hasOwnProperty(e.key)) tuslar[e.key] = false; });

// --- YARDIMCI FONKSİYONLAR ---

function topFirlat(golfcu) {
    let dx = (karakter.X + karakter.W / 2) - golfcu.x;
    let dy = (karakter.Y + karakter.H / 2) - golfcu.y;
    let aci = Math.atan2(dy, dx);
    toplar.push({ x: golfcu.x, y: golfcu.y, vx: Math.cos(aci) * 3, vy: Math.sin(aci) * 3 });
}

function toplariYonet() {
    for (let i = toplar.length - 1; i >= 0; i--) {
        let t = toplar[i];
        t.x += t.vx; t.y += t.vy;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
        ctx.fill();

        let dx = t.x - (karakter.X + karakter.W / 2);
        let dy = t.y - (karakter.Y + karakter.H / 2);
        let mesafe = Math.sqrt(dx * dx + dy * dy);
        let kYaricap = (karakter.W / 2) * karakter.buyuklukCarpani;

        if (mesafe < kYaricap + 5) {
            let simdi = Date.now();
            if (simdi - karakter.sonHasarZamani > 500) {
                karakter.can -= 10;
                karakter.kombo = 0; // HASAR ALINCA KOMBO SIFIRLANIR
                karakter.sonHasarZamani = simdi;
            }
            toplar.splice(i, 1);
        }
        if (t.x < 0 || t.x > canvas.width || t.y < 0 || t.y > canvas.height) toplar.splice(i, 1);
    }
}

function canBariniCiz() {
    const w = 300, h = 25;
    const x = (canvas.width / 2) - (w / 2), y = canvas.height - 50; 
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = karakter.can > 50 ? "#2ecc71" : "#e74c3c";
    ctx.fillRect(x, y, (Math.max(0, karakter.can) / 100) * w, h);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`CAN: %${Math.floor(karakter.can)}`, canvas.width / 2, y + 18);
}

function skorPaneliCiz() {
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`SKOR: ${karakter.skor}`, 30, 50);
    
    if (karakter.kombo > 0) {
        ctx.fillStyle = karakter.kombo > 10 ? "#f1c40f" : "#3498db";
        ctx.fillText(`KOMBO: x${karakter.kombo}`, 30, 85);
    }
}

function oyunBittiLevhasiCiz() {
    const sure = Math.floor((Date.now() - oyunBaslangicZamani) / 1000);
    const w = 450, h = 350;
    const x = (canvas.width / 2) - (w / 2), y = (canvas.height / 2) - (h / 2);

    // Arka Plan Levha
    ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20); // Modern tarayıcılarda çalışır
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Metinler
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 36px Arial";
    ctx.fillText("OYUN BİTTİ", canvas.width / 2, y + 60);

    ctx.font = "22px Arial";
    ctx.textAlign = "left";
    let textX = x + 60;
    ctx.fillText(`🏆 Toplam Skor: ${karakter.skor}`, textX, y + 120);
    ctx.fillText(`🏌️ Yutulan Golfçü: ${karakter.toplamYenenGolfcu}`, textX, y + 160);
    ctx.fillText(`🔥 Max Kombo: x${karakter.maxKombo}`, textX, y + 200);
    ctx.fillText(`⏱️ Hayatta Kalma: ${sure} sn`, textX, y + 240);

    ctx.font = "italic 18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#aaa";
    ctx.fillText("Tekrar oynamak için sayfayı yenile", canvas.width / 2, y + 310);
}

// --- ANA DÖNGÜ ---
function guncelle() {
    if (karakter.oyunBitti) {
        oyunBittiLevhasiCiz();
        return; 
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Can Kontrolü
    if (karakter.can > 0) {
        karakter.can -= 0.08; 
    } else {
        karakter.can = 0;
        karakter.oyunBitti = true;
    }

    // Saha Çizimi
    ctx.beginPath();
    ctx.lineWidth = 3; ctx.strokeStyle = "black";
    ctx.moveTo(150,20); ctx.lineTo(1050,20); ctx.lineTo(1150,630); ctx.lineTo(50,630); ctx.lineTo(150,20);
    ctx.fillStyle="green"; ctx.fill(); ctx.stroke();

    let oran = (karakter.Y - 20) / (630 - 20);
    let solSinir = 150 - (oran * 100), sagSinir = 1050 + (oran * 100);

    // Yeme Mekanizması ve Kombo/Skor Hesaplama
    if (tuslar[" "] && !karakter.dur) {
        karakter.dur = true; karakter.yemeModu = true;
        karakter.yemeBaslangic = Date.now();
        karakter.buyuklukCarpani = 6; 

        let kMX = karakter.X + (karakter.W / 2), kMY = karakter.Y + (karakter.H / 2);
        let kR = (karakter.W / 2) * karakter.buyuklukCarpani;
        
        // Golfçü Yeme
        for (let i = golfculer.length - 1; i >= 0; i--) {
            let g = golfculer[i];
            let dist = Math.sqrt((kMX-g.x)**2 + (kMY-g.y)**2);
            if (dist < kR) {
                golfculer.splice(i, 1);
                karakter.toplamYenenGolfcu++;
                karakter.kombo++;
                if (karakter.kombo > karakter.maxKombo) karakter.maxKombo = karakter.kombo;

                // Skor Kuralları
                if (karakter.kombo <= 5) karakter.skor += 100;
                else if (karakter.kombo <= 10) karakter.skor += 150;
                else karakter.skor += 200;

                karakter.can = Math.min(100, karakter.can + 10);
            }
        }

        // Kombo > 10 ise Topları Yeme
        if (karakter.kombo > 10) {
            for (let j = toplar.length - 1; j >= 0; j--) {
                let t = toplar[j];
                let distT = Math.sqrt((kMX-t.x)**2 + (kMY-t.y)**2);
                if (distT < kR) {
                    toplar.splice(j, 1);
                    karakter.skor += 500;
                }
            }
        }

        setTimeout(() => { karakter.dur = false; karakter.yemeModu = false; karakter.buyuklukCarpani = 3; }, 500);
    }

    // Hareket ve Çizimler
    if(!karakter.dur){
        if ((tuslar.ArrowUp || tuslar.w) && karakter.Y > 20) karakter.Y -= karakter.hiz;
        if ((tuslar.ArrowDown || tuslar.s) && karakter.Y + karakter.H < 630) karakter.Y += karakter.hiz;
        if ((tuslar.ArrowLeft || tuslar.a) && karakter.X > solSinir) karakter.X -= karakter.hiz;
        if ((tuslar.ArrowRight || tuslar.d) && karakter.X + karakter.W < sagSinir) karakter.X += karakter.hiz;
    }
    
    let gR = (karakter.W / 2) * karakter.buyuklukCarpani;
    if (karakter.yemeModu) {
        let frame = Math.min(6, Math.floor((Date.now() - karakter.yemeBaslangic) / 70)); 
        let img = yemeResimleri[frame];
        if (img && img.complete) {
            ctx.imageSmoothingEnabled = false; 
            let size = gR * 5.5; 
            ctx.drawImage(img, (karakter.X + karakter.W/2) - size/2, (karakter.Y + karakter.H/2) - size/2, size, size);
        }
    } else {
        ctx.fillStyle = "blue"; ctx.beginPath();
        ctx.arc(karakter.X + (karakter.W/2), karakter.Y + (karakter.H/2), gR, 0, 2*Math.PI);
        ctx.fill();
    }

    golfculer.forEach(g => {
        let img = golfcuResimleri[0];
        if (img && img.complete) ctx.drawImage(img, g.x - 100, g.y - 100, 200, 200);
    });

    toplariYonet(); 
    canBariniCiz(); 
    skorPaneliCiz();
    
    requestAnimationFrame(guncelle);
}

// --- BAŞLAT ---
guncelle();
setInterval(golfculeriEkle, 2000);
setInterval(() => { golfculer.forEach(g => topFirlat(g)); }, 2000);