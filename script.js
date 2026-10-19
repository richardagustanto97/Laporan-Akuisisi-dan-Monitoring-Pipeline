
const webAppUrl = "https://script.google.com/macros/s/AKfycbyoHwTD236vXOkdhVBIyM28G6fT0sv0G9vi15MOWxkc96EPe2VPao72KdCIChmaIyQA/exec";

const MAX_ROWS_PER_SUBMIT = 50; // batas jumlah baris per pengiriman (cegah antrian sangat panjang)

const validCodes = ["11900", "11902", "11903", "11904", "11906", "11907", "11912", "11916", "11920", "11923", "11924", "11929", "11931", "11932", "11934", "11935", "11936", "11937"];

const menuData = {
    monitoring: {
        title: "Menu Monitoring",
        categories: {
            "Pipeline GMM Merchant Senator dari Livin": ["Pipeline GMM Merchant Senator dari Livin"],
            "Pipeline New CIF Individu ke Pebisnis": ["Pipeline New CIF Individu ke Pebisnis"],
            "Pipeline CC": ["Pipeline CC"],
            "Pipeline Merchant": ["Pipeline Merchant"],
            "Pipeline Pebisnis Non Payroll": ["Pipeline Pebisnis Non Payroll"],
            "Winback Pareto Cabang": ["Winback Pareto Cabang"],
            "Diluar Pipeline": ["Payroll", "Prioritas", "Pebisnis", "Individu"]
        }
    },
    akuisisi: {
        title: "Menu Akuisisi",
        categories: {
            "Akuisisi Payroll": ["New Mitra Payroll", "New Rek Payroll New Mitra", "New Rek Payroll Eksisting Mitra"],
            "Akuisisi Prioritas": ["RTW", "NTB", "MDS", "MDCI", "RDPU"],
            "Akuisisi Pebisnis": ["MTB", "Giro", "EDC", "LVM", "Kopra"],
            "Akuisisi Individu": ["GMM", "Livin", "Simpel", "Tab Reguler", "Multicurrency", "MTR", "MTR Emas" ,"Tab Now non GMM","Livin Next Gen","Tabungan Emas","Incoming CC"],
            "Akuisisi MTBI & AXA": ["MTBI", "AXA"]
        }
    }
};

const configMap = {
    "Payroll": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Prioritas": { col1: "Nama Nasabah", col2: "CIF", col3: "Product Offering", type3: "select", options: ["RTW", "NTB", "MDS", "MDCI", "RDPU"] },
    "Pebisnis": { col1: "Nama Nasabah", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Individu": { col1: "Nama Nasabah", col2: "CIF", col3: "Product Offering", type3: "select", options: ["LVM", "EDC", "Kopra"] },
    "Pipeline PMP": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
    "Pipeline Badan Usaha": { col1: "Nama PT", col2: "Jml Prospek", type2: "text" },
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
    "Review Pipeline": { col1: "Nama", col2: "Detail Monitoring", type2: "text" },
    "Log Aktivitas": { col1: "Kegiatan", col2: "Keterangan", type2: "text" },
    "New Mitra Payroll": { col1: "Nomor Mitra", col2: "Nama Mitra", type2: "text", col3: "CIF Mitra", type3: "text" },
    "New Rek Payroll New Mitra": {
        col1: "NIK", type1: "text", hideCol1: true,
        col2: "Nomor Rekening", type2: "text",
        col3: "New CIF?", type3: "select", options: ["New CIF","No"],
        col4: "Nama Mitra", type4: "text",
        col5: "CIF Mitra", type5: "text"
    },
    "New Rek Payroll Eksisting Mitra": {
        col1: "NIK", type1: "text", hideCol1: true,
        col2: "Nomor Rekening", type2: "text",
        col3: "New CIF?", type3: "select", options: ["New CIF","No"],
        col4: "Nama Mitra", type4: "text",
        col5: "CIF Mitra", type5: "text"
    },
    "RTW": { col1: "Nomor CIF", col2: "NIK", type2: "text", hideCol2: true },
    "NTB": { col1: "Nomor CIF", col2: "NIK", type2: "text", hideCol2: true },
    "MDS": { col1: "Nomor CIF", col2: "Nominal", type2: "text", col3: "NIK", type3: "text", hideCol3: true },
    "MDCI": { col1: "Nomor CIF", col2: "Nominal", type2: "text", col3: "NIK", type3: "text", hideCol3: true },
    "RDPU": { col1: "Nomor CIF", col2: "Nominal", type2: "text", col3: "NIK", type3: "text", hideCol3: true },
    "MTB": { col1: "Nomor Rekening", col2: "Nama Nasabah", type2: "text", hideCol2: true, col3: "NIK", type3: "text", hideCol3: true, col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "Giro": { col1: "Nomor Rekening", col2: "Nama Nasabah", type2: "text", hideCol2: true, col3: "NIK", type3: "text", hideCol3: true, col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "EDC": { col1: "NIK", type1: "text", hideCol1: true, col2: "Nama Merchant", type2: "text", col3: "Nomor Rekening Pencairan", type3: "text", col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "LVM": { col1: "NIK", type1: "text", hideCol1: true, col2: "Nama Merchant", type2: "text", col3: "Nomor Rekening Pencairan", type3: "text", col4: "New CIF?", type4: "select", options: ["New CIF","No"] },
    "Kopra": { col1: "Nomor CIF" },
    "GMM": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"], col3: "NIK", type3: "text", hideCol3: true, col4: "Nama Nasabah", type4: "text", hideCol4: true },
    "Simpel": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"], col3: "NIK", type3: "text", hideCol3: true, col4: "Nama Nasabah", type4: "text", hideCol4: true },
    "Tab Reguler": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"], col3: "NIK", type3: "text", hideCol3: true, col4: "Nama Nasabah", type4: "text", hideCol4: true },
    "Multicurrency": { col1: "Nomor Rekening", col2: "New CIF?", type2: "select", options: ["New CIF","No"], col3: "NIK", type3: "text", hideCol3: true, col4: "Nama Nasabah", type4: "text", hideCol4: true },
    "MTR": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true },
    "MTR Emas": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true },
    "Tab Now non GMM": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true },
    "Livin Next Gen": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true },
    "Tabungan Emas": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true },
    "Livin": { hideCol1: true, hideCol2: true },
    "Incoming CC": { col1: "Nama Nasabah", col2: "NIK", type2: "text", col3: "Tgl Lahir (ddmmyy)" },
    "MTBI": { col1: "Nomor Rekening", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true, col4: "Jenis Nasabah", type4: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"] },
    "AXA": { col1: "Nomor CIF", col2: "NIK", type2: "text", hideCol2: true, col3: "Nama Nasabah", type3: "text", hideCol3: true, col4: "Jenis Nasabah", type4: "select", options: ["Individu", "Badan Usaha","Payroll","Prioritas"], col5: "FBI", type5: "text" }
};

