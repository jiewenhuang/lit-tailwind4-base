import { LitElement } from 'lit'
import { adoptStyles, unsafeCSS } from 'lit'
import { html } from 'lit'
import { classMap as litClassMap } from 'lit/directives/class-map.js'

// 上述 样式文件
import style from './styles/tailwindcss.css?inline'

// 转换为 Lit 可使用的 css 样式表
const stylesheet = unsafeCSS(style)

/**
 * 全局单例主题服务，减少多个组件重复监听带来的性能开销
 */
class ThemeService {
  private static instance: ThemeService | null = null
  private observers = new Set<(isDark: boolean) => void>()
  private themeObserver: MutationObserver
  private readonly mediaQuery: MediaQueryList
  private _isDark: boolean = false

  private constructor(themeAttr: string = 'data-theme') {
    // 初始化时确定当前主题
    this._isDark = this.getCurrentThemeValue(themeAttr)

    // 设置 HTML 属性观察器
    this.themeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === themeAttr) {
          this.updateTheme(themeAttr)
          break
        }
      }
    })

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [themeAttr],
    })

    // 设置系统主题偏好观察器
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleMediaQueryChange = () => {
      if (document.documentElement.getAttribute(themeAttr) === null) {
        this.updateTheme(themeAttr)
      }
    }

    if ('addEventListener' in this.mediaQuery) {
      this.mediaQuery.addEventListener('change', handleMediaQueryChange)
    } else {
      // @ts-expect-error - 兼容旧版浏览器
      this.mediaQuery.addListener(handleMediaQueryChange)
    }
  }

  public static getInstance(themeAttr: string = 'data-theme'): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService(themeAttr)
    }
    return ThemeService.instance
  }

  public subscribe(callback: (isDark: boolean) => void): () => void {
    this.observers.add(callback)
    // 立即调用一次回调，使组件获得初始状态
    callback(this._isDark)
    // 返回取消订阅函数
    return () => {
      this.observers.delete(callback)
    }
  }

  private updateTheme(themeAttr: string): void {
    const newValue = this.getCurrentThemeValue(themeAttr)
    if (this._isDark !== newValue) {
      this._isDark = newValue
      this.notifyObservers()
    }
  }

  private getCurrentThemeValue(themeAttr: string): boolean {
    const themeValue = document.documentElement.getAttribute(themeAttr)
    if (themeValue === 'dark') {
      return true
    } else if (themeValue === 'light') {
      return false
    } else {
      // 跟随系统
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer(this._isDark)
    }
  }

  // 公共访问器
  public get isDark(): boolean {
    return this._isDark
  }
}

/**
 * 定义LitElement混入类的类型，避免与全局类型冲突
 */
export type TwLitMixin<T = unknown> = new (...args: any[]) => T & LitElement

/**
 * tailwind css 注入
 * @param superClass
 * @constructor
 */
export function TW<T extends TwLitMixin>(superClass: T): T {
  return class extends superClass {
    connectedCallback() {
      super.connectedCallback()
      adoptStyles(this.shadowRoot!, [stylesheet])
    }
  }
}

/**
 * 添加主题监听功能的 mixin
 * 使用单例服务来避免性能开销
 * @param superClass
 * @returns
 */
export function ThemeObserver<T extends TwLitMixin>(superClass: T): T {
  return class extends superClass {
    static properties = {
      themeAttr: { type: String },
      _isDarkMode: { type: Boolean, state: true },
    }

    private _isDarkMode = false
    themeAttr = 'data-theme'
    private unsubscribe: (() => void) | null = null

    connectedCallback() {
      super.connectedCallback()
      // 订阅主题服务
      this.unsubscribe = ThemeService.getInstance(this.themeAttr).subscribe((isDark) => {
        if (this._isDarkMode !== isDark) {
          this._isDarkMode = isDark
          this.requestUpdate()
        }
      })
    }

    disconnectedCallback() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
      super.disconnectedCallback()
    }

    /**
     * 包装组件内容的render方法，只在主题发生变化时重新渲染
     */
    render() {
      // 通过设置指定的类而不是整个类字符串，减少DOM差异计算
      const divClass = { dark: this._isDarkMode }
      return html`<div class=${litClassMap(divClass)}>${this.renderContent()}</div>`
    }

    /**
     * 子类必须实现此方法来提供内容
     */
    renderContent() {
      return html``
    }
  }
}

/**
 * 自定义扩展了 Lit 原生的组件
 * 用于支持Tailwind CSS深色模式
 *
 * 提供两个名称以保持向后兼容并避免命名冲突:
 * 1. TailwindLitElement - 推荐在新代码中使用的名称
 * 2. CustomLitElement - 保持向后兼容
 */
// 主要导出名称 - 建议在新代码中使用
export const TailwindLitElement = ThemeObserver(TW(LitElement))

// 为了保持向后兼容性
export const LitComponents = {
  CustomLitElement: TailwindLitElement,
}
