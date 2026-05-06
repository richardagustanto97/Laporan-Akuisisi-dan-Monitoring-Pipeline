const webAppUrl = "https://script.google.com/macros/s/AKfycbzGGWN4FKf6dVzNuYEWy2SfHCc9J5-9hKeVn99UyC4pmkQVTXdsBah9H2zBWAmfAik4/exec";

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
            "Akuisisi Payroll": ["New Mitra Payroll", "New CIF Rek Payroll New Mitra", "New Rek Payroll New Mitra", "New CIF Rek Payroll Eksisting Mitra", "New Rek Payroll Eksisting Mitra", "MTBI", "AXA"], 
            "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU", "MTBI", "AXA"], 
            "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra", "MTBI", "AXA"], 
            "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "Tab Now non GMM", "MTBI", "AXA"], 
            "Hasil Akuisisi All": ["EDC", "LVM", "Livin", "Kopra", "MDS", "MDCI", "RDPU", "AXA", "Payroll", "Tab Now", "MTB", "Giro", "Multicurrency", "Tab Reguler", "MTR", "Simpel", "MTBI"] 
        } 
    }
};

const placeholderMap = { 
    "Pipeline PMP": "Nama PT", 
    "Pipeline Badan Usaha": "Nama PT", 
    "Diluar Pipeline": "Nama PT", 
    "Pipeline RTW atau NTB": "Nama Nasabah", // Sesuai Screenshot 2026-05-06 at 12.38.50.png
    "New CIF Rek Payroll New Mitra": "Nomor CIF",
    "New Rek Payroll New Mitra": "Nomor Rekening",
    "New CIF Rek Payroll Eksisting Mitra": "Nomor CIF",
    "New Rek Payroll Eksisting Mitra": "Nomor Rekening",
    "AXA": "Jumlah Case / FBI",
    "RTW": "Nomor CIF", 
    "NTB": "Nomor CIF", 
    "MDS": "Nominal", 
    "Kopra": "Nama Perusahaan"
};

let currentMenu = ""; 

function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function validateStep1() {
    const codeInput = document.getElementById('branch-code').value.trim();
    const dateInput = document.getElementById('mon-date').value;
    if (dateInput === "") { alert("Silahkan isi tanggal."); return; }
    if (validCodes.includes(codeInput)) { goToPage('page-main-menu'); } 
    else { document.getElementById('error-msg').style.display = 'block'; }
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

function updateColor(selectElement) {
    selectElement.classList.remove('bg-berminat', 'bg-followup', 'bg-tidak');
    if (selectElement.value === "Berminat") selectElement.classList.add('bg-berminat');
    else if (selectElement.value === "Follow up") selectElement.classList.add('bg-followup');
    else if (selectElement.value === "Tidak berminat") selectElement.classList.add('bg-tidak');
}

function generateTextInputs() {
    const count = document.getElementById('follow-up-count').value;
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    const selectedCat = document.getElementById('dynamic-input-area').getAttribute('data-selected-cat');
    
    container.innerHTML = ""; 
    const placeholderText = placeholderMap[selectedSub] || "Nama Nasabah";
    
    // Tentukan label untuk kolom tengah (angka/CIF)
    let midPlaceholder = (selectedCat === "Prioritas") ? "CIF / Jika Baru 0" : "Jml";

    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div');
            row.className = "input-row";
            if (currentMenu === 'monitoring') {
                row.innerHTML = `
                    <input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input">
                    <input type="text" placeholder="${midPlaceholder}" class="number-input-small">
                    <select class="status-select" onchange="updateColor(this)">
                        <option value="" disabled selected>Status</option>
                        <option value="Berminat">Berminat</option>
                        <option value="Follow up">Follow up</option>
                        <option value="Tidak berminat">Tidak berminat</option>
                    </select>`;
            } else {
                row.innerHTML = `<input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input" style="flex: 1;">`;
            }
            container.appendChild(row);
        }
    }
}