let currentMenu = "";
let currentNIP = "";
let merchantData = [];
let newcifData = [];
let ccData = [];
let currentCCType = "";
let gpData = [];
let currentGPType = "";

const genericPipelineConfig = {
    merchant: {
        sheet: "Monitoring Pipeline Merchant",
        updateCols: [15, 16, 17, 18],
        title: "Pipeline Merchant",
        cabangCol: 1,
        visitOptions: [
            "Penambahan product (EDC/LVM/Kopra/Produk lainnya)",
            "Isu Bisnis (MDR / Program)",
            "Isu Teknis (Kendala mesin/Kendala QRIS/Kendala Kopra/Kendala teknis lainnya)",
            "Belum bertemu owner/PIC, FU Kembali",
            "Usaha tutup permanen/Tidak berkenan menggunakan produk BMRI"
        ]
    },
    pebisnisnonpayroll: {
        sheet: "Monitoring Pipeline Pebisnis Non Payroll",
        updateCols: [5, 6, 7, 8],
        title: "Pipeline Pebisnis Non Payroll",
        cabangCol: 1,
        visitOptions: [
            "Berminat",
            "Perlu Follow Up",
            "Tidak Berminat"
        ]
    },
    winbackpareto: {
        sheet: "Top 30 Pareto Cabang",
        updateCols: [27, 28, 29, 30],
        title: "Winback Pareto Cabang",
        cabangCol: 1,
        visitOptions: [
            "Berminat",
            "Perlu Follow Up",
            "Tidak Berminat"
        ]
    }
};

const pipelineSubMenus = {
    "Pipeline GMM Merchant Senator dari Livin": function() { loadPipelineMerchant(); },
    "Pipeline New CIF Individu ke Pebisnis": function() { loadPipelineNewCIF(); },
    "Pipeline CC": function() {
        goToPage('page-pipeline-cc');
        document.getElementById('cc-sub-menu').style.display = 'block';
        document.getElementById('cc-form').style.display = 'none';
    },
    "Pipeline Merchant": function() { loadPipelineGeneric('merchant'); },
    "Pipeline Pebisnis Non Payroll": function() { loadPipelineGeneric('pebisnisnonpayroll'); },
    "Winback Pareto Cabang": function() { loadPipelineGeneric('winbackpareto'); }
};

