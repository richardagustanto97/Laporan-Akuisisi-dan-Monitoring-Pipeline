// ==========================================
// 1. KONFIGURASI & DATA MASTER
// ==========================================
const webAppUrl = "https://script.google.com/macros/s/AKfycbwRIcuS9p1rGAj0JvlGMzKUHj6gev0KfekjlnBtNDjrxHpNrJTpRNKiXPfkvk6oMe7B/exec";

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: {
        title: "Menu Monitoring",
        categories: {
            "Payroll": ["Pipeline PMP", "Pipeline Badan Usaha", "Diluar Pipeline"],
            "Prioritas": ["Pipeline RTW atau NTB", "Diluar Pipeline"],
            "Pebisnis": ["Pipeline Data Leakage", "Pipeline GMM", "Leads Kopra", "Pipeline nasabah dari Area", "Kawasan", "Non Pipeline dan Non Kawasan"],
            "Individu": ["Pipeline Cakra", "Kawasan", "Non pipeline"]
        }
    },
    akuisisi: {
        title: "Menu Akuisisi",
        categories: {
            "Akuisisi Payroll": ["New Mitra Payroll", "New CIF Payroll", "New Payroll", "Eksisting Payroll", "MTBI", "AXA"],
            "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU", "MTBI", "AXA"],
            "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra", "MTBI", "AXA"],
            "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "Tab Now non GMM", "MTBI", "AXA"],
            "Hasil Akuisisi All": ["EDC", "LVM", "Livin", "Kopra", "MDS", "MDCI", "RDPU", "AXA", "Payroll", "Tab Now", "MTB", "Giro", "Multicurrency", "Tab Reguler", "MTR", "Simpel", "MTBI"]
        }
    }
};

// PEMETAAN PLACEHOLDER SESUAI SUB-KATEGORI
const placeholderMap = {
    // MONITORING
    "Pipeline PMP": "Nama PT / Jml Prospek / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline Badan Usaha": "Nama PT / Jml Prospek / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Diluar Pipeline": "Nama PT / Jml Prospek / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline RTW atau NTB": "Nama / Product offering /Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline Data Leakage": "Nama / Product offering (LVM/EDC) /Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline GMM": "Nama / Product offering (LVM/EDC) / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Leads Kopra": "Nama PT / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline nasabah dari Area": "Nama / Product offering (LVM/EDC/Kopra) / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Kawasan": "Nama / Product offering (LVM/EDC/Kopra) / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Non Pipeline dan Non Kawasan": "Nama / Product offering (LVM/EDC/Kopra) / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Pipeline Cakra": "Nama / Product offering / Hasil FU (Berminat/tdk berminat/FU lagi)",
    "Non pipeline": "Nama / Product offering / Hasil FU (Berminat/tdk berminat/FU lagi)",

    // AKUISISI PAYROLL
    "New Mitra Payroll": "Nomor Mitra / Nama Mitra",
    "New CIF Payroll": "Nomor Rekening",
    "New Payroll": "Nomor Rekening",
    "Eksisting Payroll": "Nomor Rekening",
    "AXA": "Jumlah Case / FBI",

    // AKUISISI PRIORITAS & HASIL ALL
    "RTW": "Nomor CIF",
    "NTB": "Nomor CIF",
    "MDS": "Nominal",
    "MDCI": "Nominal",
    "RDPU": "Nominal",

    // AKUISISI PEBISNIS
    "MTB": "Nomor Rekening",
    "Giro": "Nomor Rekening",
    "EDC": "Nama Aplikasi (Nasabah)",
    "LVM": "Nama Aplikasi (Nasabah)",
    "Kopra": "Nama Perusahaan / Aplikasi",

    // AKUISISI INDIVIDU & LAINNYA
    "GMM": "Nomor Rekening",
    "Livin": "Nomor Rekening",
    "Simpel": "Nomor Rekening",
    "Tab Reguler": "Nomor Rekening",
    "Multicurrency": "Nomor Rekening",
    "MTR": "Nomor Rekening",
    "Tab Now non GMM": "Nomor Rekening",
    "Tab Now": "Nomor Rekening",
    "MTBI": "Nomor Rekening"
};

let currentMenu = ""; 

// ==========================================
// 2. FUNGSI NAVIGASI
// ==========================================
function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function validateStep1() {
    const codeInput = document.getElementById('branch-code').value.trim();
    const dateInput = document.getElementById('mon-date').value;
    if (dateInput === "") { alert("Silahkan isi tanggal."); return; }
    if (validCodes.includes(codeInput)) {
        goToPage('page-main-menu');
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

function selectMainMenu(menu) {
    currentMenu = menu;
    const container = document.getElementById('category-options');
    document.getElementById('menu-title').innerText = menuData[menu].title;
    container.innerHTML = "";
    Object.keys(menuData[menu].categories).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = cat;
        btn.onclick = () => showSub(cat);
        container.appendChild(btn);
    });
    goToPage('page2');
}

function showSub(catName) {
    const container = document.getElementById('sub-options');
    const dynamicArea = document.getElementById('dynamic-input-area');
    container.innerHTML = "";
    dynamicArea.style.display = 'none';
    document.getElementById('sub-title').innerText = "Kategori: " + catName;

    menuData[currentMenu].categories[catName].forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = sub;
        btn.onclick = function() {
            document.getElementById('question-label').innerText = `Input detail untuk: ${sub}`;
            dynamicArea.style.display = 'block';
            document.getElementById('text-inputs-container').innerHTML = "";
            document.getElementById('follow-up-count').value = "";
            dynamicArea.setAttribute('data-selected-sub', sub);
            dynamicArea.setAttribute('data-selected-cat', catName);
        };
        container.appendChild(btn);
    });
    goToPage('page3');
}

// ==========================================
// 3. LOGIKA INPUT & PENGIRIMAN
// ==========================================
function generateTextInputs() {
    const count = document.getElementById('follow-up-count').value;
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    
    container.innerHTML = ""; 
    
    // Ambil placeholder sesuai pemetaan, jika tidak ada gunakan default
    const placeholderText = placeholderMap[selectedSub] || "Masukkan detail keterangan";

    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${i}. ${placeholderText}`;
            input.className = "dynamic-text-input";
            input.style.marginBottom = "10px";
            container.appendChild(input);
        }
    }
}

async function submitFinalData() {
    const tanggal = document.getElementById('mon-date').value;
    const kodeCabang = document.getElementById('branch-code').value;
    const kategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-cat');
    const subKategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    const textInputs = document.querySelectorAll('.dynamic-text-input');
    
    let destinationSheet = (currentMenu === 'monitoring') ? "Data Detail Penginputan" : "Data Detail Akuisisi";

    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    try {
        for (let input of textInputs) {
            if (input.value.trim() !== "") {
                const payload = {
                    targetSheet: destinationSheet,
                    tanggal: tanggal,
                    kodeCabang: kodeCabang,
                    kategori: kategori,
                    subKategori: subKategori,
                    jumlah: 1,
                    keterangan: input.value.trim()
                };

                await fetch(webAppUrl, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(payload)
                });
            }
        }
        alert(`Data berhasil disimpan di: ${destinationSheet}`);
        location.reload();
    } catch (err) {
        alert("Gagal: " + err);
        btn.innerText = "Submit Data";
        btn.disabled = false;
    }
}

function goBackToCategories() { goToPage('page2'); }
function goBackToMainMenu() { goToPage('page-main-menu'); }