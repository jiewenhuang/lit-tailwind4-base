import { CustomLitElement } from './custom-lit-element.ts'

import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from '/vite.svg'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends CustomLitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <div class="mx-auto flex h-screen flex-col items-center justify-center space-y-4">
        <div class="flex space-x-4">
          <a href="https://vite.dev" target="_blank">
            <img src=${viteLogo} class="logo" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${litLogo} class="logo lit" alt="Lit logo" />
          </a>
        </div>
        <slot></slot>
        <div class="card rounded-lg bg-blue-500 p-4 text-white shadow-lg">
          <button @click=${this._onClick} part="button">count is ${this.count}</button>
        </div>
        <p class="read-the-docs">${this.docsHint}</p>
      </div>
    `
  }

  private _onClick() {
    this.count++
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