const ccConfig = {
    dropfund: { sheet: "LEADS CC NSBH DROP FUND", title: "Leads CC Nasabah Drop Fund" },
    prio:     { sheet: "LEADS CC PRIORITAS BULAN AGUSTUS", title: "Leads CC Prio Agustus" },
    payroll:  { sheet: "LEADS PAYROLL INCOME DIATAS 10 JUTA", title: "Leads CC Payroll >10 Jt" },
    cakra:    { sheet: "LEADS CC CAKRA", title: "Leads CC Cakra" }
};

// ============================================================
// SISTEM ANTRIAN (diperbaiki)
// - Setiap request membawa referensi tombolnya sendiri.
// - Jika satu pengiriman gagal, antrian BERHENTI (halt) dan semua
//   request yang masih mengantar ditolak dengan pesan jelas,
//   sehingga tidak ada "setengah terkirim diam-diam".
// ============================================================
let isSubmitting = false;
let queueHalted = false;
let submissionQueue = [];
let queueCounter = 0;

async function addToQueue(payload, btn) {
    // antrian baru -> reset flag halt
    if (!isSubmitting && submissionQueue.length === 0) {
        queueHalted = false;
    }
    return new Promise((resolve, reject) => {
        queueCounter++;
        submissionQueue.push({
            id: queueCounter,
            payload: payload,
            btn: btn || null,
            resolve: resolve,
            reject: reject
        });
        processQueue();
    });
}

function haltQueue(reason) {
    queueHalted = true;
    const remaining = submissionQueue.splice(0);
    remaining.forEach(req => req.reject(new Error(reason)));
}

async function processQueue() {
    if (isSubmitting || submissionQueue.length === 0) return;

    isSubmitting = true;
    const request = submissionQueue.shift();

    try {
        console.log(`[Queue #${request.id}] Mengirim data...`);

        const response = await fetch(webAppUrl, {
            method: "POST",
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(request.payload)
        });

        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch (jsonErr) {
            if (response.ok && responseText.trim().startsWith('<')) {
                console.warn(`[Queue #${request.id}] Response HTML diterima, dianggap sukses.`);
                result = { success: true, message: "Data berhasil dikirim." };
            } else {
                throw new Error("Respon tidak valid dari server.");
            }
        }

        if (result && result.success) {
            console.log(`[Queue #${request.id}] Sukses:`, result.message || "Data berhasil dikirim");
            request.resolve({ success: true, id: request.id, data: result });
        } else {
            const errorText = (result && result.error) ? result.error : "Gagal memproses data di server";
            throw new Error(errorText);
        }

    } catch (err) {
        console.error(`[Queue #${request.id}] Gagal:`, err);
        // hentikan seluruh antrian agar tidak ada pengiriman "diam-diam" setelah error
        haltQueue("Pengiriman dihentikan karena ada data yang gagal. Periksa koneksi/server, lalu kirim ulang data yang tersisa.");
        request.reject(err);
    } finally {
        await new Promise(r => setTimeout(r, 800));
        isSubmitting = false;

        // pulihkan TOMBOL MILIK REQUEST INI (bukan tombol lain yang kebetulan ada di DOM)
        if (request.btn) {
            request.btn.innerText = "Submit Data";
            request.btn.disabled = false;
        }

        if (!queueHalted && submissionQueue.length > 0) {
            processQueue();
        }
    }
}

// ============================================================
// HELPERS
// ============================================================
function goToPage(pageId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';
}

function setBtnLoading(btn) {
    if (!btn) return;
    btn.innerText = "Mengirim...";
    btn.disabled = true;
}

function clearFields(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

function resetSubmitButtons() {
    ['btn-submit-pipeline', 'btn-submit-newcif', 'btn-submit-cc', 'btn-submit-gp', 'submit-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.innerText = "Submit Data";
            btn.disabled = false;
        }
    });
}

// cari item berdasarkan nama (case-insensitive), kembalikan object lengkap
// (termasuk row/rowIndex bila disediakan backend)
function findMatchedItem(data, name) {
    const target = name.trim().toLowerCase();
    return data.find(item => item.nama.trim().toLowerCase() === target) || null;
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
    if (!menuData[menu]) { alert("Konfigurasi belum tersedia."); return; }
    currentMenu = menu;

    if (menu === 'akuisisi') {
        goToPage('page-nip');
    } else {
        renderCategories(menu);
    }
}

function submitNIP() {
    const nipInput = document.getElementById('nip-code').value.trim();
    if (!nipInput) { alert("NIP harus diisi!"); return; }

    currentNIP = nipInput;
    renderCategories('akuisisi');
}

