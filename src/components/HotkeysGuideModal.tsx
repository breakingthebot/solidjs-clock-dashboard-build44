// src/components/HotkeysGuideModal.tsx
// Keyboard Hotkeys & Shortcuts Guide Modal Component for Solid.js.
// Connects to: src/App.tsx, src/services/hotkeyService.ts
// Created: 2026-07-26

import { Component, For, Show } from 'solid-js';
import { HOTKEY_SHORTCUTS } from '../services/hotkeyService';

interface HotkeysGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeysGuideModal: Component<HotkeysGuideModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card hotkeys-modal-card">
          <div class="modal-header">
            <div>
              <h2>⌨️ Keyboard Shortcuts & Power Navigation</h2>
              <p class="subtitle">Quick keyboard hotkeys for instant dashboard navigation</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="hotkeys-body">
            <div class="hotkeys-grid">
              <For each={HOTKEY_SHORTCUTS}>
                {(shortcut) => (
                  <div class="hotkey-row card">
                    <kbd class="kbd-badge">{shortcut.displayKey}</kbd>
                    <span class="hotkey-desc">{shortcut.description}</span>
                  </div>
                )}
              </For>
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
