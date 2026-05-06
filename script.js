const webAppUrl = "https://script.google.com/macros/s/AKfycbwRIcuS9p1rGAj0JvlGMzKUHj6gev0KfekjlnBtNDjrxHpNrJTpRNKiXPfkvk6oMe7B/exec";

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: { title: "Menu Monitoring", categories: { "Payroll": ["Pipeline PMP", "Pipeline Badan Usaha", "Diluar Pipeline"], "Prioritas": ["Pipeline RTW atau NTB", "Diluar Pipeline"], "Pebisnis": ["Pipeline Data Leakage", "Pipeline GMM", "Leads Kopra", "Pipeline nasabah dari Area", "Kawasan", "Non Pipeline dan Non Kawasan"], "Individu": ["Pipeline Cakra", "Kawasan", "Non pipeline"] } },
    akuisisi: { title: "Menu Akuisisi", categories: { "Akuisisi Payroll": ["New Mitra Payroll", "New CIF Payroll", "New Payroll", "Eksisting Payroll", "MTBI", "AXA"], "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU", "MTBI", "AXA"], "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra", "MTBI", "AXA"], "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "Tab Now non GMM", "MTBI", "AXA"], "Hasil Akuisisi All": ["EDC", "LVM", "Livin", "Kopra", "MDS", "MDCI", "RDPU", "AXA", "Payroll", "Tab Now", "MTB", "Giro", "Multicurrency", "Tab Reguler", "MTR", "Simpel", "MTBI"] } }
};

const placeholderMap = { "Pipeline PMP": "Nama PT / Jml Prospek", "Pipeline Badan Usaha": "Nama PT / Jml Prospek", "Diluar Pipeline": "Nama PT / Jml Prospek", "Pipeline RTW atau NTB": "Nama / Product offering", "Pipeline Data Leakage": "Nama / Product offering (LVM/EDC)", "Pipeline GMM": "Nama / Product offering (LVM/EDC)", "Leads Kopra": "Nama PT", "Pipeline nasabah dari Area": "Nama / Product offering (LVM/EDC/Kopra)", "Kawasan": "Nama / Product offering (LVM/EDC/Kopra)", "Non Pipeline dan Non Kawasan": "Nama / Product offering (LVM/EDC/Kopra)", "Pipeline Cakra": "Nama / Product offering", "Non pipeline": "Nama / Product offering", "New Mitra Payroll": "Nomor Mitra / Nama Mitra", "New CIF Payroll": "Nomor Rekening", "AXA": "Jumlah Case / FBI", "RTW": "Nomor CIF", "NTB": "Nomor CIF", "MDS": "Nominal", "MTB": "Nomor Rekening", "EDC": "Nama Aplikasi (Nasabah)", "Kopra": "Nama Perusahaan / Aplikasi" };

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
    container.innerHTML = ""; 
    const placeholderText = placeholderMap[selectedSub] || "Masukkan detail";
    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div');
            row.className = "input-row";
            if (currentMenu === 'monitoring') {
                row.innerHTML = `<input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input"><select class="status-select" onchange="updateColor(this)"><option value="" disabled selected>Status</option><option value="Berminat">Berminat</option><option value="Follow up">Follow up</option><option value="Tidak berminat">Tidak berminat</option></select>`;
            } else {
                row.innerHTML = `<input type="text" placeholder="${i}. ${placeholderText}" class="dynamic-text-input" style="flex: 1;">`;
            }
            container.appendChild(row);
        }
    }
}

async function submitFinalData() {
    // ... (ambil data tanggal, kode cabang, dll) ...

    try {
        for (let row of rows) {
            const ketInput = row.querySelector('.dynamic-text-input');
            const statusSelect = row.querySelector('.status-select'); 
            const ketValue = ketInput ? ketInput.value.trim() : "";
            const statusValue = statusSelect ? statusSelect.value : "";
            
            if (ketValue !== "") {
                const payload = { 
                    targetSheet: destinationSheet, 
                    tanggal: tanggal, 
                    kodeCabang: kodeCabang, 
                    kategori: kategori, 
                    subKategori: subKategori, 
                    jumlah: 1, 
                    keterangan: ketValue, // Hanya berisi nama nasabah/PT
                    status: statusValue    // Status dikirim sebagai variabel baru
                };

                await fetch(webAppUrl, { 
                    method: "POST", 
                    mode: "no-cors", 
                    body: JSON.stringify(payload) 
                });
            }
        }
        alert(`Berhasil disimpan!`);
        location.reload();
    } catch (err) {
        alert("Gagal: " + err);
    }
}

function goBackToCategories() { goToPage('page2'); }