// ============================================================
// PIPELINE GMM MERCHANT SENATOR DARI LIVIN
// ============================================================
async function loadPipelineMerchant() {
    const kodeCabang = document.getElementById('branch-code').value.trim();

    goToPage('page-pipeline-merchant');
    document.getElementById('pipeline-loading').style.display = 'block';
    document.getElementById('pipeline-content').style.display = 'none';
    document.getElementById('pipeline-error').style.display = 'none';

    try {
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

function clearMerchantForm() {
    clearFields(['merchant-input', 'visit-status', 'visit-date', 'visit-result', 'keterangan-pipeline']);
    const btn = document.getElementById('btn-submit-pipeline');
    if (btn) { btn.innerText = "Submit Data"; btn.disabled = false; }
}

async function submitPipelineMerchant() {
    const kodeCabang = document.getElementById('branch-code').value.trim();
    const tanggal = document.getElementById('mon-date').value;
    const namaMerchant = document.getElementById('merchant-input').value.trim();
    const visitStatus = document.getElementById('visit-status').value;
    const visitDate = document.getElementById('visit-date').value;
    const visitResult = document.getElementById('visit-result').value;
    const keterangan = document.getElementById('keterangan-pipeline').value.trim();

    if (!namaMerchant) {
        alert("Pilih atau ketik Nama Merchant terlebih dahulu!");
        return;
    }

    const matched = findMatchedItem(merchantData, namaMerchant);
    if (!matched) {
        alert("Nama Merchant tidak ditemukan dalam list. Silakan pilih dari daftar yang tersedia.");
        return;
    }

    if (!visitStatus) { alert("Pilih status Sudah Visit / Belum!"); return; }
    if (!visitDate) { alert("Isi Tanggal Visit!"); return; }
    if (!visitResult) { alert("Pilih Hasil Visit!"); return; }

    const btn = document.getElementById('btn-submit-pipeline');
    setBtnLoading(btn);

    const payload = {
        targetSheet: "Pipeline Merchant",
        tanggal: tanggal,
        kodeCabang: kodeCabang,
        namaMerchant: matched.nama,
        // jika backend mengirimkan nomor baris, gunakan untuk update agar tidak salah baris pada nama duplikat
        rowIndex: matched.row || matched.rowIndex || null,
        visitStatus: visitStatus,
        visitDate: visitDate,
        visitResult: visitResult,
        keterangan: keterangan
    };

    try {
        const result = await addToQueue(payload, btn);
        alert("Sukses! Data Pipeline Merchant telah dikirim.\n" + (result.data.message || ""));
        clearMerchantForm(); // tetap di halaman, kode cabang & tanggal tidak dihapus
    } catch (err) {
        const msg = (err && err.message) ? err.message : err;
        alert("Kesalahan saat mengirim data: " + msg);
        // tombol dipulihkan oleh processQueue / addToQueue
    }
}

// ============================================================
// PIPELINE NEW CIF INDIVIDU KEBISNIS
// ============================================================
async function loadPipelineNewCIF() {
    const kodeCabang = document.getElementById('branch-code').value.trim();

    goToPage('page-pipeline-newcif');
    document.getElementById('newcif-loading').style.display = 'block';
    document.getElementById('newcif-content').style.display = 'none';
    document.getElementById('newcif-error').style.display = 'none';

    try {
        const response = await fetch(webAppUrl + '?action=getNewCIFs&branchCode=' + encodeURIComponent(kodeCabang), {
            method: "GET",
            redirect: "follow"
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        newcifData = result.data || [];

        if (newcifData.length === 0) {
            document.getElementById('newcif-loading').style.display = 'none';
            document.getElementById('newcif-error').innerHTML = 'Tidak ada data New CIF untuk cabang ' + kodeCabang;
            document.getElementById('newcif-error').style.display = 'block';
            return;
        }

        const datalist = document.getElementById('newcif-list');
        datalist.innerHTML = '';

        newcifData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nama;
            datalist.appendChild(option);
        });

        document.getElementById('newcif-loading').style.display = 'none';
        document.getElementById('newcif-content').style.display = 'block';

    } catch (err) {
        console.error('Error loading New CIF data:', err);
        document.getElementById('newcif-loading').style.display = 'none';
        document.getElementById('newcif-error').innerHTML = 'Gagal memuat data New CIF. Error: ' + err.message;
        document.getElementById('newcif-error').style.display = 'block';
    }
}

function clearNewCIFForm() {
    clearFields(['newcif-input', 'newcif-visit-status', 'newcif-visit-date', 'newcif-visit-result', 'newcif-keterangan']);
    const btn = document.getElementById('btn-submit-newcif');
    if (btn) { btn.innerText = "Submit Data"; btn.disabled = false; }
}

async function submitPipelineNewCIF() {
    const kodeCabang = document.getElementById('branch-code').value.trim();
    const tanggal = document.getElementById('mon-date').value;
    const namaNewCIF = document.getElementById('newcif-input').value.trim();
    const visitStatus = document.getElementById('newcif-visit-status').value;
    const visitDate = document.getElementById('newcif-visit-date').value;
    const visitResult = document.getElementById('newcif-visit-result').value;
    const keterangan = document.getElementById('newcif-keterangan').value.trim();

    if (!namaNewCIF) {
        alert("Pilih atau ketik Nama/CIF terlebih dahulu!");
        return;
    }

    const matched = findMatchedItem(newcifData, namaNewCIF);
    if (!matched) {
        alert("Nama/CIF tidak ditemukan dalam list. Silakan pilih dari daftar yang tersedia.");
        return;
    }

    if (!visitStatus) { alert("Pilih status Sudah Visit / Belum!"); return; }
    if (!visitDate) { alert("Isi Tanggal Visit!"); return; }
    if (!visitResult) { alert("Pilih Hasil Visit!"); return; }

    const btn = document.getElementById('btn-submit-newcif');
    setBtnLoading(btn);

    const payload = {
        targetSheet: "Pipeline New CIF",
        tanggal: tanggal,
        kodeCabang: kodeCabang,
        namaNewCIF: matched.nama,
        rowIndex: matched.row || matched.rowIndex || null,
        visitStatus: visitStatus,
        visitDate: visitDate,
        visitResult: visitResult,
        keterangan: keterangan
    };

    try {
        const result = await addToQueue(payload, btn);
        alert("Sukses! Data Pipeline New CIF telah dikirim.\n" + (result.data.message || ""));
        clearNewCIFForm();
    } catch (err) {
        const msg = (err && err.message) ? err.message : err;
        alert("Kesalahan saat mengirim data: " + msg);
    }
}

// ============================================================
// PIPELINE GENERIC (Merchant / Pebisnis Non Payroll / Winback)
// ============================================================
async function loadPipelineGeneric(type) {
    if (!genericPipelineConfig[type]) { alert("Konfigurasi pipeline tidak ditemukan."); return; }
    currentGPType = type;
    const conf = genericPipelineConfig[type];
    const kodeCabang = document.getElementById('branch-code').value.trim();

    document.getElementById('gp-title').innerText = conf.title;

    const resultSelect = document.getElementById('gp-visit-result');
    resultSelect.innerHTML = '<option value="" disabled selected>-- Pilih Hasil Visit --</option>';
    if (conf.visitOptions) {
        conf.visitOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            resultSelect.appendChild(option);
        });
    }

    goToPage('page-pipeline-generic');
    document.getElementById('gp-loading').style.display = 'block';
    document.getElementById('gp-content').style.display = 'none';
    document.getElementById('gp-error').style.display = 'none';

    try {
        let gpUrl = webAppUrl + '?action=getPipelineData&sheet=' + encodeURIComponent(conf.sheet) + '&branchCode=' + encodeURIComponent(kodeCabang);
        if (conf.cabangCol) gpUrl += '&cabangCol=' + conf.cabangCol;
        const response = await fetch(gpUrl, {
            method: "GET",
            redirect: "follow"
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        gpData = result.data || [];

        if (gpData.length === 0) {
            document.getElementById('gp-loading').style.display = 'none';
            document.getElementById('gp-error').innerHTML = 'Tidak ada data untuk cabang ' + kodeCabang;
            document.getElementById('gp-error').style.display = 'block';
            return;
        }

        const datalist = document.getElementById('gp-list');
        datalist.innerHTML = '';

        gpData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nama;
            datalist.appendChild(option);
        });

        document.getElementById('gp-loading').style.display = 'none';
        document.getElementById('gp-content').style.display = 'block';

    } catch (err) {
        console.error('Error loading pipeline data:', err);
        document.getElementById('gp-loading').style.display = 'none';
        document.getElementById('gp-error').innerHTML = 'Gagal memuat data. Error: ' + err.message;
        document.getElementById('gp-error').style.display = 'block';
    }
}

