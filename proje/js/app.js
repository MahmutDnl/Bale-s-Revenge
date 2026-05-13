const sesler = {
    arkaPlan : new Audio("../assets/sounds/background.mp3"),
    yeme: new Audio("../assets/sounds/eat.mp3"),
    vurus: new Audio("../assets/sounds/hit.mp3"),
    hasar: new Audio("../assets/sounds/in.mp3")
}

sesler.arkaPlan.loop=true;
sesler.arkaPlan.volume=0.2;

function istenilenSes(sesIsmi){
    const s =  sesler[sesIsmi];
    if(s){
        s.currentTime = 0;
        s.play();
    }

}


let oyunBaslangicZamani = Date.now();

const holeResimleri = {
    usteGidenHole: new Image(), altaGidenHole: new Image(), solaGidenHole: new Image(), sagaGidenHole: new Image(),
    solUsteGidenHole: new Image(), sagUsteGidenHole: new Image(), solAltaGidenHole: new Image(), sagAltaGidenHole: new Image(),
    dur: new Image()
};

holeResimleri.usteGidenHole.src = "../assets/hole/usteGidenHole.png";
holeResimleri.altaGidenHole.src = "../assets/hole/altaGidenHole.png";
holeResimleri.solaGidenHole.src = "../assets/hole/solaGidenHole.png";
holeResimleri.sagaGidenHole.src = "../assets/hole/sagaGidenHole.png";
holeResimleri.solUsteGidenHole.src = "../assets/hole/solUsteGidenHole.png";
holeResimleri.sagUsteGidenHole.src = "../assets/hole/sagUsteGidenHole.png";
holeResimleri.solAltaGidenHole.src = "../assets/hole/solAltaGidenHole.png";
holeResimleri.sagAltaGidenHole.src = "../assets/hole/sagAltaGidenHole.png";
holeResimleri.dur.src = "../assets/hole/1.png";

const golfcuResimleri = [];
for (let i = 1; i <= 6; i++) {
    let img = new Image();
    img.src = `../assets/golfcu/${i}.png`;
    golfcuResimleri.push(img);
}
const yemeResimleri = [];
for (let i = 1; i <= 7; i++) {
    let img = new Image();
    img.src = `../assets/yeme/${i}.png`;
    yemeResimleri.push(img);
}

const topResimleri = [];
for (let i = 1; i <= 5; i++) {
    let img = new Image();
    img.src = `../assets/ball/${i}.png`;
    topResimleri.push(img);
}

const canvas = document.getElementById("OyunCanvas");
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 680;

const karakter = {
    X: 600,
    Y: 500,
    W: 20,
    H: 20,

    hiz: 3,
    color: "blue",
    buyuklukCarpani: 25,
    dur: false,
    yemeModu: false,
    yemeBaslangic: 0,
    toplamYenenGolfcu: 0,
    oyunBitti: false,
    can: 100,
    sonHasarZamani: 0,
    skor: 0,
    kombo: 0,
    maxKombo: 0
};

// ─── SABİT HİTBOX YARIÇAPI ───────────────────────────────────────────────────
// Görselin büyüklüğünden (buyuklukCarpani) tamamen bağımsız.
// Karakterin merkez noktasından bu kadar piksel uzaklık = "vuruldu".
const HITBOX_YARICAP = 28;

const tuslar = {
    ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false,
    w: false, a: false, s: false, d: false, " ": false
};

// ─── TEK BİR KEYDOWN DİNLEYİCİ ───────────────────────────────────────────────
// Önceden iki ayrı "keydown" listener vardı; birleştirdik.
window.addEventListener("keydown", (e) => {
    
    if (sesler.arkaPlan.paused) {
        istenilenSes("arkaPlan");
    }

    if (tuslar.hasOwnProperty(e.key)) {
        tuslar[e.key] = true;
    }
    
    if (karakter.oyunBitti && (e.key === "r" || e.key === "R")) {
        location.reload();
    }
});

