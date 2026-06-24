const webAppUrl = "https://script.google.com/macros/s/AKfycbzDG6FUtUZSEgi912rdmuiotWpb_n3zEK6RtfDtP_aR81Z0tSUGXX9h10xtXSSBCx8/exec";

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: { 
        title: "Menu Aktivitas", 
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
            "Akuisisi Payroll": ["New Mitra Payroll", "New Rek Payroll New Mitra", "New Rek Payroll Eksisting Mitra"], 
            "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU"], 
            "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra"], 
            "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "MTR Emas" ,"Tab Now non GMM","Livin Next Gen","Incoming CC"],
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
    "Pipeline GMM": { col1: "Nama", col2: "Ticket-ID", col3: "Product Offering", type3: "select", options: ["LVM", "EDC"] },
    "Leads Kopra": { col1: "Nama PT", col2: "CIF", hideCol3: true },
    "Pipeline nasabah dari Area": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Kawasan Pebisnis": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Non Pipeline dan Non Kawasan": { col1: "Nama", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Pipeline Cakra": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Kawasan": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Non pipeline": { col1: "Nama", col2: "CIF", type2: "text", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "New Mitra Payroll": { col1: "Nomor Mitra", col2: "Nama Mitra", type2: "text", col3: "CIF Mitra", type3: "text" },
    "New Rek Payroll New Mitra": { 
        col1: " ", type1: "hidden", hideCol1: true,
        col2: "Nomor Rekening", type2: "text", 
        col3: "New CIF?", type3: "select", options: ["New CIF","No"], 
        col4: "Nama Mitra", type4: "text", 
        col5: "CIF Mitra", type5: "text" 
    },
    "New Rek Payroll Eksisting Mitra": { 
        col1: " ", type1: "hidden", hideCol1: true,
        col2: "Nomor Rekening", type2: "text", 
        col3: "New CIF?", type3: "select", options: ["New CIF","No"], 
        col4: "Nama Mitra", type4: "text", 
        col5: "CIF Mitra", type5: "text" 
    },
    "Simpel": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"] },
    "MTB" : { col1: "Nomor Rekening", col2: "Nama Nasabah", col3: " ", type3: "hidden", hideCol3: true, col4: "New CIF?", type4: "select", options: ["New CIF","No"]},
    "Giro": { col1: "Nomor Rekening", col2: "Nama Nasabah", col3: " ", type3: "hidden", hideCol3: true, col4: "New CIF?", type4: "select", options: ["New CIF","No"]},
    "MTBI": { col1: "Nomor Rekening", col2: "Jenis Nasabah", type2: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"] },
    "AXA": { col1: "Nomor CIF", col2: "Jenis Nasabah", type2: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"], col3: "FBI", type3: "text" },
    "RTW": { col1: "Nomor CIF", hideCol2: true },
    "NTB": { col1: "Nomor CIF", hideCol2: true },
    "MDS": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "MDCI": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "RDPU": { col1: "Nomor CIF", col2: "Nominal", type2: "text" },
    "Kopra": { col1: "Nomor CIF", hideCol2: true },
    "GMM": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"] },
    "Livin": { hideCol1: true, hideCol2: true },
    "Livin Next Gen": {col1: "Nomor Rekening", hideCol2: true },
    "Incoming CC": { col1: "Nama", col2: "NIK", col3: "Tgl Lahir (ddmmyy)" },
    "Tab Reguler": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"] },
    "Multicurrency": { col1: "Nomor Rekening", hideCol2: true },
    "MTR": { col1: "Nomor Rekening", hideCol2: true },
    "MTR Emas": { col1: "Nomor Rekening", hideCol2: true }, 
    "Tab Now non GMM": { col1: "Nomor Rekening", hideCol2: true },
    "EDC": { hideCol1: true, col2: "Nama Merchant", type2: "text", col3: "Nomor Rekening Pencairan", type3: "text", col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "LVM": { hideCol1: true, col2: "Nama Merchant", type2: "text", col3: "Nomor Rekening Pencairan", type3: "text", col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "Review Pipeline": { col1: "Nama", col2: "Detail Monitoring", type2: "text" },
    "Log Aktivitas": { col1: "Kegiatan", col2: "Keterangan", type2: "text" }
};

let currentMenu = "";
let currentNIP = "";
let merchantData = []; // Store fetched merchant data

// ============================================================
// QUEUE SYSTEM - ANTRIAN PENGAJUAN KE GOOGLE SHEETS
// ============================================================
let isSubmitting = false;
let submissionQueue = [];
let queueCounter = 0;

async function addToQueue(payload) {
    return new Promise((resolve, reject) => {
        queueCounter++;
        submissionQueue.push({
            id: queueCounter,
            payload: payload,
            resolve: resolve,
            reject: reject
        });
        processQueue();
    });
}

async function processQueue() {
    if (isSubmitting || submissionQueue.length === 0) {
        return;
    }

    isSubmitting = true;
    const request = submissionQueue.shift();
    const btn = document.getElementById('submit-btn') || document.getElementById('btn-submit-pipeline');

    try {
        console.log(`[Queue #${request.id}] Mengirim data...`);

        // Gunakan text/plain untuk menghindari CORS preflight (OPTIONS)
        // GAS tetap menerima e.postData.contents sebagai JSON string
        const response = await fetch(webAppUrl, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(request.payload)
        });

        // Parse response JSON dari GAS
        const result = await response.json();

        if (result.success) {
            console.log(`[Queue #${request.id}] Sukses:`, result.message || "Data berhasil dikirim");
            request.resolve({ success: true, id: request.id, data: result });
        } else {
            throw new Error(result.error || "Error dari server");
        }

    } catch (err) {
        console.error(`[Queue #${request.id}] Gagal:`, err);
        request.reject(err);
    } finally {
        await new Promise(r => setTimeout(r, 800));
        isSubmitting = false;

        if (submissionQueue.length > 0) {
            processQueue();
        } else {
            if (btn) {
                btn.innerText = "Submit Data";
                btn.disabled = false;
            }
        }
    }
}
// ============================================================

function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';
}

function validateStep1() {
    const codeInput = document.getElementById('branch-code').value.trim();
    const dateInput = document.getElementById('mon-date').value;
    const errorMsg = document.getElementById('error-msg');

    if (!dateInput) { alert("Isi tanggal!"); return; }
    if (validCodes.includes(codeInput)) { 
        errorMsg.style.display = 'none';
        goToPage('page-main-menu'); 
    } else { 
        errorMsg.style.display = 'block'; 
    }
}

function selectMainMenu(menu) {
    if (menu === 'pipeline_merchant') {
        loadPipelineMerchant();
        return;
    }

    if (!menuData[menu]) { alert("Konfigurasi belum tersedia."); return; }
    currentMenu = menu;

    if (menu === 'akuisisi') {
        goToPage('page-nip');
    } else {
        renderCategories(menu);
    }
}

// ============================================================
// PIPELINE MERCHANT FUNCTIONS
// ============================================================
async function loadPipelineMerchant() {
    const kodeCabang = document.getElementById('branch-code').value.trim();

    goToPage('page-pipeline-merchant');
    document.getElementById('pipeline-loading').style.display = 'block';
    document.getElementById('pipeline-content').style.display = 'none';
    document.getElementById('pipeline-error').style.display = 'none';

    try {
        // Fetch merchant data from Google Sheets via GET request
        const response = await fetch(webAppUrl + '?action=getMerchants&branchCode=' + encodeURIComponent(kodeCabang), {
            method: "GET",
            redirect: "follow"
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        merchantData = result.merchants || [];

        if (merchantData.length === 0) {
            document.getElementById('pipeline-loading').style.display = 'none';
            document.getElementById('pipeline-error').innerHTML = 'Tidak ada data merchant untuk cabang ' + kodeCabang;
            document.getElementById('pipeline-error').style.display = 'block';
            return;
        }

        // Populate merchant datalist (searchable dropdown)
        const datalist = document.getElementById('merchant-list');
        datalist.innerHTML = '';

        merchantData.forEach(merchant => {
            const option = document.createElement('option');
            option.value = merchant.namaMerchant;
            datalist.appendChild(option);
        });

        document.getElementById('pipeline-loading').style.display = 'none';
        document.getElementById('pipeline-content').style.display = 'block';

    } catch (err) {
        console.error('Error loading merchant data:', err);
        document.getElementById('pipeline-loading').style.display = 'none';
        document.getElementById('pipeline-error').innerHTML = 'Gagal memuat data merchant. Error: ' + err.message;
        document.getElementById('pipeline-error').style.display = 'block';
    }
}

async function submitPipelineMerchant() {
    const kodeCabang = document.getElementById('branch-code').value.trim();
    const tanggal = document.getElementById('mon-date').value;
    const namaMerchant = document.getElementById('merchant-input').value.trim();
    const visitStatus = document.getElementById('visit-status').value;
    const visitDate = document.getElementById('visit-date').value;
    const visitResult = document.getElementById('visit-result').value;
    const keterangan = document.getElementById('keterangan-pipeline').value.trim();

    // Validasi
    if (!namaMerchant) {
        alert("Pilih atau ketik Nama Merchant terlebih dahulu!");
        return;
    }

    // Validasi: pastikan merchant yang diketik ada di list (case-insensitive)
    const isValidMerchant = merchantData.some(m => 
        m.namaMerchant.trim().toLowerCase() === namaMerchant.trim().toLowerCase()
    );
    if (!isValidMerchant) {
        alert("Nama Merchant tidak ditemukan dalam list. Silakan pilih dari daftar yang tersedia.");
        return;
    }

    if (!visitStatus) {
        alert("Pilih status Sudah Visit / Belum!");
        return;
    }
    if (!visitDate) {
        alert("Isi Tanggal Visit!");
        return;
    }
    if (!visitResult) {
        alert("Pilih Hasil Visit!");
        return;
    }

    const btn = document.getElementById('btn-submit-pipeline');
    btn.innerText = "Mengirim...";
    btn.disabled = true;

    const payload = {
        targetSheet: "Pipeline Merchant",
        tanggal: tanggal,
        kodeCabang: kodeCabang,
        namaMerchant: namaMerchant,
        visitStatus: visitStatus,
        visitDate: visitDate,
        visitResult: visitResult,
        keterangan: keterangan
    };

    try {
        const result = await addToQueue(payload);
        alert("Sukses! Data Pipeline Merchant telah dikirim.\n" + (result.data.message || ""));
        resetForm();
    } catch (err) {
        alert("Kesalahan saat mengirim data: " + err.message);
        btn.innerText = "Submit Data";
        btn.disabled = false;
    }
}
// ============================================================

function submitNIP() {
    const nipInput = document.getElementById('nip-code').value.trim();
    if (!nipInput) { alert("NIP harus diisi!"); return; }

    currentNIP = nipInput;
    renderCategories('akuisisi');
}

function renderCategories(menu) {
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
    const count = parseInt(document.getElementById('follow-up-count').value);
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    container.innerHTML = ""; 

    const config = configMap[selectedSub] || { col1: "Nama", col2: "Keterangan", type2: "text" };

    if (count > 0) {
        for (let i = 1; i <= count; i++) {
            const row = document.createElement('div'); 
            row.className = "input-row"; 
            row.style.marginBottom = "15px";

            let html = "";

            // Kolom 1
            if (config.hideCol1) {
                html += `<input type="hidden" class="dynamic-text-input col-main" value="">`;
            } else {
                html += `<input type="text" placeholder="${i}. ${config.col1}" class="dynamic-text-input col-main" style="flex: 3; min-width: 0; padding: 10px;">`;
            }

            // Kolom 2
            if (config.hideCol2) {
                html += `<input type="hidden" class="number-input-small col-2" value="">`;
            } else if (config.col2) {
                if (config.type2 === "select") {
                    html += `<select class="number-input-small col-2" style="flex: 2; min-width: 0; padding: 10px;">
                                <option value="" disabled selected>${config.col2}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col2}" class="number-input-small col-2" style="flex: 2; min-width: 0; padding: 10px;">`; 
                }
            }

            // Kolom 3
            if (config.hideCol3) {
                html += `<input type="hidden" class="number-input-small col-3" value="">`;
            } else if (config.col3) {
                if (config.type3 === "select") {
                    html += `<select class="number-input-small col-3" style="flex: 2; min-width: 0; padding: 10px;">
                                <option value="" disabled selected>${config.col3}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col3}" class="number-input-small col-3" style="flex: 2; min-width: 0; padding: 10px;">`; 
                }
            }

            // Kolom 4
            if (config.hideCol4) {
                html += `<input type="hidden" class="number-input-small col-4" value="">`;
            } else if (config.col4) {
                if (config.type4 === "select") {
                    html += `<select class="number-input-small col-4" style="flex: 2; min-width: 0; padding: 10px;">
                                <option value="" disabled selected>${config.col4}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col4}" class="number-input-small col-4" style="flex: 2; min-width: 0; padding: 10px;">`; 
                }
            }

            // Kolom 5
            if (config.hideCol5) {
                html += `<input type="hidden" class="number-input-small col-5" value="">`;
            } else if (config.col5) {
                if (config.type5 === "select") {
                    html += `<select class="number-input-small col-5" style="flex: 2; min-width: 0; padding: 10px;">
                                <option value="" disabled selected>${config.col5}</option>
                                ${config.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                } else { 
                    html += `<input type="text" placeholder="${config.col5}" class="number-input-small col-5" style="flex: 2; min-width: 0; padding: 10px;">`; 
                }
            }

            // Kawasan - hanya untuk Menu Akuisisi, per baris
            if (currentMenu === 'akuisisi') {
                html += `<select class="number-input-small col-kawasan" style="flex: 3; min-width: 0; padding: 10px 4px; font-size: 12px;">
                            <option value="" disabled selected>Pilih Kawasan</option>
                            <option value="Pasbar">Pasbar</option>
                            <option value="Mangga Dua">Mangga Dua</option>
                            <option value="PRJ">PRJ</option>
                            <option value="Kemayoran">Kemayoran</option>
                            <option value="Serbu Sekolah">Serbu Sekolah</option>
                            <option value="No">No</option>
                        </select>`;
            }

            // Status (hanya untuk menu monitoring)
            if (currentMenu === 'monitoring') {
                html += `
                <select class="status-select col-status" onchange="updateColor(this)" style="flex: 2; min-width: 0; padding: 10px;">
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
    if (isSubmitting && submissionQueue.length > 0) {
        alert("Sedang memproses pengiriman sebelumnya. Data Anda akan dimasukkan ke antrian.");
    }

    const tanggal = document.getElementById('mon-date').value;
    const kodeCabang = document.getElementById('branch-code').value;
    const nip = currentNIP;
    const kategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-cat');
    const subKategori = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    const rows = document.querySelectorAll('.input-row');

    if (rows.length === 0) {
        alert("Mohon masukkan jumlah data terlebih dahulu.");
        return;
    }

    let destinationSheet = "";
    if (currentMenu === 'monitoring') {
        if (kategori.includes("Payroll")) destinationSheet = "Penginputan Pipeline Payroll";
        else if (kategori.includes("Prioritas")) destinationSheet = "Penginputan Pipeline Prioritas";
        else if (kategori.includes("Pebisnis")) destinationSheet = "Penginputan Pipeline Pebisnis";
        else if (kategori.includes("Individu")) destinationSheet = "Penginputan Pipeline Individu";
        else destinationSheet = "Data Monitoring";
    } else if (currentMenu === 'akuisisi') {
        if (kategori === "Akuisisi Payroll") destinationSheet = "Akusisi Payroll";
        else if (kategori === "Akuisisi Prioritas") destinationSheet = "Akuisisi Prio";
        else if (kategori === "Akuisisi Pebisnis") destinationSheet = "Akuisisi Pebisnis";
        else if (kategori === "Akuisisi Individu") destinationSheet = "Akuisisi Individu";
        else if (kategori === "Akuisisi MTBI & AXA") destinationSheet = "Akuisisi MTBI & AXA";
        else destinationSheet = "Data Detail Akuisisi";
    }

    if (destinationSheet === "") {
        alert("Sheet tujuan tidak ditemukan.");
        return;
    }

    let dataToSubmit = [];
    const config = configMap[subKategori] || {};

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 1;

        const val1 = row.querySelector('.col-main').value.trim();
        const val2El = row.querySelector('.col-2');
        const val2 = val2El ? val2El.value.trim() : "";
        const val3El = row.querySelector('.col-3');
        const val3 = val3El ? val3El.value.trim() : "";
        const statusEl = row.querySelector('.col-status');
        const statusVal = statusEl ? statusEl.value : "Selesai";
        const val4El = row.querySelector('.col-4');
        const val4 = val4El ? val4El.value.trim() : "";
        const val5El = row.querySelector('.col-5');
        const val5 = val5El ? val5El.value.trim() : "";

        // TANGKAP NILAI KAWASAN BARU
        const kawasanEl = row.querySelector('.col-kawasan');
        const kawasanValue = kawasanEl ? kawasanEl.value.trim() : "";

        // Validasi
        if (!config.hideCol1 && val1 === "") {
            alert(`Baris ${rowNum}: ${config.col1 || 'Kolom 1'} harus diisi.`);
            return;
        }
        if (!config.hideCol2 && config.col2 && val2 === "") {
            alert(`Baris ${rowNum}: ${config.col2 || 'Kolom 2'} harus diisi.`);
            return;
        }
        if (config.col3 && !config.hideCol3 && val3 === "") {
            alert(`Baris ${rowNum}: ${config.col3} harus diisi.`);
            return;
        }
        if (currentMenu === 'monitoring' && statusVal === "") {
            alert(`Baris ${rowNum}: Status harus dipilih.`);
            return;
        }
        if (config.col4 && !config.hideCol4 && val4 === "") {
            alert(`Baris ${rowNum}: ${config.col4} harus diisi.`);
            return;
        }
        if (config.col5 && !config.hideCol5 && val5 === "") {
            alert(`Baris ${rowNum}: ${config.col5} harus diisi.`);
            return;
        }

        // VALIDASI KAWASAN BARU
        if (currentMenu === 'akuisisi' && kawasanValue === "") {
            alert(`Baris ${rowNum}: Kawasan harus dipilih.`);
            return;
        }

        // PERBARUI PAYLOAD
        dataToSubmit.push({
            targetSheet: destinationSheet,
            tanggal: tanggal,        
            kodeCabang: kodeCabang,
            nip: nip,
            kategori: kategori,      
            subKategori: subKategori,
            total: "1",              
            namaNasabah: val1,
            cifNasabah: val2,
            produk: val3,
            keterangan: val4,
            cifMitra: val5,
            kawasan: kawasanValue,
            status: statusVal        
        });
    }

    const btn = document.getElementById('submit-btn');
    btn.innerText = "Mengirim..."; 
    btn.disabled = true;

    try {
        const results = [];
        for (const payload of dataToSubmit) {
            const result = await addToQueue(payload);
            results.push(result);
        }

        alert(`Sukses! ${dataToSubmit.length} data dikirim ke: ${destinationSheet}`);
        resetForm();

    } catch (err) {
        alert("Kesalahan saat mengirim data: " + err.message);
        btn.innerText = "Submit Data"; 
        btn.disabled = false;
    }
}

function resetForm() {
    // Reset all form inputs without reloading page
    document.getElementById('mon-date').value = '';
    document.getElementById('branch-code').value = '';
    document.getElementById('nip-code').value = '';
    currentNIP = '';
    currentMenu = '';
    merchantData = [];

    // Reset pipeline merchant inputs
    const merchantInput = document.getElementById('merchant-input');
    if (merchantInput) merchantInput.value = '';
    const visitStatus = document.getElementById('visit-status');
    if (visitStatus) visitStatus.value = '';
    const visitDate = document.getElementById('visit-date');
    if (visitDate) visitDate.value = '';
    const visitResult = document.getElementById('visit-result');
    if (visitResult) visitResult.value = '';
    const keteranganPipeline = document.getElementById('keterangan-pipeline');
    if (keteranganPipeline) keteranganPipeline.value = '';

    // Reset dynamic input area
    const textInputsContainer = document.getElementById('text-inputs-container');
    if (textInputsContainer) textInputsContainer.innerHTML = '';
    const followUpCount = document.getElementById('follow-up-count');
    if (followUpCount) followUpCount.value = '';
    const dynamicInputArea = document.getElementById('dynamic-input-area');
    if (dynamicInputArea) {
        dynamicInputArea.style.display = 'none';
        dynamicInputArea.removeAttribute('data-selected-sub');
        dynamicInputArea.removeAttribute('data-selected-cat');
    }

    // Reset datalist
    const datalist = document.getElementById('merchant-list');
    if (datalist) datalist.innerHTML = '';

    // Reset pipeline sections
    const pipelineLoading = document.getElementById('pipeline-loading');
    if (pipelineLoading) pipelineLoading.style.display = 'block';
    const pipelineContent = document.getElementById('pipeline-content');
    if (pipelineContent) pipelineContent.style.display = 'none';
    const pipelineError = document.getElementById('pipeline-error');
    if (pipelineError) {
        pipelineError.style.display = 'none';
        pipelineError.innerHTML = '';
    }

    // Reset submit buttons
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.innerText = "Submit Data";
        submitBtn.disabled = false;
    }
    const btnSubmitPipeline = document.getElementById('btn-submit-pipeline');
    if (btnSubmitPipeline) {
        btnSubmitPipeline.innerText = "Submit Data";
        btnSubmitPipeline.disabled = false;
    }

    // Clear error message
    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) errorMsg.style.display = 'none';

    // Go back to page 1
    goToPage('page1');
}

function checkPassword() {
    const password = prompt("Masukkan Password untuk akses database:");
    if (password === "Gambir119") {
        const url = "https://docs.google.com/spreadsheets/d/18k4W2U653IU7YOkOPNlcmW_aFf7xyqagGq4MpkQMN3E/edit?gid=796948715#gid=796948715";
        window.open(url, "_blank");
    } else if (password !== null) {
        alert("Password Salah! Akses ditolak.");
    }
}

function goBackToCategories() { 
    goToPage('page2'); 
}