function clearGenericPipelineForm() {
    clearFields(['gp-input', 'gp-visit-status', 'gp-visit-date', 'gp-visit-result', 'gp-keterangan']);
    const btn = document.getElementById('btn-submit-gp');
    if (btn) { btn.innerText = "Submit Data"; btn.disabled = false; }
}

async function submitPipelineGeneric() {
    if (!currentGPType || !genericPipelineConfig[currentGPType]) {
        alert("Tipe pipeline tidak valid.");
        return;
    }
    const conf = genericPipelineConfig[currentGPType];

    const nama = document.getElementById('gp-input').value.trim();
    const visitStatus = document.getElementById('gp-visit-status').value;
    const visitDate = document.getElementById('gp-visit-date').value;
    const visitResult = document.getElementById('gp-visit-result').value;
    const keterangan = document.getElementById('gp-keterangan').value.trim();

    if (!nama) {
        alert("Pilih atau ketik Nama/CIF terlebih dahulu!");
        return;
    }

    const matched = findMatchedItem(gpData, nama);
    if (!matched) {
        alert("Nama/CIF tidak ditemukan dalam list. Silakan pilih dari daftar yang tersedia.");
        return;
    }

    if (!visitStatus) { alert("Pilih status Sudah Visit / Belum!"); return; }
    if (!visitDate) { alert("Isi Tanggal Visit!"); return; }
    if (!visitResult) { alert("Pilih Hasil Visit!"); return; }

    const btn = document.getElementById('btn-submit-gp');
    setBtnLoading(btn);

    const payload = {
        targetSheet: "Pipeline Generic",
        sheetName: conf.sheet,
        updateCols: conf.updateCols,
        nama: matched.nama,
        rowIndex: matched.row || matched.rowIndex || null,
        visitStatus: visitStatus,
        visitDate: visitDate,
        visitResult: visitResult,
        keterangan: keterangan
    };

    try {
        const result = await addToQueue(payload, btn);
        alert("Sukses! Data " + conf.title + " telah dikirim.\n" + (result.data.message || ""));
        clearGenericPipelineForm();
    } catch (err) {
        const msg = (err && err.message) ? err.message : err;
        alert("Kesalahan saat mengirim data: " + msg);
    }
}

