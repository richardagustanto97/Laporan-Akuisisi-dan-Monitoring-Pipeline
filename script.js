const webAppUrl = "https://script.google.com/macros/s/AKfycbxH-i_snYrKcRrmxPCciEAtn2YHUvd4iAtg3cspbNber6nRqkAu_Uf5iamnigB-Zm0P/exec";

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: { 
        title: "Menu Monitoring", 
        categories: { 
            "Payroll": ["Pipeline PMP", "Pipeline Badan Usaha", "Diluar Pipeline"], 
            "Prioritas": ["Pipeline RTW atau NTB", "Diluar Pipeline Prio", "Pipeline MDS/MDCI/RDPU"], 
            "Pebisnis": ["Pipeline Data Leakage", "Pipeline GMM", "Leads Kopra", "Pipeline nasabah dari Area", "Kawasan Pebisnis", "Non Pipeline dan Non Kawasan"], 
            "Individu": ["Pipeline Cakra", "Kawasan", "Non pipeline"] 
        } 
    },
    akuisisi: { 
        title: "Menu Akuisisi", 
        categories: { 
            "Akuisisi Payroll": ["New Mitra Payroll", "New CIF Rek Payroll New Mitra", "New Rek Payroll New Mitra", "New CIF Rek Payroll Eksisting Mitra", "New Rek Payroll Eksisting Mitra"], 
            "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU"], 
            "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra"], 
            "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "Tab Now non GMM"],
            "Akuisisi MTBI & AXA": ["MTBI", "AXA"]
        } 
    }
};

const configMap = {
    "Pipeline PMP": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Pipeline Badan Usaha": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Diluar Pipeline": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Pipeline RTW atau NTB": { col1: "Nama Nasabah", col2: "CIF", col3: "Product Offering", type3: "select", options: ["RTW", "NTB"] },
    "Pipeline MDS/MDCI/RDPU": { col1: "Nama Nasabah", col2: "CIF", col3: "Product Offering", type3: "select", options: ["MDS", "MDCI", "RDPU"] },
    "Diluar Pipeline Prio": { col1: "Nama Nasabah", col2: "CIF", type2: "text" },
    "Pipeline Data Leakage": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC"] },
    "Pipeline GMM": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC"] },
    "Leads Kopra": { col1: "Nama PT", col2: "CIF", hideCol3: true },
    "Pipeline nasabah dari Area": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Kawasan Pebisnis": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Non Pipeline dan Non Kawasan": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Pipeline Cakra": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},
    "Kawasan": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},
    "Non pipeline": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering"},
    "New Mitra Payroll": { col1: "Nomor Mitra", col2: "Nama Mitra", type2: "text" },
    "New CIF Rek Payroll New Mitra": { col1: "Nomor Mitra", col2: "Nomor Rekening", type2: "text"},
    "New Rek Payroll New Mitra": { col1: "Nomor Mitra", col2: "Nomor Rekening", type2: "text"},
    "New CIF Rek Payroll Eksisting Mitra": { col1: "Nomor Mitra", col2: "Nomor Rekening", type2: "text"},
    "New Rek Payroll Eksisting Mitra" : { col1: "Nomor Mitra", col2: "Nomor Rekening", type2: "text"},
    "MTBI": { col1: "Nomor Rekening", col2: "Jenis Nasabah", type2: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"] },
    "AXA": { col1: "Nomor CIF", col2: "Jenis Nasabah", type2: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"],col3: "FBI", type3: "text" },
    "RTW": { col1: "Nomor CIF", hideCol2: true },
    "NTB": { col1: "Nomor CIF", hideCol2: true },
    "MDS": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "MDCI": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "RDPU": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "Kopra": { col1: "Nomor CIF", hideCol2: true },
    "GMM": { col1: "Nomor Rekening", hideCol2: true },
    "Livin": { col1: "Nomor Rekening", hideCol2: true },
    "Simpel": { col1: "Nomor Rekening", hideCol2: true },
    "Tab Reguler": { col1: "Nomor Rekening", hideCol2: true },
    "Multicurrency": { col1: "Nomor Rekening", hideCol2: true },
    "MTR": { col1: "Nomor Rekening", hideCol2: true },
    "Tab Now non GMM": { col1: "Nomor Rekening", hideCol2: true },
    "MTB": { col1: "Nomor Rekening", hideCol2: true},
    "Giro": { col1: "Nomor Rekening", hideCol2: true},
    "EDC": { hideCol1: true, col2: "Nama Merchant", type2: "text" },
    "LVM": { hideCol1: true, col2: "Nama Merchant", type2: "text" }
};

let currentMenu = ""; 

function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';
}

