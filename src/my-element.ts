import { TailwindLitElement } from './custom-lit-element.ts'

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
export class MyElement extends TailwindLitElement {
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

  renderContent() {
    return html`
      <div class="mx-auto flex h-screen flex-col items-center justify-center space-y-4 bg-gray-100 dark:bg-gray-800">
        <div class="flex space-x-4">
          <a href="https://vite.dev" target="_blank">
            <img src=${viteLogo} class="logo" alt="Vite logo" />
          </a>
          <a href="https://lit.dev" target="_blank">
            <img src=${litLogo} class="logo lit" alt="Lit logo" />
          </a>
        </div>
        <slot class="text-gray-600 dark:text-white"></slot>
        <div class="card rounded-lg bg-blue-500 p-4 text-white shadow-lg dark:bg-blue-800">
          <button @click=${this._onClick} part="button">count is ${this.count}</button>
        </div>
        <p class="read-the-docs text-gray-700 dark:text-gray-300">${this.docsHint}</p>
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