// ============================================================
// PIPELINE CC
// ============================================================
function selectCCType(type) {
    if (!ccConfig[type]) { alert("Konfigurasi sub kategori CC tidak ditemukan."); return; }
    currentCCType = type;

    document.getElementById('cc-sub-menu').style.display = 'none';
    document.getElementById('cc-form').style.display = 'block';
    document.getElementById('cc-form-title').innerText = ccConfig[type].title;

    clearCCForm();
    document.getElementById('cc-list').innerHTML = '';

    loadLeadsCC(type);
}

function backToCCSubMenu() {
    document.getElementById('cc-form').style.display = 'none';
    document.getElementById('cc-sub-menu').style.display = 'block';
    document.getElementById('cc-error').style.display = 'none';
    ccData = [];
    currentCCType = "";
}

function clearCCForm() {
    clearFields(['cc-input', 'cc-visit-status', 'cc-visit-date', 'cc-visit-result', 'cc-keterangan']);
    const btn = document.getElementById('btn-submit-cc');
    if (btn) { btn.innerText = "Submit Data"; btn.disabled = false; }
}

async function loadLeadsCC(type) {
    document.getElementById('cc-loading').style.display = 'block';
    document.getElementById('cc-content').style.display = 'none';
    document.getElementById('cc-error').style.display = 'none';

    try {
        const response = await fetch(webAppUrl + '?action=getLeadsCC&leadType=' + encodeURIComponent(type), {
            method: "GET",
            redirect: "follow"
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        ccData = result.data || [];

        if (ccData.length === 0) {
            document.getElementById('cc-loading').style.display = 'none';
            document.getElementById('cc-error').innerHTML = 'Tidak ada data di sheet "' + ccConfig[type].sheet + '"';
            document.getElementById('cc-error').style.display = 'block';
            return;
        }

        const datalist = document.getElementById('cc-list');
        datalist.innerHTML = '';

        ccData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nama;
            datalist.appendChild(option);
        });

        document.getElementById('cc-loading').style.display = 'none';
        document.getElementById('cc-content').style.display = 'block';

    } catch (err) {
        console.error('Error loading Leads CC data:', err);
        document.getElementById('cc-loading').style.display = 'none';
        document.getElementById('cc-error').innerHTML = 'Gagal memuat data Leads CC. Error: ' + err.message;
        document.getElementById('cc-error').style.display = 'block';
    }
}