function validateStep1() {
    const codeInput = document.getElementById('branch-code').value.trim();
    const dateInput = document.getElementById('mon-date').value;
    const errorMsg = document.getElementById('error-msg');
    
    if (!dateInput) { alert("Silahkan isi tanggal pelaporan."); return; }
    if (validCodes.includes(codeInput)) { 
        errorMsg.style.display = 'none';
        goToPage('page-main-menu'); 
    } else { 
        errorMsg.style.display = 'block'; 
    }
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
    const count = parseInt(document.getElementById('follow-up-count').value);
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    container.innerHTML = ""; 
    
    const config = configMap[selectedSub] || { col1: "Nama", hideCol2: true };
    
    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div'); 
            row.className = "input-row";
            row.style.display = "flex";
            row.style.gap = "20px";
            row.style.marginBottom = "20px";

            let html = "";

            if (config.hideCol1) {
                // Gunakan placeholder agar Apps Script tidak bingung, tapi input ini disembunyikan
                html += `<input type="hidden" class="dynamic-text-input col-main" value="">`;
            } else {
                html += `<input type="text" placeholder="${i}. ${config.col1}" class="dynamic-text-input col-main" style="flex:2.5;">`;
            }

            if (!config.hideCol2) {
                if (config.type2 === "select") {
                    html += `<select class="number-input-small col-2" style="flex:1.5;"><option value="" disabled selected>${config.col2}</option>${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col2}" class="number-input-small col-2" style="flex:1.5;">`; 
                }
            }

            if (config.col3 && !config.hideCol3) {
                if (config.type3 === "select") {
                    html += `<select class="number-input-small col-3" style="flex:1.5;"><option value="" disabled selected>${config.col3}</option>${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col3}" class="number-input-small col-3" style="flex:1.5;">`; 
                }
            }

            if (currentMenu === 'monitoring') {
                html += `
                <select class="status-select col-status" onchange="updateColor(this)" style="flex:1.5;">
                    <option value="" disabled selected>Status</option>
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
    
    let destinationSheet = "";
    if (currentMenu === 'monitoring') {
        if (kategori.includes("Payroll")) destinationSheet = "Penginputan Pipeline Payroll";
        else if (kategori.includes("Prioritas")) destinationSheet = "Penginputan Pipeline Prioritas";
        else if (kategori.includes("Pebisnis")) destinationSheet = "Penginputan Pipeline Pebisnis";
        else if (kategori.includes("Individu")) destinationSheet = "Penginputan Pipeline Individu";
    } else if (currentMenu === 'akuisisi') {
        if (kategori === "Akuisisi Payroll") destinationSheet = "Akusisi Payroll";
        else if (kategori === "Akuisisi Prioritas") destinationSheet = "Akuisisi Prio";
        else if (kategori === "Akuisisi Pebisnis") destinationSheet = "Akuisisi Pebisnis";
        else if (kategori === "Akuisisi Individu") destinationSheet = "Akuisisi Individu";
        else if (kategori === "Akuisisi MTBI & AXA") destinationSheet = "Akuisisi MTBI & AXA";
        else destinationSheet = "Data Detail Akuisisi";
    }
    
    let dataToSubmit = [];
    const config = configMap[subKategori] || {};

    for (let row of rows) {
        const val1 = row.querySelector('.col-main').value.trim();
        const val2 = row.querySelector('.col-2') ? row.querySelector('.col-2').value.trim() : "";
        const val3 = row.querySelector('.col-3') ? row.querySelector('.col-3').value.trim() : "";
        const statusVal = row.querySelector('.col-status') ? row.querySelector('.col-status').value : "Selesai";

        // Validasi
        if (config.hideCol1) {
            if (val2 === "") { alert("Mohon isi Nama Merchant."); return; }
        } else {
            if (val1 === "") { alert("Mohon lengkapi data utama."); return; }
        }

        // --- SOLUSI UTAMA ---
        // Kita HANYA mengirimkan 'namaNasabah' dan 'cifNasabah'.
        // Karena Apps Script Anda sepertinya sudah baku urutannya.
        let finalNama = val1;
        let finalRek = val2;

        if (config.hideCol1) {
            // Jika EDC/LVM:
            // Kosongkan kolom E (Nama Nasabah) agar Kolom F (Nomor Rekening) terisi Nama Merchant
            finalNama = ""; 
            finalRek = val2; 
        }

        dataToSubmit.push({
            targetSheet: destinationSheet,
            tanggal: tanggal,        
            kodeCabang: kodeCabang,  
            kategori: kategori,      
            subKategori: subKategori,
            total: "1",              
            namaNasabah: finalNama, // Akan masuk ke Kolom E
            cifNasabah: finalRek,   // Akan masuk ke Kolom F (Atau Nama Merchant jika EDC/LVM)
            produk: val3,            
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
        alert("Kesalahan: " + err);
        btn.innerText = "Submit Data"; btn.disabled = false;
    }
}

function goBackToCategories() { goToPage('page2'); }