window.addEventListener("keyup", (e) => {
    if (tuslar.hasOwnProperty(e.key)) {
        tuslar[e.key] = false;
    }
});

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
    ctx.font = "bold 25px Arial";
    ctx.fillText(`SKOR: ${karakter.skor}`, 0, 30);

    if (karakter.kombo > 0) {
        ctx.fillStyle = karakter.kombo > 10 ? "#f1c40f" : "#3498db";
        ctx.fillText(`KOMBO: x${karakter.kombo}`, 0, 50);
    }
}

function oyunBittiLevhasiCiz() {
    const sure = Math.floor((Date.now() - oyunBaslangicZamani) / 1000);
    const w = 450, h = 350;
    const x = (canvas.width / 2) - (w / 2), y = (canvas.height / 2) - (h / 2);

    ctx.fillStyle = "rgba(20, 20, 20, 0.95)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 20);
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 36px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2, y + 60);

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
    ctx.fillText("Tekrar oynamak için R tuşuna basınız.", canvas.width / 2, y + 310);
}

function golfcuAtisYap(golfcu) {
    golfcu.top.active = true;
    golfcu.top.yerde = false;

    golfcu.top.x = golfcu.x;
    golfcu.top.y = golfcu.y;

    // ─── HEDEF: Karakterin MERKEZ noktası ────────────────────────────────────
    // Köşe koordinatı yerine merkezi kullanmak topun tam ortaya gitmesini sağlar.
    golfcu.top.targetX = karakter.X + karakter.W / 2;
    golfcu.top.targetY = karakter.Y + karakter.H / 2;

    golfcu.top.baslangicX = golfcu.x;
    golfcu.top.baslangicY = golfcu.y;

    let dx = golfcu.top.targetX - golfcu.x;
    let dy = golfcu.top.targetY - golfcu.y;
    let mesafe = Math.sqrt(dx * dx + dy * dy);

    let topHizi = 3;
    golfcu.top.vx = (dx / mesafe) * topHizi;
    golfcu.top.vy = (dy / mesafe) * topHizi;
}