async function submitPipelineCC() {
    const namaNasabah = document.getElementById('cc-input').value.trim();
    const visitStatus = document.getElementById('cc-visit-status').value;
    const visitDate = document.getElementById('cc-visit-date').value;
    const visitResult = document.getElementById('cc-visit-result').value;
    const keterangan = document.getElementById('cc-keterangan').value.trim();

    if (!namaNasabah) {
        alert("Pilih atau ketik CIF - Nama Nasabah terlebih dahulu!");
        return;
    }

    const matched = findMatchedItem(ccData, namaNasabah);
    if (!matched) {
        alert("CIF - Nama Nasabah tidak ditemukan dalam list. Silakan pilih dari daftar yang tersedia.");
        return;
    }

    if (!visitStatus) { alert("Pilih status Sudah Visit / Belum!"); return; }
    if (!visitDate) { alert("Isi Tanggal Visit/Followup!"); return; }
    if (!visitResult) { alert("Pilih Hasil Visit/Followup!"); return; }

    const btn = document.getElementById('btn-submit-cc');
    setBtnLoading(btn);

    const payload = {
        targetSheet: "Pipeline CC",
        leadType: currentCCType,
        namaNasabah: matched.nama,
        rowIndex: matched.row || matched.rowIndex || null,
        visitStatus: visitStatus,
        visitDate: visitDate,
        visitResult: visitResult,
        keterangan: keterangan
    };

    try {
        const result = await addToQueue(payload, btn);
        alert("Sukses! Data " + ccConfig[currentCCType].title + " telah dikirim.\n" + (result.data.message || ""));
        clearCCForm();
    } catch (err) {
        const msg = (err && err.message) ? err.message : err;
        alert("Kesalahan saat mengirim data: " + msg);
    }
}

