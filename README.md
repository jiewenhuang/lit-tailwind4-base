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

import { CustomLitElement } from './custom-lit-element.ts'
...
export class MyElement extends CustomLitElement {}

```
