// src/components/SkinSelectorModal.tsx
// Custom Themes & Analog Watch Face Skin Selector Modal for Solid.js.
// Connects to: src/App.tsx, src/services/themeStore.ts
// Created: 2026-07-26

import { Component, For, Show } from 'solid-js';
import { WATCH_SKINS, WatchFaceSkin } from '../services/themeStore';

interface SkinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkin: WatchFaceSkin;
  onSelectSkin: (skin: WatchFaceSkin) => void;
}

export const SkinSelectorModal: Component<SkinSelectorModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div class="modal-backdrop fade-in">
        <div class="modal-card card skin-modal-card">
          <div class="modal-header">
            <div>
              <h2>🎨 Watch Face Skin Selector</h2>
              <p class="subtitle">Personalize dashboard aesthetic & analog clock face styling</p>
            </div>
            <button type="button" onclick={props.onClose} class="close-btn">❌</button>
          </div>

          <div class="skin-grid">
            <For each={WATCH_SKINS}>
              {(skin) => (
                <div 
                  class="skin-option-card card"
                  classList={{ active: props.activeSkin === skin.id }}
                  onclick={() => {
                    props.onSelectSkin(skin.id);
                    props.onClose();
                  }}
                  style={{ background: skin.cardBg, "border-top-color": skin.accent }}
                >
                  <div class="skin-card-head">
                    <span class="skin-icon">{skin.icon}</span>
                    <strong class="skin-title">{skin.label}</strong>
                    {props.activeSkin === skin.id && <span class="active-badge">Active</span>}
                  </div>

                  <p class="skin-desc">{skin.description}</p>

                  <div class="skin-preview-swatch">
                    <span class="swatch-dot" style={{ background: skin.handHourColor }} title="Hour Hand" />
                    <span class="swatch-dot" style={{ background: skin.handMinColor }} title="Minute Hand" />
                    <span class="swatch-dot" style={{ background: skin.handSecColor }} title="Second Hand" />
                    <span class="swatch-dot" style={{ background: skin.accent }} title="Accent Color" />
                  </div>
                </div>
              )}
            </For>
          </div>

          <div class="modal-actions">
            <button type="button" onclick={props.onClose} class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </Show>
  );
};
