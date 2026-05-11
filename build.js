const fs = require('fs');
const path = require('path');

const base64Str = fs.readFileSync(path.join(__dirname, 'template_base64.txt'), 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulir Pengisian CV LPK</title>
    <!-- ExcelJS from CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>
    <!-- Cropper.js from CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        img, video { max-width: 100%; height: auto; }

        :root {
            --primary-color: #1a73e8;
            --primary-hover: #1557b0;
            --bg-color: #f0f4f9;
            --card-bg: #ffffff;
            --text-color: #202124;
            --border-color: #dadce0;
            --error-color: #d93025;
            --success-color: #188038;
        }

        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 4%;
            box-sizing: border-box;
        }

        .header {
            background-color: var(--card-bg);
            border-radius: 8px;
            padding: clamp(1rem, 4%, 2rem);
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border-top: 8px solid var(--primary-color);
            box-sizing: border-box;
            width: 100%;
        }

        .header h1 {
            margin: 0 0 0.5rem 0;
            font-size: clamp(1.3rem, 5vw, 2rem);
            color: var(--text-color);
        }

        .header p {
            margin: 0;
            color: #5f6368;
        }

        .progress-container {
            background-color: #e0e0e0;
            border-radius: 4px;
            height: 8px;
            margin-bottom: 1.5rem;
            overflow: hidden;
        }

        .progress-bar {
            background-color: var(--primary-color);
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }

        .step-indicator {
            font-size: 0.9rem;
            color: #5f6368;
            margin-bottom: 1rem;
            font-weight: 500;
        }

        .card {
            background-color: var(--card-bg);
            border-radius: 8px;
            padding: clamp(1rem, 4%, 2rem);
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            display: none;
            animation: fadeIn 0.4s ease-in-out;
            box-sizing: border-box;
            width: 100%;
        }

        .card.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card-title {
            font-size: clamp(1.1rem, 4.5vw, 1.5rem);
            margin-top: 0;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-color);
        }

        .required::after {
            content: " *";
            color: var(--error-color);
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        select,
        textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
            font-family: inherit;
            transition: border-color 0.2s;
        }

        input:focus,
        select:focus,
        textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .error-message {
            color: var(--error-color);
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: none;
        }

        .form-group.has-error input,
        .form-group.has-error select,
        .form-group.has-error textarea {
            border-color: var(--error-color);
        }

        .form-group.has-error .error-message {
            display: block;
        }

        .row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -0.5rem;
        }

        .col {
            flex: 1 1 45%;
            padding: 0 0.5rem;
            min-width: 0;
        }

        @media (max-width: 480px) {
            .col {
                flex: 1 1 100%;
            }
        }

        .btn-group {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        button {
            padding: 0.6rem clamp(0.75rem, 3%, 1.5rem);
            font-size: clamp(0.85rem, 3.5vw, 1rem);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s, box-shadow 0.2s;
            font-family: inherit;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--primary-hover);
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background-color: #f8f9fa;
        }

        .btn-success {
            background-color: var(--success-color);
            color: white;
        }
        
        .btn-success:hover {
            background-color: #146c2e;
        }

        .btn-small {
            display: none;
        }

        .input-group {
            display: flex;
            align-items: stretch;
        }

        .input-group input {
            flex: 1;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;
        }

        .input-group-btn {
            padding: 0 0.75rem;
            font-size: 0.78rem;
            font-weight: 600;
            white-space: nowrap;
            background-color: #f0f7ff;
            color: #1a73e8;
            border: 1px solid var(--border-color);
            border-left: none;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            cursor: pointer;
            transition: background-color 0.15s;
            font-family: inherit;
        }

        .input-group-btn:hover {
            background-color: #d7eaff;
        }

        .form-group.has-error .input-group input {
            border-color: var(--error-color);
        }

        .form-group.has-error .input-group-btn {
            border-color: var(--error-color);
        }

        .repeated-group {
            background-color: #f8f9fa;
            border: 1px solid var(--border-color);
            padding: clamp(0.75rem, 3%, 1.5rem);
            border-radius: 8px;
            margin-bottom: 1.5rem;
            position: relative;
            box-sizing: border-box;
            width: 100%;
        }

        .repeated-title {
            margin-top: 0;
            font-size: 1.1rem;
            color: var(--primary-color);
        }

        .preview-section {
            margin-bottom: 2rem;
        }

        .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: clamp(0.78rem, 3vw, 0.9rem);
            table-layout: fixed;
            word-break: break-word;
        }

        .preview-table th,
        .preview-table td {
            padding: clamp(0.4rem, 2%, 0.75rem);
            border-bottom: 1px solid var(--border-color);
            text-align: left;
        }

        .preview-table th {
            width: 35%;
            color: #5f6368;
            font-weight: 500;
        }

        .preview-section-title {
            margin: 1.5rem 0 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-color);
            color: var(--primary-color);
            font-size: 1.1rem;
        }

        .preview-content {
            margin-bottom: 2rem;
        }

        .preview-table thead th {
            background-color: #f8f9fa;
            border-bottom: 2px solid #dee2e6;
            color: var(--text-color);
        }

        .action-buttons {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
            margin-top: 2rem;
            flex-wrap: wrap;
        }
        
        .action-buttons button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem clamp(0.75rem, 3%, 1.5rem);
            font-size: clamp(0.85rem, 3.5vw, 1.1rem);
        }

        /* Cropper Modal Styles */
        .cropper-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .cropper-container-wrapper {
            background-color: white;
            border-radius: 8px;
            padding: 1rem;
            max-width: 90%;
            max-height: 80%;
            width: 500px;
            display: flex;
            flex-direction: column;
        }

        .cropper-area {
            max-height: 400px;
            margin-bottom: 1rem;
            overflow: hidden;
        }

        .cropper-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        /* WhatsApp Modal Styles */
        .whatsapp-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .whatsapp-modal-card {
            background-color: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: modalSlideUp 0.3s ease-out;
        }

        @keyframes modalSlideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .whatsapp-modal-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.5rem;
            color: #128c7e;
        }

        .whatsapp-modal-header h3 {
            margin: 0;
            font-size: 1.4rem;
        }

        .whatsapp-modal-body {
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .whatsapp-modal-body p {
            margin-top: 0;
            color: #444;
        }

        .whatsapp-modal-body ol {
            padding-left: 1.2rem;
            margin-bottom: 0;
        }

        .whatsapp-modal-body li {
            margin-bottom: 0.5rem;
            color: #555;
        }

        .whatsapp-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
    </style>
</head>
<body>


<div class="container">
    <div class="header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
        <div>
            <h1>Formulir Pengisian CV LPK</h1>
            <p>Lengkapi data diri Anda di bawah ini. Semua data tersimpan secara lokal dan langsung diunduh dalam format Excel.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn-secondary" id="btn-faker" onclick="fillFakeData()" style="font-size: 0.85rem; padding: 0.5rem 1rem; white-space: nowrap; border-color: #fbbc04; color: #b07d00;">✨ Isi Data Dummy</button>
            <button type="button" class="btn-secondary" id="btn-reset" onclick="resetForm()" style="font-size: 0.85rem; padding: 0.5rem 1rem; white-space: nowrap; border-color: #dc3545; color: #dc3545;">🗑️ Reset Data</button>
        </div>
    </div>

    <div class="step-indicator" id="step-indicator">Langkah 1 dari 9: Informasi Dasar</div>
    <div class="progress-container">
        <div class="progress-bar" id="progress-bar"></div>
    </div>

    <form id="cv-form">
        <!-- Step 1: Informasi Dasar -->
        <div class="card active" id="step-1">
            <h2 class="card-title">Informasi Dasar</h2>
            <div class="form-group">
                <label for="foto">Foto 3x4 (Maks 2MB)</label>
                <input type="file" id="foto" name="foto" accept="image/jpeg, image/png" onchange="previewFoto(event)">
                <div id="foto_preview_container" style="margin-top: 10px; display: none; text-align: center;">
                    <img id="foto_preview" src="" alt="Preview Foto" style="max-width: 120px; border: 1px solid #ccc; border-radius: 4px;">
                    <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                        <button type="button" onclick="editFoto()" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; background-color: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Edit Foto</button>
                        <button type="button" onclick="hapusFoto()" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus Foto</button>
                    </div>
                </div>
                <input type="hidden" id="foto_base64" name="foto_base64">
            </div>


            <div class="form-group">
                <label class="required" for="nama">Nama Lengkap</label>
                <input type="text" id="nama" name="nama" required placeholder="Contoh: Fendy Rahmad Mulia">
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="form-group">
                <label class="required" for="furigana">Furigana (Katakana)</label>
                <input type="text" id="furigana" name="furigana" required placeholder="Contoh: フェンディ ラフマド ムリア">
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="tgl_lahir">Tanggal Lahir</label>
                    <input type="date" id="tgl_lahir" name="tgl_lahir" required>
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="umur">Umur (Tahun)</label>
                    <input type="number" id="umur" name="umur" required min="16" max="60" readonly style="background-color: #e9ecef; cursor: not-allowed;">
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="golongan_darah">Golongan Darah</label>
                    <select id="golongan_darah" name="golongan_darah" required>
                        <option value="">Pilih...</option>
                        <option value="A型">A</option>
                        <option value="B型">B</option>
                        <option value="AB型">AB</option>
                        <option value="O型">O</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="status_pernikahan">Status Pernikahan</label>
                    <select id="status_pernikahan" name="status_pernikahan" required>
                        <option value="">Pilih...</option>
                        <option value="未婚">Belum Menikah (未婚)</option>
                        <option value="既婚">Menikah (既婚)</option>
                        <option value="-">-</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
        </div>

        <!-- Step 2: Fisik & Kesehatan -->
        <div class="card" id="step-2">
            <h2 class="card-title">Fisik & Kesehatan</h2>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="tinggi">Tinggi Badan (cm)</label>
                    <input type="number" id="tinggi" name="tinggi" required>
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="berat">Berat Badan (kg)</label>
                    <input type="number" id="berat" name="berat" required>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <!-- Hidden inputs for fixed eye vision values -->
            <input type="hidden" id="mata_kanan" name="mata_kanan" value="1.0">
            <input type="hidden" id="mata_kiri" name="mata_kiri" value="1.0">
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="buta_warna">Buta Warna</label>
                    <select id="buta_warna" name="buta_warna" required>
                        <option value="">Pilih...</option>
                        <option value="無">Tidak (無)</option>
                        <option value="有">Ya (有)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="tangan_dominan">Tangan Dominan</label>
                    <select id="tangan_dominan" name="tangan_dominan" required>
                        <option value="">Pilih...</option>
                        <option value="右">Kanan (右)</option>
                        <option value="左">Kiri (左)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="merokok">Merokok</label>
                    <select id="merokok" name="merokok" required>
                        <option value="">Pilih...</option>
                        <option value="無">Tidak (無)</option>
                        <option value="有">Ya (有)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="alkohol">Minum Alkohol</label>
                    <select id="alkohol" name="alkohol" required>
                        <option value="">Pilih...</option>
                        <option value="無">Tidak (無)</option>
                        <option value="有">Ya (有)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <div class="form-group">
                <label class="required" for="riwayat_penyakit">Riwayat Penyakit</label>
                <select id="riwayat_penyakit" name="riwayat_penyakit" required>
                    <option value="">Pilih...</option>
                    <option value="無">Tidak Ada (無)</option>
                    <option value="有">Ada (有)</option>
                </select>
                <div class="error-message">Wajib diisi</div>
            </div>
        </div>

        <!-- Step 3: Alamat & Kontak -->
        <div class="card" id="step-3">
            <h2 class="card-title">Alamat & Kontak</h2>
            <div class="form-group">
                <label class="required" for="alamat">Alamat Lengkap (Romaji)</label>
                <textarea id="alamat" name="alamat" required placeholder="Contoh: PERUM GRAHA CIANTRA INDAH KEC CIKARANG SELATAN"></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="form-group">
                <label class="required" for="no_hp">Nomor HP / WhatsApp</label>
                <input type="tel" id="no_hp" name="no_hp" required placeholder="Contoh: 08123456789">
                <div class="error-message">Wajib diisi</div>
            </div>
        </div>

        <!-- Step 4: Latar Belakang & Motivasi -->
        <div class="card" id="step-4">
            <h2 class="card-title">Latar Belakang & Motivasi</h2>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="mata_pelajaran">Mata Pelajaran/Bidang Keahlian</label>
                    <input type="text" id="mata_pelajaran" name="mata_pelajaran" required placeholder="Contoh: 機械工学 (Teknik Mesin)">
                    <div class="error-message">Wajib diisi</div>
                </div>
                <div class="col form-group">
                    <label class="required" for="pengalaman_asrama">Pengalaman Hidup Berkelompok/Asrama</label>
                    <select id="pengalaman_asrama" name="pengalaman_asrama" required>
                        <option value="">Pilih...</option>
                        <option value="無">Tidak (無)</option>
                        <option value="有">Ya (有)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <div class="row">
                <div class="col form-group">
                    <label for="pendapatan_rp">Pendapatan Pribadi Saat Ini (Ketik Rupiah, opsi)</label>
                    <input type="number" id="pendapatan_rp" name="pendapatan_rp" placeholder="Contoh: 3000000">
                    <input type="hidden" id="pendapatan" name="pendapatan">
                    <div id="pendapatan_yen_text" style="font-size: 0.9rem; color: #1a73e8; margin-top: 0.5rem; font-weight: 500;"></div>
                </div>
                <div class="col form-group">
                    <label class="required" for="target_tabungan_rp">Target Tabungan (Ketik Rupiah)</label>
                    <input type="number" id="target_tabungan_rp" name="target_tabungan_rp" required placeholder="Contoh: 100000000">
                    <input type="hidden" id="target_tabungan" name="target_tabungan">
                    <div id="target_tabungan_yen_text" style="font-size: 0.9rem; color: #1a73e8; margin-top: 0.5rem; font-weight: 500;"></div>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
            <div class="form-group">
                <label class="required" for="alasan">Alasan / Motivasi (Jepang/Romaji)</label>
                <textarea id="alasan" name="alasan" required placeholder="Contoh: 日本の優れた働き方を通じて自己成長したいと考えています..."></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="form-group">
                <label class="required" for="pekerjaan_nanti">Pekerjaan yang diinginkan setelah pulang</label>
                <textarea id="pekerjaan_nanti" name="pekerjaan_nanti" required placeholder="Contoh: インターンシップで得た知識を活かしながら..."></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="row">
                <div class="col form-group">
                    <label class="required" for="pengalaman_visa">Pengalaman Apply Visa Jepang</label>
                    <select id="pengalaman_visa" name="pengalaman_visa" required>
                        <option value="">Pilih...</option>
                        <option value="無">Tidak (無)</option>
                        <option value="有">Ya (有)</option>
                    </select>
                    <div class="error-message">Wajib diisi</div>
                </div>
            </div>
        </div>

        <!-- Step 5: Pendidikan -->
        <div class="card" id="step-5">
            <h2 class="card-title">Pendidikan (學歴)</h2>
            <p>Isi dari pendidikan dasar (SD) hingga pendidikan terakhir. Maksimal 3 riwayat.</p>
            
            <div id="pendidikan-container">
                <!-- Template Pendidikan diulang via JS -->
            </div>
            <button type="button" class="btn-secondary" id="btn-add-pendidikan" style="margin-top: 1rem; width: 100%; border-style: dashed;">
                + Tambah Pendidikan
            </button>
        </div>

        <!-- Step 6: Pengalaman Kerja -->
        <div class="card" id="step-6">
            <h2 class="card-title">Pengalaman Kerja (職歴)</h2>
            <p>Isi riwayat pekerjaan Anda. Kosongkan jika belum ada pengalaman.</p>
            
            <div id="pekerjaan-container">
                <!-- Template Pekerjaan diulang via JS -->
            </div>
            <button type="button" class="btn-secondary" id="btn-add-pekerjaan" style="margin-top: 1rem; width: 100%; border-style: dashed;">
                + Tambah Pekerjaan
            </button>
        </div>

        <!-- Step 7: Keluarga -->
        <div class="card" id="step-7">
            <h2 class="card-title">Keluarga (家族構成)</h2>
            <p>Isi data anggota keluarga Anda (ayah, ibu, saudara).</p>
            
            <div id="keluarga-container">
                <!-- Template Keluarga diulang via JS -->
            </div>
            <button type="button" class="btn-secondary" id="btn-add-keluarga" style="margin-top: 1rem; width: 100%; border-style: dashed;">
                + Tambah Anggota Keluarga
            </button>
        </div>

        <!-- Step 8: Lain-lain -->
        <div class="card" id="step-8">
            <h2 class="card-title">Lain-lain</h2>
            <div class="form-group">
                <label class="required" for="hobi">Hobi & Keahlian Khusus (趣味・特技)</label>
                <textarea id="hobi" name="hobi" required placeholder="Contoh: 趣味はジョギングすることです"></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="form-group">
                <label class="required" for="kepribadian">Kepribadian & Kelebihan (性格・アピールポイントなど)</label>
                <textarea id="kepribadian" name="kepribadian" required placeholder="Jelaskan kelebihan dan kekurangan Anda"></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
            <div class="form-group">
                <label class="required" for="komitmen">Komitmen saat magang (実習するうえで心がけること)</label>
                <textarea id="komitmen" name="komitmen" required placeholder="Contoh: 粘り強く、規律を守り、チームで協力して働くことができる人間です。"></textarea>
                <div class="error-message">Wajib diisi</div>
            </div>
        </div>

        <!-- Step 9: Preview & Actions -->
        <div class="card" id="step-9">
            <h2 class="card-title">Selesai! Preview Data</h2>
            <div class="preview-section" id="preview-container">
                <!-- Data preview akan diisi via JS -->
            </div>
            
            <div class="action-buttons" style="flex-wrap: wrap;">
                <button type="button" class="btn-secondary" id="btn-back-preview" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 1.1rem;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Kembali
                </button>
                <button type="button" class="btn-primary" id="btn-download">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Excel
                </button>
                <button type="button" class="btn-success" id="btn-wa" onclick="showWhatsappModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Share via WhatsApp
                </button>
            </div>
            <p style="text-align: center; font-size: 0.85rem; color: #5f6368; margin-top: 1rem;">
                * Jika Share WhatsApp tidak muncul, silakan Download Excel lalu kirim manual.
            </p>
        </div>

        <div class="btn-group">
            <button type="button" class="btn-secondary" id="btn-prev" style="visibility: hidden;">Kembali</button>
            <button type="button" class="btn-primary" id="btn-next">Lanjut</button>
        </div>
    </form>
</div>

<script>
    // BASE64 TEMPLATE EXCEL
    const TEMPLATE_BASE64 = "__BASE64_PLACEHOLDER__";

    // APP STATE
    let currentStep = 1;
    const totalSteps = 9;
    const stepNames = [
        "Informasi Dasar", "Fisik & Kesehatan", "Alamat & Kontak", 
        "Latar Belakang & Motivasi", "Pendidikan", "Pengalaman Kerja", 
        "Keluarga", "Lain-lain", "Preview & Selesai"
    ];

    // INITIALIZATION
    document.addEventListener("DOMContentLoaded", () => {
        generateDynamicFields();
        updateUI();
        loadFromLocalStorage();

        // Bind events
        document.getElementById("btn-next").addEventListener("click", nextStep);
        document.getElementById("btn-prev").addEventListener("click", prevStep);
        document.getElementById("btn-back-preview").addEventListener("click", prevStep);
        document.getElementById("btn-download").addEventListener("click", downloadExcel);
        // document.getElementById("btn-wa").addEventListener("click", showWhatsappModal); // Moved to inline onclick for reliability
        document.getElementById("btn-faker").addEventListener("click", fillFakeData);
        document.getElementById("btn-add-keluarga").addEventListener("click", addKeluarga);
        document.getElementById("btn-add-pendidikan").addEventListener("click", addPendidikan);
        document.getElementById("btn-add-pekerjaan").addEventListener("click", addKerja);
        
        // Auto-calculate age
        document.getElementById("tgl_lahir").addEventListener("change", calculateAge);
        
        // Autosave on change
        document.getElementById("cv-form").addEventListener("input", saveToLocalStorage);
        
        // Fetch exchange rate and setup conversion
        setupCurrencyConversion();
    });

    // CURRENCY CONVERSION
    let exchangeRateJPY = 0;
    function setupCurrencyConversion() {
        fetch('https://api.exchangerate-api.com/v4/latest/IDR')
            .then(res => res.json())
            .then(data => {
                exchangeRateJPY = data.rates.JPY;
                // Trigger calculation if there are existing values
                document.getElementById('pendapatan_rp').dispatchEvent(new Event('input'));
                document.getElementById('target_tabungan_rp').dispatchEvent(new Event('input'));
            })
            .catch(e => console.error("Gagal mengambil kurs API:", e));

        const bindConvert = (rpId, hiddenId, displayId) => {
            const rpInput = document.getElementById(rpId);
            rpInput.addEventListener('input', function() {
                const rp = parseFloat(this.value);
                if (isNaN(rp) || exchangeRateJPY === 0) {
                    document.getElementById(displayId).textContent = '';
                    document.getElementById(hiddenId).value = '';
                    return;
                }
                
                const yen = Math.round(rp * exchangeRateJPY);
                const yenFormatted = yen.toLocaleString('ja-JP') + '円';
                
                document.getElementById(displayId).textContent = \`Setara: \${yenFormatted}\`;
                document.getElementById(hiddenId).value = yenFormatted;
            });
        };

        bindConvert('pendapatan_rp', 'pendapatan', 'pendapatan_yen_text');
        bindConvert('target_tabungan_rp', 'target_tabungan', 'target_tabungan_yen_text');
    }

    // AUTO CALCULATE AGE
    function calculateAge() {
        const tglLahir = document.getElementById("tgl_lahir").value;
        if (!tglLahir) return;
        
        const birthDate = new Date(tglLahir);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        const umurInput = document.getElementById("umur");
        umurInput.value = age;
        
        // Clear error if any
        const fg = umurInput.closest('.form-group');
        if (fg) fg.classList.remove('has-error');
        
        // Trigger autosave
        document.getElementById("cv-form").dispatchEvent(new Event('input'));
    }

    // YEAR FORMATTER HELPER
    function formatYear(val) {
        if (!val) return '';
        val = val.toString().trim();
        // If it's exactly 4 digits, append '年'
        if (/^\\d{4}$/.test(val)) {
            return val + '年';
        }
        return val;
    }

    // Attach year formatter to inputs
    function attachYearFormatter(id) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', function() {
                this.value = formatYear(this.value);
                // Trigger autosave
                document.getElementById("cv-form").dispatchEvent(new Event('input'));
            });
        }
    }

    // DYNAMIC FIELDS GENERATION
    function generateDynamicFields() {
        // Pendidikan (4 max)
        let eduHtml = '';
        for (let i = 1; i <= 4; i++) {
            eduHtml += \`
                <div class="repeated-group" id="pendidikan_group_\${i}" style="\${i > 1 ? 'display: none;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 class="repeated-title" style="margin-bottom: 0;">Riwayat \${i}</h3>
                        \${i > 1 ? \`<button type="button" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="removePendidikan(\${i})">Hapus</button>\` : ''}
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="edu_start_\${i}">Tahun Mulai (hanya angka, misal: 2014)</label>
                            <input type="text" id="edu_start_\${i}" name="edu_start_\${i}" \${i === 1 ? 'required' : ''} placeholder="Contoh: 2014">
                            <div class="error-message">Wajib diisi</div>
                        </div>
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="edu_end_\${i}">Tahun Lulus (hanya angka, misal: 2020)</label>
                            <input type="text" id="edu_end_\${i}" name="edu_end_\${i}" \${i === 1 ? 'required' : ''} placeholder="Contoh: 2020">
                            <div class="error-message">Wajib diisi</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="edu_school_\${i}">Nama Sekolah</label>
                            <input type="text" id="edu_school_\${i}" name="edu_school_\${i}" \${i === 1 ? 'required' : ''}>
                            <div class="error-message">Wajib diisi</div>
                        </div>
                        <div class="col form-group">
                            <label for="edu_cert_\${i}">Sertifikat / Keterangan</label>
                            <select id="edu_cert_\${i}" name="edu_cert_\${i}">
                                <option value="卒業">Lulus (卒業)</option>
                                <option value="卒業見込み">Akan Lulus (卒業見込み)</option>
                                <option value="卒業証明書">Ijazah (卒業証明書)</option>
                                <option value="中退">Berhenti/Keluar (中退)</option>
                            </select>
                        </div>
                    </div>
                </div>
            \`;
        }
        document.getElementById("pendidikan-container").innerHTML = eduHtml;
        // Attach formatters
        for (let i = 1; i <= 4; i++) {
            attachYearFormatter(\`edu_start_\${i}\`);
            attachYearFormatter(\`edu_end_\${i}\`);
        }

        // Pekerjaan (4 max)
        let workHtml = '';
        for (let i = 1; i <= 4; i++) {
            workHtml += \`
                <div class="repeated-group" id="pekerjaan_group_\${i}" style="\${i > 1 ? 'display: none;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 class="repeated-title" style="margin-bottom: 0;">Pekerjaan \${i}</h3>
                        \${i > 1 ? \`<button type="button" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="removeKerja(\${i})">Hapus</button>\` : ''}
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label for="work_start_\${i}">Tahun Mulai (hanya angka, misal: 2021)</label>
                            <input type="text" id="work_start_\${i}" name="work_start_\${i}" placeholder="Contoh: 2021">
                        </div>
                        <div class="col form-group">
                            <label for="work_end_\${i}">Tahun Selesai (hanya angka, misal: 2023)</label>
                            <input type="text" id="work_end_\${i}" name="work_end_\${i}" placeholder="Contoh: 2023">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label for="work_company_\${i}">Nama Perusahaan</label>
                            <input type="text" id="work_company_\${i}" name="work_company_\${i}">
                        </div>
                        <div class="col form-group">
                            <label for="work_job_\${i}">Posisi / Pekerjaan</label>
                            <input type="text" id="work_job_\${i}" name="work_job_\${i}">
                        </div>
                    </div>
                </div>
            \`;
        }
        document.getElementById("pekerjaan-container").innerHTML = workHtml;
        // Attach formatters
        for (let i = 1; i <= 4; i++) {
            attachYearFormatter(\`work_start_\${i}\`);
            attachYearFormatter(\`work_end_\${i}\`);
        }

        // Keluarga (4 max)
        let famHtml = '';
        for (let i = 1; i <= 4; i++) {
            famHtml += \`
                <div class="repeated-group" id="keluarga_group_\${i}" style="\${i > 1 ? 'display: none;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3 class="repeated-title" style="margin-bottom: 0;">Anggota Keluarga \${i}</h3>
                        \${i > 1 ? \`<button type="button" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="removeKeluarga(\${i})">Hapus</button>\` : ''}
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="fam_name_\${i}">Nama</label>
                            <input type="text" id="fam_name_\${i}" name="fam_name_\${i}" \${i === 1 ? 'required' : ''}>
                            <div class="error-message">Wajib diisi</div>
                        </div>
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="fam_rel_\${i}">Hubungan</label>
                            <select id="fam_rel_\${i}" name="fam_rel_\${i}" \${i === 1 ? 'required' : ''}>
                                <option value="">Pilih Hubungan...</option>
                                <option value="父">Ayah (父)</option>
                                <option value="母">Ibu (母)</option>
                                <option value="兄">Kakak Laki-laki (兄)</option>
                                <option value="弟">Adik Laki-laki (弟)</option>
                                <option value="姉">Kakak Perempuan (姉)</option>
                                <option value="妹">Adik Perempuan (妹)</option>
                                <option value="夫">Suami (夫)</option>
                                <option value="妻">Istri (妻)</option>
                                <option value="子">Anak (子)</option>
                                <option value="祖父">Kakek (祖父)</option>
                                <option value="祖母">Nenek (祖母)</option>
                                <option value="叔父">Paman (叔父)</option>
                                <option value="叔母">Bibi (叔母)</option>
                            </select>
                            <div class="error-message">Wajib diisi</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="fam_age_\${i}">Umur</label>
                            <input type="number" id="fam_age_\${i}" name="fam_age_\${i}" \${i === 1 ? 'required' : ''} placeholder="Contoh: 44">
                            <div class="error-message">Wajib diisi</div>
                        </div>
                        <div class="col form-group">
                            <label \${i === 1 ? 'class="required"' : ''} for="fam_job_\${i}">Pekerjaan (contoh: 社員)</label>
                            <input type="text" id="fam_job_\${i}" name="fam_job_\${i}" \${i === 1 ? 'required' : ''}>
                            <div class="error-message">Wajib diisi</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label \${i === 1 ? 'class="required"' : ''} for="fam_together_\${i}">Tinggal Bersama?</label>
                        <select id="fam_together_\${i}" name="fam_together_\${i}" \${i === 1 ? 'required' : ''}>
                            <option value="">Pilih...</option>
                            <option value="〇">Ya (〇)</option>
                            <option value="X">Tidak</option>
                        </select>
                        <div class="error-message">Wajib diisi</div>
                    </div>
                </div>
            \`;
        }
        document.getElementById("keluarga-container").innerHTML = famHtml;
    }

    // NAVIGATION
    function updateUI() {
        // Update cards
        document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
        document.getElementById(\`step-\${currentStep}\`).classList.add('active');

        // Update progress
        const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        document.getElementById("progress-bar").style.width = \`\${percent}%\`;
        document.getElementById("step-indicator").textContent = \`Langkah \${currentStep} dari \${totalSteps}: \${stepNames[currentStep - 1]}\`;

        // Update buttons
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");
        const btnGroup = document.querySelector(".btn-group");
        
        btnPrev.style.visibility = currentStep === 1 ? "hidden" : "visible";
        
        if (currentStep === totalSteps) {
            btnGroup.style.display = "none"; // Hide bottom global navigation on preview step
            generatePreview();
        } else {
            btnGroup.style.display = "flex";
            btnNext.style.display = "block";
            btnNext.textContent = "Lanjut";
        }
        
        window.scrollTo(0, 0);
    }

    function validateCurrentStep() {
        const currentCard = document.getElementById(\`step-\${currentStep}\`);
        const inputs = currentCard.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        let firstErrorInput = null;

        inputs.forEach(input => {
            // Abaikan field yang readonly (menggunakan properti dan atribut)
            if (input.readOnly || input.hasAttribute('readonly')) return; 
            
            if (!input.value.trim()) {
                isValid = false;
                input.closest('.form-group').classList.add('has-error');
                if (!firstErrorInput) firstErrorInput = input;
            } else {
                input.closest('.form-group').classList.remove('has-error');
            }
        });

        // Add event listener to remove error class on input
        inputs.forEach(input => {
            if (input.readOnly) return; // Abaikan field yang readonly
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.closest('.form-group').classList.remove('has-error');
                }
            }, { once: true });
        });

        if (!isValid && firstErrorInput) {
            firstErrorInput.focus();
            // Scroll sedikit ke atas agar tidak tertutup header
            const y = firstErrorInput.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({top: y, behavior: 'smooth'});
        }

        return isValid;
    }

    function nextStep() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateUI();
            }
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    }

    // LOCAL STORAGE
    function saveToLocalStorage() {
        const formData = new FormData(document.getElementById("cv-form"));
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('cv_data', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('cv_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input && input.type !== 'file') {
                    input.value = data[key];
                }
            });
            
            // Trigger calculateAge after loading
            calculateAge();
            
            // Reveal family members if they have data
            for (let i = 2; i <= 4; i++) {
                if (data[\`fam_name_\${i}\`]) {
                    document.getElementById(\`keluarga_group_\${i}\`).style.display = 'block';
                    currentKeluargaCount = i;
                }
            }
            if (currentKeluargaCount >= 4) {
                document.getElementById('btn-add-keluarga').style.display = 'none';
            }
            
            // Reveal pendidikan if they have data
            for (let i = 2; i <= 3; i++) {
                if (data[\`edu_school_\${i}\`]) {
                    document.getElementById(\`pendidikan_group_\${i}\`).style.display = 'block';
                    currentPendidikanCount = i;
                }
            }
            if (currentPendidikanCount >= 3) {
                document.getElementById('btn-add-pendidikan').style.display = 'none';
            }
            
            // Reveal pekerjaan if they have data
            for (let i = 2; i <= 2; i++) {
                if (data[\`work_company_\${i}\`]) {
                    document.getElementById(\`pekerjaan_group_\${i}\`).style.display = 'block';
                    currentKerjaCount = i;
                }
            }
            if (currentKerjaCount >= 2) {
                document.getElementById('btn-add-pekerjaan').style.display = 'none';
            }
        }
    }

    // DYNAMIC ADD KELUARGA
    let currentKeluargaCount = 1;
    function addKeluarga() {
        if (currentKeluargaCount < 4) {
            currentKeluargaCount++;
            const group = document.getElementById(\`keluarga_group_\${currentKeluargaCount}\`);
            if (group) {
                group.style.display = 'block';
                group.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (currentKeluargaCount >= 4) {
                document.getElementById('btn-add-keluarga').style.display = 'none';
            }
        }
    }

    function removeKeluarga(index) {
        // Shift values up
        for (let i = index; i < currentKeluargaCount; i++) {
            const nextI = i + 1;
            document.getElementById(\`fam_name_\${i}\`).value = document.getElementById(\`fam_name_\${nextI}\`).value;
            document.getElementById(\`fam_rel_\${i}\`).value = document.getElementById(\`fam_rel_\${nextI}\`).value;
            document.getElementById(\`fam_age_\${i}\`).value = document.getElementById(\`fam_age_\${nextI}\`).value;
            document.getElementById(\`fam_job_\${i}\`).value = document.getElementById(\`fam_job_\${nextI}\`).value;
            document.getElementById(\`fam_together_\${i}\`).value = document.getElementById(\`fam_together_\${nextI}\`).value;
        }
        
        // Clear and hide the last visible one
        const lastI = currentKeluargaCount;
        document.getElementById(\`fam_name_\${lastI}\`).value = '';
        document.getElementById(\`fam_rel_\${lastI}\`).value = '';
        document.getElementById(\`fam_age_\${lastI}\`).value = '';
        document.getElementById(\`fam_job_\${lastI}\`).value = '';
        document.getElementById(\`fam_together_\${lastI}\`).value = '';
        
        document.getElementById(\`keluarga_group_\${lastI}\`).style.display = 'none';
        
        currentKeluargaCount--;
        document.getElementById('btn-add-keluarga').style.display = 'block';
        
        // Save state
        document.getElementById("cv-form").dispatchEvent(new Event('input'));
    }

    // DYNAMIC ADD PENDIDIKAN
    let currentPendidikanCount = 1;
    function addPendidikan() {
        if (currentPendidikanCount < 4) {
            currentPendidikanCount++;
            const group = document.getElementById(\`pendidikan_group_\${currentPendidikanCount}\`);
            if (group) {
                group.style.display = 'block';
                group.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (currentPendidikanCount >= 4) {
                document.getElementById('btn-add-pendidikan').style.display = 'none';
            }
        }
    }

    function removePendidikan(index) {
        for (let i = index; i < currentPendidikanCount; i++) {
            const nextI = i + 1;
            document.getElementById(\`edu_start_\${i}\`).value = document.getElementById(\`edu_start_\${nextI}\`).value;
            document.getElementById(\`edu_end_\${i}\`).value = document.getElementById(\`edu_end_\${nextI}\`).value;
            document.getElementById(\`edu_school_\${i}\`).value = document.getElementById(\`edu_school_\${nextI}\`).value;
            document.getElementById(\`edu_cert_\${i}\`).value = document.getElementById(\`edu_cert_\${nextI}\`).value;
        }
        
        const lastI = currentPendidikanCount;
        document.getElementById(\`edu_start_\${lastI}\`).value = '';
        document.getElementById(\`edu_end_\${lastI}\`).value = '';
        document.getElementById(\`edu_school_\${lastI}\`).value = '';
        document.getElementById(\`edu_cert_\${lastI}\`).value = '卒業証明書';
        
        document.getElementById(\`pendidikan_group_\${lastI}\`).style.display = 'none';
        
        currentPendidikanCount--;
        document.getElementById('btn-add-pendidikan').style.display = 'block';
        document.getElementById("cv-form").dispatchEvent(new Event('input'));
    }

    // DYNAMIC ADD PEKERJAAN
    let currentKerjaCount = 1;
    function addKerja() {
        if (currentKerjaCount < 4) {
            currentKerjaCount++;
            const group = document.getElementById(\`pekerjaan_group_\${currentKerjaCount}\`);
            if (group) {
                group.style.display = 'block';
                group.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (currentKerjaCount >= 4) {
                document.getElementById('btn-add-pekerjaan').style.display = 'none';
            }
        }
    }

    function removeKerja(index) {
        for (let i = index; i < currentKerjaCount; i++) {
            const nextI = i + 1;
            document.getElementById(\`work_start_\${i}\`).value = document.getElementById(\`work_start_\${nextI}\`).value;
            document.getElementById(\`work_end_\${i}\`).value = document.getElementById(\`work_end_\${nextI}\`).value;
            document.getElementById(\`work_company_\${i}\`).value = document.getElementById(\`work_company_\${nextI}\`).value;
            document.getElementById(\`work_job_\${i}\`).value = document.getElementById(\`work_job_\${nextI}\`).value;
        }
        
        const lastI = currentKerjaCount;
        document.getElementById(\`work_start_\${lastI}\`).value = '';
        document.getElementById(\`work_end_\${lastI}\`).value = '';
        document.getElementById(\`work_company_\${lastI}\`).value = '';
        document.getElementById(\`work_job_\${lastI}\`).value = '';
        
        document.getElementById(\`pekerjaan_group_\${lastI}\`).style.display = 'none';
        
        currentKerjaCount--;
        document.getElementById('btn-add-pekerjaan').style.display = 'block';
        document.getElementById("cv-form").dispatchEvent(new Event('input'));
    }

    // PREVIEW
    function generatePreview() {
        const formData = new FormData(document.getElementById("cv-form"));
        const data = Object.fromEntries(formData.entries());
        
        let html = '<div class="preview-content">';
        
        // Basic Info
        html += '<h3 class="preview-section-title">Informasi Pribadi</h3>';
        html += '<table class="preview-table"><tbody>';
        html += \`<tr><th>Nama Lengkap</th><td>\${data.nama}</td></tr>\`;
        html += \`<tr><th>Furigana</th><td>\${data.furigana}</td></tr>\`;
        
        let jpDate = '';
        if (data.tgl_lahir) {
            const date = new Date(data.tgl_lahir);
            jpDate = \`\${date.getFullYear()}年\${String(date.getMonth() + 1).padStart(2, '0')}月\${String(date.getDate()).padStart(2, '0')}日\`;
        }
        html += \`<tr><th>Tanggal Lahir / Umur</th><td>\${jpDate} / \${data.umur ? data.umur + '歳' : ''}</td></tr>\`;
        html += \`<tr><th>Alamat</th><td>\${data.alamat}</td></tr>\`;
        html += \`<tr><th>Kontak</th><td>\${data.no_hp}</td></tr>\`;
        html += '</tbody></table>';

        // Physical & Health
        html += '<h3 class="preview-section-title">Fisik & Kesehatan</h3>';
        html += '<table class="preview-table"><tbody>';
        html += \`<tr><th>Tinggi / Berat</th><td>\${data.tinggi} cm / \${data.berat} kg</td></tr>\`;
        html += \`<tr><th>Penglihatan</th><td>Kanan: \${data.mata_kanan} / Kiri: \${data.mata_kiri}</td></tr>\`;
        html += \`<tr><th>Buta Warna</th><td>\${data.buta_warna}</td></tr>\`;
        html += \`<tr><th>Merokok / Alkohol</th><td>\${data.merokok} / \${data.alkohol}</td></tr>\`;
        html += '</tbody></table>';

        // Education
        html += '<h3 class="preview-section-title">Riwayat Pendidikan</h3>';
        html += '<table class="preview-table"><thead><tr><th>Periode</th><th>Sekolah</th><th>Status</th></tr></thead><tbody>';
        for (let i = 1; i <= 4; i++) {
            if (data[\`edu_school_\${i}\`]) {
                html += \`<tr>
                    <td>\${formatYear(data[\`edu_start_\${i}\`])} - \${formatYear(data[\`edu_end_\${i}\`])}</td>
                    <td>\${data[\`edu_school_\${i}\`]}</td>
                    <td>\${data[\`edu_cert_\${i}\`]}</td>
                </tr>\`;
            }
        }
        html += '</tbody></table>';

        // Work
        html += '<h3 class="preview-section-title">Riwayat Pekerjaan</h3>';
        html += '<table class="preview-table"><thead><tr><th>Periode</th><th>Perusahaan</th><th>Posisi</th></tr></thead><tbody>';
        let hasWork = false;
        for (let i = 1; i <= 4; i++) {
            if (data[\`work_company_\${i}\`]) {
                hasWork = true;
                html += \`<tr>
                    <td>\${formatYear(data[\`work_start_\${i}\`])} - \${formatYear(data[\`work_end_\${i}\`])}</td>
                    <td>\${data[\`work_company_\${i}\`]}</td>
                    <td>\${data[\`work_job_\${i}\`]}</td>
                </tr>\`;
            }
        }
        if (!hasWork) html += '<tr><td colspan="3" style="text-align:center;">Tidak ada riwayat pekerjaan</td></tr>';
        html += '</tbody></table>';

        // Family
        html += '<h3 class="preview-section-title">Anggota Keluarga</h3>';
        html += '<table class="preview-table"><thead><tr><th>Hubungan</th><th>Nama</th><th>Umur</th><th>Tinggal Bersama</th></tr></thead><tbody>';
        for (let i = 1; i <= 4; i++) {
            if (data[\`fam_name_\${i}\`]) {
                html += \`<tr>
                    <td>\${data[\`fam_rel_\${i}\`]}</td>
                    <td>\${data[\`fam_name_\${i}\`]}</td>
                    <td>\${data[\`fam_age_\${i}\`]}歳</td>
                    <td>\${data[\`fam_together_\${i}\`] === '〇' ? 'Ya' : 'Tidak'}</td>
                </tr>\`;
            }
        }
        html += '</tbody></table>';
        
        html += '</div>';
        
        document.getElementById("preview-container").innerHTML = html;
    }

    // EXCEL EXPORT
    function getFormData() {
        const formData = new FormData(document.getElementById("cv-form"));
        return Object.fromEntries(formData.entries());
    }

    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes.buffer;
    }

    async function generateExcelFile() {
        const data = getFormData();
        
        // Parse template from base64
        const buffer = base64ToArrayBuffer(TEMPLATE_BASE64);
        
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const sheet = workbook.worksheets[0];

        // Helper to update cell
        function updateCell(cellAddress, value) {
            if (value) {
                const cell = sheet.getCell(cellAddress);
                cell.value = value;
            }
        }

        // Tambahkan Foto jika ada
        if (data.foto_base64) {
            let ext = 'jpeg';
            if (data.foto_base64.indexOf('image/png') !== -1) ext = 'png';
            const base64Data = data.foto_base64.split(',')[1];
            
            const imageId = workbook.addImage({
                base64: base64Data,
                extension: ext,
            });
            
            // Ambil ukuran dan posisi pasti dari foto bawaan template (gambar ke-3)
            let anchor = 'M2:O8';
            if (sheet.getImages().length > 2) {
                const oldImage = sheet.getImages()[2];
                if (oldImage && oldImage.range) anchor = oldImage.range;
            }
            
            // Hapus placeholder foto bawaan template agar tidak menumpuk
            if (sheet._media && sheet._media.length > 2) {
                sheet._media.splice(2, 1);
            }
            
            // Menempatkan foto presisi di area foto yang lama
            sheet.addImage(imageId, anchor);
        }

        // Map data to cells based on our analysis
        updateCell('D4', data.furigana);
        updateCell('J4', data.status_pernikahan);
        updateCell('D5', data.nama);
        updateCell('J5', data.golongan_darah);
        
        // Format DOB
        if (data.tgl_lahir) {
            const date = new Date(data.tgl_lahir);
            const jpDate = \`\${date.getFullYear()}年\${String(date.getMonth() + 1).padStart(2, '0')}月\${String(date.getDate()).padStart(2, '0')}日\`;
            updateCell('D6', jpDate);
        }
        updateCell('J6', data.umur ? \`\${data.umur}歳\` : '');
        
        updateCell('D7', data.alamat);
        
        updateCell('C9', Number(data.tinggi) || data.tinggi);
        updateCell('G9', Number(data.berat) || data.berat);
        updateCell('J9', \`右目：\${data.mata_kanan}\\n左目：\${data.mata_kiri}\`);
        updateCell('N9', data.buta_warna);
        
        updateCell('C10', data.tangan_dominan);
        updateCell('G10', data.merokok);
        updateCell('J10', data.alkohol);
        updateCell('N10', data.riwayat_penyakit);
        
        updateCell('E12', data.mata_pelajaran);
        updateCell('J12', data.pengalaman_asrama);
        
        updateCell('E13', data.pendapatan);
        updateCell('J13', data.target_tabungan);
        
        updateCell('G15', data.alasan);
        updateCell('G16', data.pekerjaan_nanti);
        updateCell('G17', data.pengalaman_visa);

        // Education (Rows 21, 22, 23, 24)
        for(let i=1; i<=4; i++) {
            const row = 20 + i;
            updateCell(\`A\${row}\`, formatYear(data[\`edu_start_\${i}\`]));
            updateCell(\`D\${row}\`, formatYear(data[\`edu_end_\${i}\`]));
            updateCell(\`F\${row}\`, data[\`edu_school_\${i}\`]);
            updateCell(\`J\${row}\`, data[\`edu_cert_\${i}\`]);
        }

        // Work Exp (Rows 28, 29, 30, 31)
        for(let i=1; i<=4; i++) {
            const row = 27 + i;
            updateCell(\`A\${row}\`, formatYear(data[\`work_start_\${i}\`]));
            updateCell(\`D\${row}\`, formatYear(data[\`work_end_\${i}\`]));
            updateCell(\`F\${row}\`, data[\`work_company_\${i}\`]);
            updateCell(\`J\${row}\`, data[\`work_job_\${i}\`]);
        }

        // Family (Rows 34, 35, 36, 37)
        for(let i=1; i<=4; i++) {
            const row = 33 + i;
            if(data[\`fam_name_\${i}\`]) {
                updateCell(\`A\${row}\`, Number(i));
                updateCell(\`B\${row}\`, data[\`fam_name_\${i}\`]);
                updateCell(\`H\${row}\`, data[\`fam_rel_\${i}\`]);
                updateCell(\`I\${row}\`, data[\`fam_age_\${i}\`] ? data[\`fam_age_\${i}\`] + '歳' : '');
                updateCell(\`J\${row}\`, data[\`fam_job_\${i}\`]);
                
                if (data[\`fam_together_\${i}\`] === '〇') {
                    updateCell(\`K\${row}\`, '〇');
                    updateCell(\`N\${row}\`, '');
                } else {
                    updateCell(\`K\${row}\`, '');
                    updateCell(\`N\${row}\`, '〇');
                }
            }
        }

        updateCell('A41', data.hobi);
        updateCell('A43', data.kepribadian);
        updateCell('A47', data.komitmen);

        // Export with ExcelJS
        const newBuffer = await workbook.xlsx.writeBuffer();
        const safeName = (data.nama || 'CV').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = \`CV_\${safeName}.xlsx\`;
        
        const blob = new Blob([newBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return new File([blob], filename, { type: blob.type });
    }

    async function downloadExcel() {
        const btn = document.getElementById("btn-download");
        const originalText = btn.innerHTML;
        try {
            btn.innerHTML = "Memproses...";
            btn.disabled = true;

            const file = await generateExcelFile();
            const url = window.URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat membuat file Excel: " + error.message);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }


    // SHARE WHATSAPP
    function fillFakeData() {
        console.log("Starting fillFakeData...");
        
        const dummyData = {
            nama: "Budi Santoso",
            furigana: "ブディ サントソ",
            tgl_lahir: "2002-05-15",
            golongan_darah: "O型",
            status_pernikahan: "未婚",
            tinggi: "170",
            berat: "65",
            mata_kanan: "1.0",
            mata_kiri: "1.0",
            buta_warna: "無",
            tangan_dominan: "右",
            merokok: "無",
            alkohol: "無",
            riwayat_penyakit: "無",
            alamat: "JL. SUDIRMAN NO 123 JAKARTA",
            no_hp: "081234567890",
            mata_pelajaran: "溶接 (Pengelasan)",
            pengalaman_asrama: "有",
            pendapatan_rp: "3000000",
            target_tabungan_rp: "100000000",
            alasan: "日本の技術を学び、将来インドネシアで自分の会社を作りたいです。",
            pekerjaan_nanti: "溶接工として働き、経験を活かしたいです。",
            pengalaman_visa: "無",
            edu_start_1: "2009", edu_end_1: "2015", edu_school_1: "SDN 1 JAKARTA", edu_cert_1: "卒業証明書",
            edu_start_2: "2015", edu_end_2: "2018", edu_school_2: "SMPN 1 JAKARTA", edu_cert_2: "卒業証明書",
            edu_start_3: "2018", edu_end_3: "2021", edu_school_3: "SMKN 1 JAKARTA", edu_cert_3: "卒業証明書",
            edu_start_4: "2021", edu_end_4: "2025", edu_school_4: "UNIVERSITAS INDONESIA", edu_cert_4: "卒業証明書",
            work_start_1: "2025", work_end_1: "2026", work_company_1: "PT MAJU MUNDUR", work_job_1: "溶接工",
            work_start_2: "2026", work_end_2: "2027", work_company_2: "PT SEJAHTERA", work_job_2: "溶接工",
            fam_name_1: "SANTOSO", fam_rel_1: "父", fam_age_1: "50", fam_job_1: "会社員", fam_together_1: "〇",
            fam_name_2: "SITI", fam_rel_2: "母", fam_age_2: "45", fam_job_2: "主婦", fam_together_2: "〇",
            hobi: "サッカー、音楽鑑賞",
            kepribadian: "明るくて、新しいことを学ぶのが好きです。チームで協力することができます。",
            komitmen: "ルールを守り、一生懸命働きます。"
        };

        for (const [key, value] of Object.entries(dummyData)) {
            const el = document.getElementById(key);
            if (el) {
                el.value = value;
                const fg = el.closest('.form-group');
                if (fg) fg.classList.remove('has-error');
                
                // Trigger input event for each field so listeners like currency conversion work
                el.dispatchEvent(new Event('input', { bubbles: true }));
                if (key === 'tgl_lahir') {
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else {
                console.warn("Element with ID not found:", key);
            }
        }
        
        // Reveal family members generated by faker
        for (let i = 2; i <= 4; i++) {
            if (dummyData[\`fam_name_\${i}\`]) {
                const grp = document.getElementById(\`keluarga_group_\${i}\`);
                if (grp) grp.style.display = 'block';
                currentKeluargaCount = i;
            }
        }
        if (currentKeluargaCount >= 4) {
            document.getElementById('btn-add-keluarga').style.display = 'none';
        }

        for (let i = 2; i <= 4; i++) {
            if (dummyData[\`edu_school_\${i}\`]) {
                const grp = document.getElementById(\`pendidikan_group_\${i}\`);
                if (grp) grp.style.display = 'block';
                currentPendidikanCount = i;
            }
        }
        if (currentPendidikanCount >= 4) {
            document.getElementById('btn-add-pendidikan').style.display = 'none';
        }

        for (let i = 2; i <= 4; i++) {
            if (dummyData[\`work_company_\${i}\`]) {
                const grp = document.getElementById(\`pekerjaan_group_\${i}\`);
                if (grp) grp.style.display = 'block';
                currentKerjaCount = i;
            }
        }
        if (currentKerjaCount >= 4) {
            document.getElementById('btn-add-pekerjaan').style.display = 'none';
        }
        
        // Stay on current step or go to first step to show data
        currentStep = 1;
        updateUI();
        
        // Explicitly trigger age calculation
        calculateAge();
        
        alert("Data dummy berhasil diisi!");
        console.log("fillFakeData finished.");
    }

    function resetForm() {
        if (!confirm('Apakah Anda yakin ingin menghapus semua data dan kembali ke halaman pertama?')) {
            return;
        }
        
        // Reset form inputs
        document.getElementById('cv-form').reset();
        
        // Remove error classes
        document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
        
        // Reset photo
        hapusFoto();
        
        // Clear local storage
        localStorage.removeItem('cv_data');
        
        // Reset dynamic fields (Keluarga)
        for (let i = 2; i <= currentKeluargaCount; i++) {
            const group = document.getElementById(\`keluarga_group_\${i}\`);
            if (group) group.style.display = 'none';
        }
        currentKeluargaCount = 1;
        document.getElementById('btn-add-keluarga').style.display = 'block';
        
        // Reset dynamic fields (Pendidikan)
        for (let i = 2; i <= currentPendidikanCount; i++) {
            const group = document.getElementById(\`pendidikan_group_\${i}\`);
            if (group) group.style.display = 'none';
        }
        currentPendidikanCount = 1;
        document.getElementById('btn-add-pendidikan').style.display = 'block';
        
        // Reset dynamic fields (Pekerjaan)
        for (let i = 2; i <= currentKerjaCount; i++) {
            const group = document.getElementById(\`pekerjaan_group_\${i}\`);
            if (group) group.style.display = 'none';
        }
        currentKerjaCount = 1;
        document.getElementById('btn-add-pekerjaan').style.display = 'block';
        
        // Go back to step 1
        currentStep = 1;
        updateUI();
        
        // Trigger calculation updates if needed
        document.getElementById("cv-form").dispatchEvent(new Event('input'));
    }

    // WHATSAPP MODAL FUNCTIONS
    function showWhatsappModal() {
        console.log("Showing WhatsApp Modal");
        const modal = document.getElementById('whatsapp-modal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.error("WhatsApp modal element not found!");
        }
    }

    function closeWhatsappModal() {
        console.log("Closing WhatsApp Modal");
        const modal = document.getElementById('whatsapp-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function confirmWhatsapp() {
        console.log("Confirming WhatsApp sharing");
        closeWhatsappModal();
        shareWhatsApp();
    }

    async function shareWhatsApp() {
        const btn = document.getElementById("btn-wa");
        const originalText = btn.innerHTML;
        
        try {
            btn.innerHTML = "Memproses...";
            btn.disabled = true;

            const data = getFormData();
            const nama = data.nama || 'Siswa LPK';
            const hp = data.no_hp || '-';
            const targetTabungan = data.target_tabungan || '-';
            
            const text = \`Halo, ini data siswa LPK baru:\\nNama: \${nama}\\nNo. HP: \${hp}\\nTarget Tabungan: \${targetTabungan}\\nData lengkap terlampir dalam format Excel.\`;

            // Generate Excel File
            const file = await generateExcelFile();

            // Check if Web Share API is available AND can share the file
            let shared = false;
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: \`CV \${nama}\`,
                        text: text
                    });
                    shared = true;
                } catch (shareError) {
                    if (shareError.name === 'AbortError') {
                        // User cancelled the share sheet
                        return;
                    }
                    console.warn("Web Share failed, using fallback:", shareError);
                }
            }

            if (!shared) {
                // Fallback: Auto-download and Open WhatsApp Link
                
                // 1. Trigger Download
                const url = window.URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                // 2. Open WhatsApp
                const encodedText = encodeURIComponent(text + "\\n\\n(File Excel terunduh otomatis. Silakan lampirkan file tersebut secara manual)");
                const waUrl = \`https://api.whatsapp.com/send?text=\${encodedText}\`;
                
                const newWindow = window.open(waUrl, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    window.location.href = waUrl;
                }
                
                alert("File Excel telah diunduh otomatis karena batasan sistem/browser.\\n\\nSilakan lampirkan file '" + file.name + "' secara manual setelah WhatsApp terbuka.");
            }

        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan: " + error.message);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }


    let cropper = null;
    let originalImageData = null;

    function previewFoto(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto terlalu besar. Maksimal 5MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            originalImageData = e.target.result;
            openCropper(originalImageData);
        };
        reader.readAsDataURL(file);
    }
    function openCropper(imageData) {
        const modal = document.getElementById('cropper-modal');
        const img = document.getElementById('cropper-image');
        img.src = imageData;
        modal.style.display = 'flex';

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(img, {
            aspectRatio: 3 / 4,
            viewMode: 1,
            autoCropArea: 1
        });
    }

    function editFoto() {
        if (originalImageData) {
            openCropper(originalImageData);
        } else {
            alert("Tidak ada data foto asli untuk diedit.");
        }
    }


    function closeCropper() {
        document.getElementById('cropper-modal').style.display = 'none';
        document.getElementById('foto').value = '';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    function rotateCropper(degree) {
        if (cropper) {
            cropper.rotate(degree);
        }
    }

    function cropImage() {
        if (!cropper) return;

        // Mendapatkan canvas hasil crop dengan ukuran yang layak (misal lebar 600px)
        const canvas = cropper.getCroppedCanvas({
            width: 600,
            imageSmoothingQuality: 'high'
        });

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        document.getElementById('foto_preview').src = croppedDataUrl;
        document.getElementById('foto_base64').value = croppedDataUrl;
        document.getElementById('foto_preview_container').style.display = 'block';
        
        document.getElementById('cropper-modal').style.display = 'none';
        
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    function hapusFoto() {
        document.getElementById('foto').value = '';
        document.getElementById('foto_base64').value = '';
        document.getElementById('foto_preview').src = '';
        document.getElementById('foto_preview_container').style.display = 'none';
        originalImageData = null;
    }
</script>

    <!-- Cropper Modal -->
    <div id="cropper-modal" class="cropper-modal-overlay">
        <div class="cropper-container-wrapper">
            <h3 style="margin-top:0">Potong Foto (3:4)</h3>
            <div class="cropper-area">
                <img id="cropper-image" src="" style="max-width: 100%;">
            </div>
            <div class="cropper-footer" style="justify-content: space-between;">
                <div style="display: flex; gap: 5px;">
                    <button type="button" class="btn-secondary" onclick="rotateCropper(-90)" title="Rotate Left">↺</button>
                    <button type="button" class="btn-secondary" onclick="rotateCropper(90)" title="Rotate Right">↻</button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="button" class="btn-secondary" onclick="closeCropper()">Batal</button>
                    <button type="button" class="btn-primary" onclick="cropImage()">Potong & Simpan</button>
                </div>
            </div>
        </div>
    </div>

    <!-- WhatsApp Modal -->
    <div id="whatsapp-modal" class="whatsapp-modal-overlay" onclick="if(event.target === this) closeWhatsappModal()">
        <div class="whatsapp-modal-card">
            <div class="whatsapp-modal-header">
                <span style="font-size: 1.5rem;">⚠️</span>
                <h3>Perhatian Sebelum Berbagi 📎</h3>
            </div>
            <div class="whatsapp-modal-body">
                <p>WhatsApp tidak mendukung lampiran file otomatis. Setelah diarahkan ke WhatsApp, Anda perlu melampirkan file CV secara manual dengan langkah berikut:</p>
                <ol>
                    <li>File CV sudah otomatis terunduh ke perangkat Anda.</li>
                    <li>Di WhatsApp, klik ikon 📎 (lampiran).</li>
                    <li>Pilih file CV yang sudah diunduh.</li>
                    <li>Kirim ke kontak yang dituju.</li>
                </ol>
            </div>
            <div class="whatsapp-modal-footer">
                <button type="button" class="btn-secondary" onclick="closeWhatsappModal()">Batal</button>
                <button type="button" class="btn-success" id="btn-whatsapp-confirm" onclick="confirmWhatsapp()">Mengerti, Lanjut ke WhatsApp</button>
            </div>
        </div>
    </div>
</body>
</html>`;

const finalHtml = htmlContent.replace('__BASE64_PLACEHOLDER__', base64Str);
fs.writeFileSync(path.join(__dirname, 'index.html'), finalHtml);
console.log('index.html successfully created!');
