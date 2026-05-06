const webAppUrl = "https://script.google.com/macros/s/AKfycbz0fPLSZOYAkN8RbKpzQCbiXMr7nNjRZ3oeNEf1lc7ED8HZytnuqLTJGXwvUbv6zvKm/exec";

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: { 
        title: "Menu Monitoring", 
        categories: { 
            "Payroll": ["Pipeline PMP", "Pipeline Badan Usaha", "Diluar Pipeline"], 
            "Prioritas": ["Pipeline RTW atau NTB", "Diluar Pipeline", "Pipeline MDS/MDCI/RDPU"], 
            "Pebisnis": ["Pipeline Data Leakage", "Pipeline GMM", "Leads Kopra", "Pipeline nasabah dari Area", "Kawasan Pebisnis", "Non Pipeline dan Non Kawasan"], 
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

const configMap = {
    // MONITORING - PAYROLL
    "Pipeline PMP": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Pipeline Badan Usaha": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Diluar Pipeline": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    
    // MONITORING - PRIORITAS
    "Pipeline RTW atau NTB": { col1: "Nama", col2: "CIF", type2: "select", options: ["RTW", "NTB"] },
    "Pipeline MDS/MDCI/RDPU": { col1: "Nama", col2: "CIF", type2: "select", options: ["MDS", "MDCI", "RDPU"] },
    
    // MONITORING - PEBISNIS (Update: col2 selalu CIF, col3 Product Offering)
    "Pipeline Data Leakage": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC"] },
    "Pipeline GMM": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC"] },
    "Leads Kopra": { col1: "Nama PT", col2: "CIF", hideCol3: true },
    "Pipeline nasabah dari Area": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Kawasan Pebisnis": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Non Pipeline dan Non Kawasan": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    
    // MONITORING - INDIVIDU
    "Pipeline Cakra": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},
    "Kawasan": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},
    "Non pipeline": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},

    // AKUISISI (Tetap Sama)
    "New Mitra Payroll": { col1: "Nomor Mitra", col2: "Nama Mitra", type2: "text" },
    "New CIF Rek Payroll New Mitra": { col1: "Nomor Rekening", hideCol2: true },
    "New Rek Payroll New Mitra": { col1: "Nomor Rekening", hideCol2: true },
    "MTBI": { col1: "Nomor Rekening", hideCol2: true },
    "AXA": { col1: "Jumlah Case / FBI", hideCol2: true },
    "RTW": { col1: "Nomor CIF", hideCol2: true },
    "NTB": { col1: "Nomor CIF", hideCol2: true },
    "MDS": { col1: "Nominal", hideCol2: true },
    "Kopra": { col1: "Nama Perusahaan", hideCol2: true }
};

let currentMenu = ""; 

function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function validateStep1() {
    const codeInput = document.getElementById('branch-code').value.trim();
    const dateInput = document.getElementById('mon-date').value;
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';
    if (!dateInput) { alert("Silahkan isi tanggal pelaporan."); return; }
    if (validCodes.includes(codeInput)) { goToPage('page-main-menu'); } 
    else { errorMsg.style.display = 'block'; }
}

function selectMainMenu(menu) {
    currentMenu = menu;
    const container = document.getElementById('category-options');
    document.getElementById('menu-title').innerText = menuData[menu].title;
    container.innerHTML = "";
    Object.keys(menuData[menu].categories).forEach(cat => {
        const btn = document.createElement('button'); btn.className = 'cat-btn';
        btn.innerText = cat; btn.onclick = () => showSub(cat);
        container.appendChild(btn);
    });
    goToPage('page2');
}

function showSub(catName) {
    const container = document.getElementById('sub-options');
    const dynamicArea = document.getElementById('dynamic-input-area');
    container.innerHTML = ""; dynamicArea.style.display = 'none';
    document.getElementById('sub-title').innerText = "Kategori: " + catName;
    menuData[currentMenu].categories[catName].forEach(sub => {
        const btn = document.createElement('button'); btn.className = 'cat-btn';
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
    const config = configMap[selectedSub] || { col1: "Nama", hideCol2: true };

    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div');
            row.className = "input-row";
            
            // Kolom 1 (Nama / PT)
            let html = `<input type="text" placeholder="${i}. ${config.col1}" class="dynamic-text-input col-main">`;
            
            // Kolom 2 (CIF / Jml / Product)
            if (!config.hideCol2) {
                if (config.type2 === "select") {
                    html += `<select class="number-input-small product-select col-2">
                                <option value="" disabled selected>${config.col2}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else {
                    html += `<input type="text" placeholder="${config.col2}" class="number-input-small col-2">`;
                }
            }

            // Kolom 3 (Khusus Pebisnis: Product Offering)
            if (config.col3 && !config.hideCol3) {
                if (config.type3 === "select") {
                    html += `<select class="number-input-small product-select col-3">
                                <option value="" disabled selected>${config.col3}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else {
                    html += `<input type="text" placeholder="${config.col3}" class="number-input-small col-3">`;
                }
            }

            // Kolom Hasil FU (Hanya Monitoring)
            if (currentMenu === 'monitoring') {
                html += `
                    <select class="status-select col-status" onchange="updateColor(this)">
                        <option value="" disabled selected>Hasil FU</option>
                        <option value="Berminat">Berminat</option>
                        <option value="Tidak berminat">Tidak berminat</option>
                        <option value="Follow up">Follow up</option>
                    </select>`;
            }

            row.innerHTML = html;
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
    
    let destinationSheet = (kategori === "Prioritas") ? "Penginputan Pipeline Prioritas" : 
                           (currentMenu === 'monitoring' ? "Data Detail Penginputan" : "Data Detail Akuisisi");
    
    let dataToSubmit = [];
    for (let row of rows) {
        const col1 = row.querySelector('.col-main').value.trim();
        const col2 = row.querySelector('.col-2') ? row.querySelector('.col-2').value.trim() : "";
        const col3 = row.querySelector('.col-3') ? row.querySelector('.col-3').value.trim() : "";
        const statusVal = row.querySelector('.col-status') ? row.querySelector('.col-status').value : "Selesai";

        // Gabungkan data untuk dikirim ke kolom keterangan di Google Sheet
        // Format: Nama | CIF | Product
        let keteranganGabungan = col1;
        if (col2) keteranganGabungan += " | " + col2;
        if (col3) keteranganGabungan += " | " + col3;

        if (col1 === "" || (currentMenu === 'monitoring' && statusVal === "")) {
            alert("Mohon lengkapi semua baris."); return;
        }

        dataToSubmit.push({
            targetSheet: destinationSheet,
            tanggal, kodeCabang, kategori, subKategori,
            jumlah: "1",
            keterangan: keteranganGabungan,
            status: statusVal
        });
    }

    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim..."; btn.disabled = true;

    try {
        const requests = dataToSubmit.map(payload => 
            fetch(webAppUrl, {
                method: "POST", mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
        );
        await Promise.all(requests);
        alert(`Sukses! Data dikirim ke: ${destinationSheet}`);
        location.reload();
    } catch (err) {
        alert("Terjadi kesalahan: " + err);
        btn.innerText = "Submit Data"; btn.disabled = false;
    }
}    "RTW": "Nomor CIF", 
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

function goBackToCategories() { goToPage('page2'); }    "RTW": "Nomor CIF", 
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
