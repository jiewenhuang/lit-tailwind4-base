### lit+tailwindcss4+vite6 的基础项目模板

#### 集成

- lit
- tailwindcss4
- vite6
- typescript
- eslint
- prettier

#### 开始

```shell
bun install
```

```shell
bun run dev
```

```shell
bun run build
```

使用 `custom-lit-element` 来集成tailwindcss4，创建组件时直接继承即可，参考 my-element.ts

```typescript

import { TailwindLitElement } from './custom-lit-element.ts'
...
export class MyElement extends TailwindLitElement {
  // 使用renderContent()来渲染内容，以适配暗色模式
  renderContent(){}
}

```
#### 暗色模式
```html
<my-element themeAttr="class">
        <h1>Vite + Lit</h1>
    </my-element>

themeAttr为存放主题类名的属性名，默认为theme，例如class="dark"，则themeAttr="class";使用data-theme="dark"，则themeAttr="data-theme"

```