async function submitFinalData() {
    const tanggal = document.getElementById('mon-date').value;
    const kodeCabang = document.getElementById('branch-code').value;
    const kategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-cat');
    const subKategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    const rows = document.querySelectorAll('.input-row');
    
    // Tentukan sheet tujuan berdasarkan kategori
    let destinationSheet;
    if (kategori === "Prioritas") {
        destinationSheet = "Penginputan Pipeline Prioritas";
    } else {
        destinationSheet = (currentMenu === 'monitoring') ? "Data Detail Penginputan" : "Data Detail Akuisisi";
    }
    
    let allValid = true;
    let dataToSubmit = [];

    for (let row of rows) {
        const ketInput = row.querySelector('.dynamic-text-input');
        const numInput = row.querySelector('.number-input-small');
        const statusSelect = row.querySelector('.status-select');
        
        const ketValue = ketInput ? ketInput.value.trim() : "";
        const numValue = numInput ? numInput.value.trim() : "";
        const statusValue = statusSelect ? statusSelect.value : "";

        // Validasi: Semua kolom wajib isi sesuai Screenshot 2026-05-06 at 12.02.15.png
        if (ketValue === "" || (currentMenu === 'monitoring' && (numValue === "" || statusValue === ""))) {
            allValid = false;
            break;
        }

        dataToSubmit.push({
            targetSheet: destinationSheet,
            tanggal: tanggal,
            kodeCabang: kodeCabang,
            kategori: kategori,
            subKategori: subKategori,
            jumlah: numValue, // Akan masuk ke kolom E dan G di Apps Script
            keterangan: ketValue,
            status: statusValue
        });
    }

    if (!allValid || dataToSubmit.length === 0) {
        alert("Mohon lengkapi SEMUA kolom (Nama, CIF/Jml, dan Status) sebelum mengirim.");
        return;
    }

    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    try {
        for (let payload of dataToSubmit) {
            await fetch(webAppUrl, { 
                method: "POST", 
                mode: "no-cors", 
                body: JSON.stringify(payload) 
            });
        }
        alert(`Berhasil! Data telah tersimpan di ${destinationSheet}.`);
        location.reload();
    } catch (err) {
        alert("Gagal mengirim data: " + err);
        btn.innerText = "Submit Data";
        btn.disabled = false;
    }
}

function goBackToCategories() { goToPage('page2'); }    else { document.getElementById('error-msg').style.display = 'block'; }
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

function updateColor(selectElement) {
    selectElement.classList.remove('bg-berminat', 'bg-followup', 'bg-tidak');
    if (selectElement.value === "Berminat") selectElement.classList.add('bg-berminat');
    else if (selectElement.value === "Follow up") selectElement.classList.add('bg-followup');
    else if (selectElement.value === "Tidak berminat") selectElement.classList.add('bg-tidak');
}

function generateTextInputs() {
    const count = document.getElementById('follow-up-count').value;
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    container.innerHTML = ""; 
    const placeholderText = placeholderMap[selectedSub] || "Masukkan detail";
    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div');
            row.className = "input-row";
            if (currentMenu === 'monitoring') {
                row.innerHTML = `
                    <input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input">
                    <input type="number" placeholder="Jml" class="number-input-small">
                    <select class="status-select" onchange="updateColor(this)">
                        <option value="" disabled selected>Status</option>
                        <option value="Berminat">Berminat</option>
                        <option value="Follow up">Follow up</option>
                        <option value="Tidak berminat">Tidak berminat</option>
                    </select>`;
            } else {
                row.innerHTML = `<input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input" style="flex: 1;">`;
            }
            container.appendChild(row);
        }
    }
}

async function submitFinalData() {
    const tanggal = document.getElementById('mon-date').value;
    const kodeCabang = document.getElementById('branch-code').value;
    const kategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-cat');
    const subKategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    const rows = document.querySelectorAll('.input-row');
    let destinationSheet = (currentMenu === 'monitoring') ? "Penginputan Pipeline Payroll" : "Data Detail Akuisisi";
    
    let allValid = true;
    let dataToSubmit = [];

    for (let row of rows) {
        const ketValue = row.querySelector('.dynamic-text-input').value.trim();
        const numInput = row.querySelector('.number-input-small');
        const numValue = numInput ? numInput.value : 1;
        const statusSelect = row.querySelector('.status-select');
        const statusValue = statusSelect ? statusSelect.value : "";

        if (ketValue === "" || (currentMenu === 'monitoring' && (statusValue === "" || numValue === ""))) {
            allValid = false;
            break;
        }

        dataToSubmit.push({
            targetSheet: destinationSheet,
            tanggal, kodeCabang, kategori, subKategori,
            jumlah: numValue,
            keterangan: ketValue,
            status: statusValue
        });
    }

    if (!allValid || dataToSubmit.length === 0) {
        alert("Mohon lengkapi SEMUA kolom input, jumlah, dan status.");
        return;
    }

    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    try {
        for (let payload of dataToSubmit) {
            await fetch(webAppUrl, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
        }
        alert(`Berhasil disimpan!`);
        location.reload();
    } catch (err) {
        alert("Gagal: " + err);
        btn.innerText = "Submit Data";
        btn.disabled = false;
    }
}

function goBackToCategories() { goToPage('page2'); }