function guncelle() {
    if (karakter.oyunBitti) {
        oyunBittiLevhasiCiz();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (karakter.can > 0) {
        karakter.can -= 0.05;
    } else {
        karakter.can = 0;
        karakter.oyunBitti = true;
    }

    // ─── YEŞİL ALAN ──────────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineJoin = "miter";
    ctx.strokeStyle = "black";
    ctx.moveTo(150, 20);
    ctx.lineTo(1050, 20);
    ctx.lineTo(1150, 630);
    ctx.lineTo(50, 630);
    ctx.lineTo(150, 20);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();

    let oran = (karakter.Y - 20) / (630 - 20);
    let solSinir = 150 - (oran * 100);
    let sagSinir = 1050 + (oran * 100);

    // ─── SPACE (YEME MODU) ────────────────────────────────────────────────────
    if (tuslar[" "] && !karakter.dur) {
        karakter.dur = true;
        karakter.yemeModu = true;
        karakter.yemeBaslangic = Date.now();
        karakter.buyuklukCarpani = 3;

        // Yeme modunda çarpışma: karakter merkezinden sabit HITBOX_YARICAP * 4
        // (space animasyonu daha büyük görünür; yeme alanı biraz daha geniş tutuldu)
        let kMerkezX = karakter.X + karakter.W / 2;
        let kMerkezY = karakter.Y + karakter.H / 2;
        let yemeAlani = HITBOX_YARICAP * 4; // 112px — yeme animasyonuyla orantılı

        for (let i = golfculer.length - 1; i >= 0; i--) {
            let g = golfculer[i];
            let dx = kMerkezX - g.x;
            let dy = kMerkezY - g.y;
            let mesafe = Math.sqrt(dx * dx + dy * dy);

            if (mesafe < yemeAlani) {

                
                istenilenSes("yeme");
                golfculer.splice(i, 1);
                karakter.toplamYenenGolfcu++;
                karakter.kombo++;
                if (karakter.kombo > karakter.maxKombo) {
                    karakter.maxKombo = karakter.kombo;
                }
                if (karakter.kombo <= 5) {
                    karakter.skor += 100;
                } else if (karakter.kombo <= 10) {
                    karakter.skor += 150;
                } else {
                    karakter.skor += 200;
                }
                karakter.can = Math.min(100, karakter.can + 25);
            }
        }

        setTimeout(() => {
            karakter.dur = false;
            karakter.yemeModu = false;
            karakter.buyuklukCarpani = 25;
        }, 300);
    }

    // ─── KARAKTER HAREKETİ ────────────────────────────────────────────────────
    if (!karakter.dur) {
        if ((tuslar.w || tuslar.ArrowUp) && (tuslar.d || tuslar.ArrowRight)) {
            karakter.bakilanYon = "sagUsteGidenHole";
        } else if ((tuslar.w || tuslar.ArrowUp) && (tuslar.a || tuslar.ArrowLeft)) {
            karakter.bakilanYon = "solUsteGidenHole";
        } else if ((tuslar.s || tuslar.ArrowDown) && (tuslar.d || tuslar.ArrowRight)) {
            karakter.bakilanYon = "sagAltaGidenHole";
        } else if ((tuslar.s || tuslar.ArrowDown) && (tuslar.a || tuslar.ArrowLeft)) {
            karakter.bakilanYon = "solAltaGidenHole";
        } else if (tuslar.w || tuslar.ArrowUp) {
            karakter.bakilanYon = "usteGidenHole";
        } else if (tuslar.s || tuslar.ArrowDown) {
            karakter.bakilanYon = "altaGidenHole";
        } else if (tuslar.a || tuslar.ArrowLeft) {
            karakter.bakilanYon = "solaGidenHole";
        } else if (tuslar.d || tuslar.ArrowRight) {
            karakter.bakilanYon = "sagaGidenHole";
        } else {
            karakter.bakilanYon = "dur";
        }

        if ((tuslar.ArrowUp || tuslar.w) && karakter.Y > 20) {
            karakter.Y -= karakter.hiz;
            let yeniOran = (karakter.Y - 20) / (630 - 20);
            let yeniSolSinir = 150 - (yeniOran * 100);
            let yeniSagSinir = 1050 + (yeniOran * 100);
            if (karakter.X < yeniSolSinir) karakter.X = yeniSolSinir;
            if (karakter.X + karakter.W > yeniSagSinir) karakter.X = yeniSagSinir - karakter.W;
        }
        if ((tuslar.ArrowDown || tuslar.s) && karakter.Y + karakter.H < 630) {
            karakter.Y += karakter.hiz;
        }
        if ((tuslar.ArrowLeft || tuslar.a) && karakter.X > solSinir) {
            karakter.X -= karakter.hiz;
        }
        if ((tuslar.ArrowRight || tuslar.d) && karakter.X + karakter.W < sagSinir) {
            karakter.X += karakter.hiz;
        }
    }

    // ─── KARAKTER GÖRSELİ ────────────────────────────────────────────────────
    let guncelBoy = karakter.W * karakter.buyuklukCarpani;

    if (karakter.yemeModu) {
        let gecenSure = Date.now() - karakter.yemeBaslangic;
        let frameIndex = Math.min(Math.floor(gecenSure / 70), 6);
        let aktifYemeResmi = yemeResimleri[frameIndex];
        if (aktifYemeResmi && aktifYemeResmi.complete) {
            ctx.imageSmoothingEnabled = false;
            let animasyonBoy = guncelBoy * 5.5;
            ctx.drawImage(
                aktifYemeResmi,
                (karakter.X + karakter.W / 2) - animasyonBoy / 2,
                (karakter.Y + karakter.H / 2) - animasyonBoy / 2,
                animasyonBoy, animasyonBoy
            );
        }
    } else {
        let aktifHoleResmi = holeResimleri[karakter.bakilanYon];
        if (aktifHoleResmi && aktifHoleResmi.complete) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                aktifHoleResmi,
                (karakter.X + karakter.W / 2) - guncelBoy / 2,
                (karakter.Y + karakter.H / 2) - guncelBoy / 2,
                guncelBoy, guncelBoy
            );
        }
    }

    // ─── GOLFÇÜ DÖNGÜSÜ ──────────────────────────────────────────────────────
    golfculer.forEach(golfcu => {
        let simdi = Date.now();

        // A. ANİMASYON KARELEME
        if (golfcu.animasyonDevam) {
            if (simdi - golfcu.lastFrameTime > golfcu.frameDelay) {
                if (golfcu.currentFrame < 5) {
                    golfcu.currentFrame++;
                    golfcu.lastFrameTime = simdi;
                } else {
                    golfcu.animasyonDevam = false;
                    
                    golfcuAtisYap(golfcu);
                    istenilenSes("vurus");
                }
            }
        }

        // B. TOP HAREKETİ — SADECE BİR KEZ ───────────────────────────────────
        // ÖNCEKİ HATA: top.x += vx satırı iki ayrı if bloğunda çalışıyordu.
        // Bu yüzden top her frame'de iki kez ilerliyordu (2x hız).
        // Düzeltme: Hareket tek blokta; çarpışma kontrolü ardından ayrı yapılır.
        if (golfcu.top.active && !golfcu.top.yerde) {
            // — Topun tek hareketi —
            golfcu.top.x += golfcu.top.vx;
            golfcu.top.y += golfcu.top.vy;

            // 400 birim sonra top yere düşer, golfçü topu almaya gider
            let farkX = golfcu.top.x - golfcu.top.baslangicX;
            let farkY = golfcu.top.y - golfcu.top.baslangicY;
            if (Math.sqrt(farkX * farkX + farkY * farkY) >= 400) {
                golfcu.top.yerde = true;
                golfcu.top.vx = 0;
                golfcu.top.vy = 0;
                golfcu.mod = "topuAl";
            }

            // ─── ÇARPIŞMA KONTROLÜ ────────────────────────────────────────────
            // Karakter MERKEZİ ile topun konumu arasındaki gerçek mesafeyi ölç.
            // buyuklukCarpani veya W*H bu hesabı etkilemez.
            let kMerkezX = karakter.X + karakter.W / 2;
            let kMerkezY = karakter.Y + karakter.H / 2;
            let dx = kMerkezX - golfcu.top.x;
            let dy = kMerkezY - golfcu.top.y;
            let mesafe = Math.sqrt(dx * dx + dy * dy);

            if (mesafe < HITBOX_YARICAP) {
                golfcu.top.active = false;

                istenilenSes("hasar");
                karakter.can -= 20;
                karakter.kombo = 0;
                // Golfçü yeniden atışa hazırlanır
                golfcu.mod = "atis";
                golfcu.animasyonDevam = true;
                golfcu.currentFrame = 0;
            }

            // Top dönme animasyonu
            if (simdi - golfcu.top.lastFrameTime > 70) {
                golfcu.top.frame = (golfcu.top.frame + 1) % 5;
                golfcu.top.lastFrameTime = simdi;
            }
        }

        // C. GOLFÇÜ TOPU ALMAYA GİDER
        if (golfcu.mod === "topuAl") {
            topuAlmayaGit(golfcu);
        }

        // D. GOLFÇÜ GÖRSELİ
        let gResim = golfcuResimleri[golfcu.currentFrame];
        if (gResim && gResim.complete && gResim.naturalWidth > 0) {
            let cizimY = golfcu.y + (golfcu.sekmeY || 0);
            ctx.drawImage(gResim, golfcu.x - 50, cizimY - 50, 100, 100);
        } else {
            ctx.fillStyle = "orange";
            ctx.fillRect(golfcu.x - 10, (golfcu.y + (golfcu.sekmeY || 0)) - 10, 20, 20);
        }

        // E. TOP GÖRSELİ
        if (golfcu.top.active) {
            let tResim = topResimleri[golfcu.top.frame];
            if (tResim && tResim.complete && tResim.naturalWidth > 0) {
                ctx.drawImage(tResim, golfcu.top.x - 10, golfcu.top.y - 10, 30, 30);
            }
        }
    });

    canBariniCiz();
    skorPaneliCiz();
    requestAnimationFrame(guncelle);
}

guncelle();
setInterval(golfculeriEkle, 2000);