// ============================================================
// RENDER MENU & FORM DINAMIS
// ============================================================
function renderCategories(menu) {
    const container = document.getElementById('category-options');
    document.getElementById('menu-title').innerText = menuData[menu].title;
    container.innerHTML = "";

    Object.keys(menuData[menu].categories).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = cat;
        btn.onclick = () => {
            if (pipelineSubMenus[cat]) {
                pipelineSubMenus[cat]();
            } else {
                showSub(cat);
            }
        };
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
            if (pipelineSubMenus[sub]) { pipelineSubMenus[sub](); return; }
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
    const countInput = document.getElementById('follow-up-count');
    let count = parseInt(countInput.value);
    const container = document.getElementById('text-inputs-container');
    const selectedSub = document.getElementById('dynamic-input-area').getAttribute('data-selected-sub');
    container.innerHTML = "";

    if (isNaN(count) || count <= 0) return;

    // batasi jumlah baris agar antrian tidak terlalu panjang
    if (count > MAX_ROWS_PER_SUBMIT) {
        alert(`Maksimal ${MAX_ROWS_PER_SUBMIT} baris per pengiriman. Jumlah diturunkan otomatis.`);
        count = MAX_ROWS_PER_SUBMIT;
        countInput.value = count;
    }

    const config = configMap[selectedSub] || { col1: "Nama", col2: "Keterangan", type2: "text" };

    for (let i = 1; i <= count; i++) {
        const row = document.createElement('div');
        row.className = "input-row";
        row.style.marginBottom = "15px";

        let html = "";

        if (config.hideCol1) {
            html += `<input type="hidden" class="dynamic-text-input col-main" value="">`;
        } else {
            html += `<input type="text" placeholder="${i}. ${config.col1}" class="dynamic-text-input col-main" style="flex: 3; min-width: 0; padding: 10px;">`;
        }

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

        if (currentMenu === 'akuisisi') {
            html += `<select class="number-input-small col-kawasan" style="flex: 3; min-width: 0; padding: 10px 4px; font-size: 12px;">
                        <option value="" disabled selected>Pilih Kawasan</option>
                        <option value="Pasbar">Pasbar</option>
                        <option value="Mangga Dua">Mangga Dua</option>
                        <option value="Kemayoran">Kemayoran</option>
                        <option value="Serbu Sekolah">Serbu Sekolah</option>
                        <option value="Inacraft">Inacraft</option>
                        <option value="No">No</option>
                    </select>`;
        }

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

// ============================================================
// SUBMIT FORM DINAMIS (Monitoring / Akuisisi)
// ============================================================
async function submitFinalData() {
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
        if (kategori === "Akuisisi Payroll") destinationSheet = "Akuisisi Payroll";
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

        const val1 = row.querySelector('.col-main') ? row.querySelector('.col-main').value.trim() : "";
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

        const kawasanEl = row.querySelector('.col-kawasan');
        const kawasanValue = kawasanEl ? kawasanEl.value.trim() : "";

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

        if (currentMenu === 'akuisisi' && kawasanValue === "") {
            alert(`Baris ${rowNum}: Kawasan harus dipilih.`);
            return;
        }

        let payload = {
            targetSheet: destinationSheet,
            tanggal: tanggal,
            kodeCabang: kodeCabang,
            nip: nip,
            kategori: kategori,
            subKategori: subKategori,
            total: "1",
            kawasan: kawasanValue,
            status: statusVal
        };

        if (currentMenu === 'akuisisi') {
            payload.fields = [val1, val2, val3, val4, val5];
        } else {
            payload.namaNasabah = val1;
            payload.cifNasabah = val2;
            payload.produk = val3;
            payload.keterangan = val4;
            payload.cifMitra = val5;
        }

        dataToSubmit.push(payload);
    }

    const btn = document.getElementById('submit-btn');
    setBtnLoading(btn);

    // Kirim satu per satu. Baris yang SUDAH terkirim dihapus dari DOM,
    // sehingga jika terjadi gagal di tengah, baris yang belum terkirim
    // tetap tampil dan bisa dikirim ulang TANPA duplikat.
    let successCount = 0;
    for (let i = 0; i < dataToSubmit.length; i++) {
        try {
            await addToQueue(dataToSubmit[i], btn);
            successCount++;
            const rowEl = rows[i];
            if (rowEl && rowEl.parentNode) {
                rowEl.parentNode.removeChild(rowEl);
            }
        } catch (err) {
            const msg = (err && err.message) ? err.message : err;
            alert(
                "Pengiriman dihentikan.\n" +
                `${successCount} data berhasil dikirim.\n` +
                `Data ke-${i + 1} gagal: ${msg}\n\n` +
                "Baris yang belum terkirim tetap ditampilkan. Periksa data lalu kirim ulang."
            );
            return; // baris sisanya tetap di DOM
        }
    }

    alert(`Sukses! ${successCount} data berhasil dikirim ke sheet: ${destinationSheet}`);
    resetDynamicForm();
}

// bersihkan form dinamis dan kembali ke daftar kategori
// (kode cabang, tanggal, dan NIP TETAP terisi)
function resetDynamicForm() {
    document.getElementById('text-inputs-container').innerHTML = "";
    document.getElementById('follow-up-count').value = "";

    const dynamicInputArea = document.getElementById('dynamic-input-area');
    if (dynamicInputArea) {
        dynamicInputArea.style.display = 'none';
        dynamicInputArea.removeAttribute('data-selected-sub');
        dynamicInputArea.removeAttribute('data-selected-cat');
    }

    const btn = document.getElementById('submit-btn');
    if (btn) { btn.innerText = "Submit Data"; btn.disabled = false; }

    goToPage('page2');
}

// ============================================================
// RESET PENUH (kembali ke halaman awal)
// ============================================================
function resetForm() {
    // batalkan antrian yang masih tertunda
    if (submissionQueue.length > 0) {
        haltQueue("Pengiriman dibatalkan (form direset).");
    }

    document.getElementById('mon-date').value = '';
    document.getElementById('branch-code').value = '';
    document.getElementById('nip-code').value = '';
    currentNIP = '';
    currentMenu = '';
    merchantData = [];
    newcifData = [];
    ccData = [];
    currentCCType = "";
    gpData = [];
    currentGPType = "";

    clearFields([
        'merchant-input', 'visit-status', 'visit-date', 'visit-result', 'keterangan-pipeline',
        'newcif-input', 'newcif-visit-status', 'newcif-visit-date', 'newcif-visit-result', 'newcif-keterangan',
        'cc-input', 'cc-visit-status', 'cc-visit-date', 'cc-visit-result', 'cc-keterangan', 'follow-up-count',
        'gp-input', 'gp-visit-status', 'gp-visit-date', 'gp-visit-result', 'gp-keterangan'
    ]);

    ['merchant-list', 'newcif-list', 'cc-list', 'gp-list', 'text-inputs-container'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    const dynamicInputArea = document.getElementById('dynamic-input-area');
    if (dynamicInputArea) {
        dynamicInputArea.style.display = 'none';
        dynamicInputArea.removeAttribute('data-selected-sub');
        dynamicInputArea.removeAttribute('data-selected-cat');
    }

    const ccSubMenu = document.getElementById('cc-sub-menu');
    if (ccSubMenu) ccSubMenu.style.display = 'block';
    const ccForm = document.getElementById('cc-form');
    if (ccForm) ccForm.style.display = 'none';

    resetSubmitButtons();

    const errorMsg = document.getElementById('error-msg');
    if (errorMsg) errorMsg.style.display = 'none';

    goToPage('page1');
}

// ============================================================
// LAIN-LAIN
// ============================================================
// CATATAN KEAMANAN: password di bawah hanya gerbang kasual.
// Password dan URL sheet tetap terlihat di source halaman.
// Jangan mengandalkan ini untuk melindungi data sensitif.
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