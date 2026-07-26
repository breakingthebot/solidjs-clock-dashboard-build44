// src/components/VaultBackupModal.tsx
// Vault Backup & Export/Import Configuration Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/vaultBackupService.ts
// Created: 2026-07-26

import { Component, createMemo, createSignal, Show } from 'solid-js';
import { ClockCardItem } from '../services/clockStore';
import { WatchFaceSkin } from '../services/themeStore';
import { exportToJson, exportToCsv, parseImportJson, DashboardVaultData } from '../services/vaultBackupService';

interface VaultBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  clocks: ClockCardItem[];
  activeSkin: WatchFaceSkin;
  isHourlyChimeEnabled: boolean;
  chimeVolume: number;
  onImportVault: (data: DashboardVaultData) => void;
}

export const VaultBackupModal: Component<VaultBackupModalProps> = (props) => {
  const [copySuccess, setCopySuccess] = createSignal(false);
  const [importError, setImportError] = createSignal('');
  const [importJsonText, setImportJsonText] = createSignal('');

  const currentVaultData = createMemo<DashboardVaultData>(() => ({
    version: '0.9.0',
    exportTimestamp: new Date().toISOString(),
    clocks: props.clocks,
    activeSkin: props.activeSkin,
    isHourlyChimeEnabled: props.isHourlyChimeEnabled,
    chimeVolume: props.chimeVolume
  }));

  const jsonExportStr = createMemo(() => exportToJson(currentVaultData()));
  const csvExportStr = createMemo(() => exportToCsv(props.clocks));

  const handleDownloadJson = () => {
    const blob = new Blob([jsonExportStr()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solid-clock-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([csvExportStr()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solid-clock-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonExportStr()).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleImportSubmit = () => {
    setImportError('');
    if (!importJsonText().trim()) {
      setImportError('Please paste a valid vault JSON configuration string.');
      return;
    }

    try {
      const parsed = parseImportJson(importJsonText());
      props.onImportVault(parsed);
      setImportJsonText('');
      props.onClose();
    } catch (e: any) {
      setImportError(e.message || 'Invalid JSON formatting.');
    }
  };

  const handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card vault-modal-card">
          <div class="modal-header">
            <div>
              <h2>💾 Timezone Vault Backup & Import/Export</h2>
              <p class="subtitle">Export custom timezone dashboard layouts & restore configuration files</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="vault-body">
            {/* Export Action Card */}
            <div class="card vault-section-card">
              <h4 class="section-title">📥 Export Dashboard Vault</h4>
              <p class="section-desc">Download complete configuration file or export clock list to spreadsheet format.</p>
              
              <div class="export-btn-row">
                <button type="button" onclick={handleDownloadJson} class="btn btn-primary">
                  📄 Download JSON Vault
                </button>
                <button type="button" onclick={handleDownloadCsv} class="btn btn-secondary">
                  📊 Export CSV Clocks
                </button>
                <button type="button" onclick={handleCopyJson} class="btn btn-secondary">
                  {copySuccess() ? '✅ Copied!' : '📋 Copy JSON text'}
                </button>
              </div>
            </div>

            {/* Import Action Card */}
            <div class="card vault-section-card">
              <h4 class="section-title">📤 Import & Restore Vault</h4>
              <p class="section-desc">Paste JSON backup configuration or upload a saved `.json` file to restore dashboard layout.</p>

              <div class="form-group">
                <label for="vault-file-upload" class="form-label">Upload JSON File</label>
                <input 
                  id="vault-file-upload"
                  type="file" 
                  accept=".json" 
                  class="form-input" 
                  onChange={handleFileUpload} 
                />
              </div>

              <div class="form-group">
                <label for="import-json-textarea" class="form-label">Or Paste Vault JSON Content</label>
                <textarea
                  id="import-json-textarea"
                  class="form-input code-textarea"
                  rows="4"
                  placeholder='{"version":"0.9.0","clocks":[...]}'
                  value={importJsonText()}
                  onInput={(e) => setImportJsonText(e.currentTarget.value)}
                />
              </div>

              <Show when={importError()}>
                <div class="error-banner">{importError()}</div>
              </Show>

              <button type="button" onclick={handleImportSubmit} class="btn btn-primary">
                ⚡ Restore Vault Config
              </button>
            </div>

            <div class="modal-actions">
              <button type="button" onclick={props.onClose} class="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
